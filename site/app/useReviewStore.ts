"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  emptyReview,
  normalizeDecision,
  type ArtItem,
  type RenderReview,
  type ReviewMap,
} from "./review-types";

type PendingReview = {
  item: ArtItem;
  review: RenderReview;
};

type SyncState = "loading" | "saved" | "saving" | "offline";

const OUTBOX_KEY = "ashen-review-outbox-v1";

function mergeSuggestedTags(
  item: ArtItem,
  review: RenderReview,
): RenderReview {
  const existing = new Map(review.tags.map((tag) => [tag.key, tag]));
  for (const suggested of item.suggestedTags) {
    if (!existing.has(suggested.key)) {
      existing.set(suggested.key, { ...suggested, state: "suggested" });
    }
  }
  return { ...review, tags: Array.from(existing.values()) };
}

function readOutbox(): PendingReview[] {
  try {
    const stored = window.localStorage.getItem(OUTBOX_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? (parsed as PendingReview[]) : [];
  } catch {
    return [];
  }
}

function writeOutbox(entries: Iterable<PendingReview>) {
  try {
    window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(Array.from(entries)));
  } catch {
    // D1 remains authoritative; the outbox is only crash protection.
  }
}

export function useReviewStore(items: ArtItem[]) {
  const [reviews, setReviews] = useState<ReviewMap>({});
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const reviewsRef = useRef<ReviewMap>({});
  const outboxRef = useRef(new Map<string, PendingReview>());
  const flushingRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const commitReviews = useCallback((next: ReviewMap) => {
    reviewsRef.current = next;
    if (mountedRef.current) setReviews(next);
  }, []);

  const scheduleRetry = useCallback((flush: () => Promise<void>) => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null;
      void flush();
    }, 2_500);
  }, []);

  const flushOutbox = useCallback(async function flushOutboxInternal() {
    if (flushingRef.current || outboxRef.current.size === 0) {
      if (outboxRef.current.size === 0 && mountedRef.current) {
        setSyncState("saved");
      }
      return;
    }

    flushingRef.current = true;
    if (mountedRef.current) setSyncState("saving");

    try {
      while (outboxRef.current.size) {
        const pending = outboxRef.current.values().next()
          .value as PendingReview | undefined;
        if (!pending) break;

        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(pending),
        });
        if (!response.ok) {
          throw new Error(`Review save failed (${response.status})`);
        }

        const current = outboxRef.current.get(pending.review.renderId);
        if (current?.review.revision === pending.review.revision) {
          outboxRef.current.delete(pending.review.renderId);
          writeOutbox(outboxRef.current.values());
        }
      }

      if (mountedRef.current) setSyncState("saved");
    } catch {
      if (mountedRef.current) setSyncState("offline");
      scheduleRetry(flushOutboxInternal);
    } finally {
      flushingRef.current = false;
    }
  }, [scheduleRetry]);

  useEffect(() => {
    mountedRef.current = true;
    const pendingEntries = readOutbox();
    for (const pending of pendingEntries) {
      if (pending?.review?.renderId && pending?.item?.renderId) {
        outboxRef.current.set(pending.review.renderId, pending);
      }
    }

    const load = async () => {
      try {
        const [, response] = await Promise.all([
          fetch("/api/catalog", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ items }),
          }),
          fetch("/api/reviews"),
        ]);

        if (!response.ok) {
          throw new Error(`Review load failed (${response.status})`);
        }

        const payload = (await response.json()) as {
          reviews?: RenderReview[];
        };
        const next: ReviewMap = {};
        for (const review of payload.reviews ?? []) {
          next[review.renderId] = {
            ...review,
            decision: normalizeDecision(review.decision),
          };
        }
        for (const pending of outboxRef.current.values()) {
          const serverRevision = next[pending.review.renderId]?.revision ?? -1;
          if (pending.review.revision >= serverRevision) {
            next[pending.review.renderId] = pending.review;
          }
        }
        commitReviews(next);
        setSyncState(outboxRef.current.size ? "saving" : "saved");
        void flushOutbox();
      } catch {
        const buffered: ReviewMap = {};
        for (const pending of outboxRef.current.values()) {
          buffered[pending.review.renderId] = pending.review;
        }
        commitReviews(buffered);
        setSyncState("offline");
        scheduleRetry(flushOutbox);
      }
    };

    void load();

    const retry = () => void flushOutbox();
    window.addEventListener("online", retry);
    window.addEventListener("focus", retry);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("online", retry);
      window.removeEventListener("focus", retry);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [commitReviews, flushOutbox, items, scheduleRetry]);

  const getReview = useCallback(
    (item: ArtItem) => {
      const stored = reviews[item.renderId];
      return mergeSuggestedTags(item, stored ?? emptyReview(item));
    },
    [reviews],
  );

  const updateReview = useCallback(
    (
      item: ArtItem,
      update: (current: RenderReview) => RenderReview,
    ): RenderReview => {
      const current = mergeSuggestedTags(
        item,
        reviewsRef.current[item.renderId] ?? emptyReview(item),
      );
      const timestamp = new Date().toISOString();
      const changed = update(current);
      const next: RenderReview = {
        ...changed,
        renderId: item.renderId,
        revision: current.revision + 1,
        reviewedAt:
          changed.reviewedAt ??
          (changed.decision || changed.overallRating ? timestamp : null),
        updatedAt: timestamp,
      };

      commitReviews({
        ...reviewsRef.current,
        [item.renderId]: next,
      });
      outboxRef.current.set(item.renderId, { item, review: next });
      writeOutbox(outboxRef.current.values());
      setSyncState("saving");
      void flushOutbox();
      return next;
    },
    [commitReviews, flushOutbox],
  );

  return {
    reviews,
    syncState,
    getReview,
    updateReview,
    pendingCount: outboxRef.current.size,
  };
}
