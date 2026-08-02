"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AutoHideScrollArea } from "../../_components/ui/auto-hide-scroll-area";
import {
  type AttemptItem,
  type GalleryItem,
  type RenderReview,
  type ReviewDecision,
  type ReviewDefect,
} from "../../review-types";
import type { CatalogOutcome } from "./catalog-outcome-control";
import { ReviewCompleteState } from "./review-complete-state";
import {
  DECISIONS,
  DEFECTS,
  DETAIL_DECISIONS,
  QUEUE_LABELS,
  type DefectOption,
} from "./review-config";
import { ReviewDeskHeader } from "./review-desk-header";
import {
  combinedFeedback,
  defaultSeverity,
  mergeDrafts,
  nextSeverity,
} from "./review-model";
import { ReviewPanel } from "./review-panel";
import { queueMatches, type ReviewQueue } from "./review-queue";
import { ReviewStage } from "./review-stage";
import type { useReviewStore } from "./use-review-store";

export type { ReviewQueue } from "./review-queue";

export type ReviewStore = ReturnType<typeof useReviewStore>;

export function ReviewDesk({
  items,
  store,
  initialRenderId,
  initialQueue = "unreviewed",
  comparisonItemsByRenderId,
  onPromoteCandidate,
  onClose,
}: {
  items: GalleryItem[];
  store: ReviewStore;
  initialRenderId?: string;
  initialQueue?: ReviewQueue;
  comparisonItemsByRenderId?: ReadonlyMap<string, GalleryItem>;
  onPromoteCandidate?: (
    candidate: AttemptItem,
    placement: "variant" | "replace",
  ) => Promise<void>;
  onClose: () => void;
}) {
  const { reviews, syncState, getReview, updateReview } = store;
  const [queue, setQueue] = useState<ReviewQueue>(initialQueue);
  const [currentId, setCurrentId] = useState(initialRenderId ?? "");
  const [detailMode, setDetailMode] = useState(false);
  const [catalogOutcomePending, setCatalogOutcomePending] =
    useState<CatalogOutcome | null>(null);
  const [catalogOutcomeError, setCatalogOutcomeError] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const undoRef = useRef<{ item: GalleryItem; review: RenderReview }[]>([]);
  const redoRef = useRef<{ item: GalleryItem; review: RenderReview }[]>([]);

  const queueItems = useMemo(
    () =>
      items.filter((item) =>
        queueMatches(queue, item, reviews[item.renderId]),
      ),
    [items, queue, reviews],
  );

  const pinnedItem = items.find((item) => item.renderId === currentId);
  const current =
    queueItems.find((item) => item.renderId === currentId) ??
    (detailMode ? pinnedItem : undefined) ??
    queueItems[0];
  const currentIndex = current
    ? queueItems.findIndex((item) => item.renderId === current.renderId)
    : -1;
  const review = current ? getReview(current) : null;
  const comparisonItem = current
    ? comparisonItemsByRenderId?.get(current.renderId)
    : undefined;
  const comparisonReview = comparisonItem
    ? reviews[comparisonItem.renderId]
    : undefined;

  const queueCounts = useMemo(() => {
    const counts = {} as Record<ReviewQueue, number>;
    for (const key of Object.keys(QUEUE_LABELS) as ReviewQueue[]) {
      counts[key] = items.filter((item) =>
        queueMatches(key, item, reviews[item.renderId]),
      ).length;
    }
    return counts;
  }, [items, reviews]);

  /* Reset transient controls when the selected render changes. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setDetailMode(
      Boolean(review?.decision && DETAIL_DECISIONS.has(review.decision)),
    );
    setFeedbackDraft(combinedFeedback(review?.note, review?.correctionNote));
    setCatalogOutcomePending(null);
    setCatalogOutcomeError("");
    setMessage("");
  }, [current?.renderId]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  const applyReview = useCallback(
    (
      item: GalleryItem,
      change: (value: RenderReview) => RenderReview,
      remember = true,
    ) => {
      const before = getReview(item);
      if (remember) {
        undoRef.current.push({ item, review: before });
        if (undoRef.current.length > 30) undoRef.current.shift();
      }
      redoRef.current = [];
      return updateReview(item, change);
    },
    [getReview, updateReview],
  );

  const saveDrafts = useCallback(() => {
    if (!current || !review) return;
    if (feedbackDraft === combinedFeedback(review.note, review.correctionNote)) {
      return;
    }
    applyReview(
      current,
      (value) => mergeDrafts(value, feedbackDraft),
      false,
    );
  }, [applyReview, current, feedbackDraft, review]);

  const move = useCallback(
    (direction: -1 | 1) => {
      saveDrafts();
      if (!queueItems.length || currentIndex < 0) return;
      const index =
        (currentIndex + direction + queueItems.length) % queueItems.length;
      setCurrentId(queueItems[index].renderId);
    },
    [currentIndex, queueItems, saveDrafts],
  );

  const advanceAfterReview = useCallback(() => {
    if (!current || !queueItems.length) return;
    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % queueItems.length : 0;
    const next = queueItems[nextIndex];
    if (next) setCurrentId(next.renderId);
  }, [current, currentIndex, queueItems]);

  const setRating = useCallback(
    (rating: number) => {
      if (!current) return;
      const comparisonMode =
        "sourceKind" in current && current.sourceKind === "redo-staging";
      const autoKeep = rating === 5 && !comparisonMode;
      applyReview(current, (value) => ({
        ...mergeDrafts(value, feedbackDraft),
        overallRating: rating,
        ...(autoKeep
          ? {
              decision: "keep" as ReviewDecision,
              deletionState: "none" as const,
            }
          : {}),
      }));
      setMessage(
        autoKeep
          ? "5 / 5 · KEEP"
          : comparisonMode
            ? `${rating} / 5 · CHOOSE CATALOG OUTCOME`
            : `${rating} / 5`,
      );
      if (autoKeep) advanceAfterReview();
    },
    [advanceAfterReview, applyReview, current, feedbackDraft],
  );

  const chooseDecision = useCallback(
    (decision: ReviewDecision) => {
      if (!current || !review) return;
      const latestReview = getReview(current);
      if (decision !== "delete" && !latestReview.overallRating) {
        setMessage("RATE 1–5 FIRST");
        return;
      }
      const option = DECISIONS.find(
        (candidate) => candidate.value === decision,
      );
      applyReview(current, (value) => ({
        ...mergeDrafts(value, feedbackDraft),
        decision,
        deletionState: decision === "delete" ? "marked" : "none",
      }));
      setMessage(option?.label.toLocaleUpperCase() ?? decision);

      if (option?.detail) {
        setDetailMode(true);
      } else {
        advanceAfterReview();
      }
    },
    [
      advanceAfterReview,
      applyReview,
      current,
      feedbackDraft,
      getReview,
      review,
    ],
  );

  const chooseCatalogOutcome = useCallback(
    async (outcome: CatalogOutcome) => {
      if (
        !current ||
        !("sourceKind" in current) ||
        current.sourceKind !== "redo-staging" ||
        catalogOutcomePending
      ) {
        return;
      }
      if (outcome === "original") {
        chooseDecision("delete");
        return;
      }
      if (outcome === "redo") {
        chooseDecision("reject");
        return;
      }

      const latestReview = getReview(current);
      if (!latestReview.overallRating) {
        setMessage("RATE 1–5 FIRST");
        return;
      }
      if (!onPromoteCandidate) {
        setCatalogOutcomeError("Catalog placement is unavailable.");
        return;
      }

      setCatalogOutcomePending(outcome);
      setCatalogOutcomeError("");
      setMessage(outcome === "both" ? "ADDING CATALOG VARIANT" : "REPLACING ORIGINAL");
      try {
        await onPromoteCandidate(
          current as AttemptItem,
          outcome === "both" ? "variant" : "replace",
        );
        applyReview(current, (value) => ({
          ...mergeDrafts(value, feedbackDraft),
          decision: "keep",
          deletionState: "none",
        }));
        setMessage(
          outcome === "both"
            ? "BOTH KEPT · VARIANT ADDED"
            : "NEW KEPT · ORIGINAL ARCHIVED",
        );
        advanceAfterReview();
      } catch (error) {
        setCatalogOutcomeError(
          error instanceof Error ? error.message : "Catalog placement failed.",
        );
        setMessage("CATALOG PLACEMENT FAILED");
      } finally {
        setCatalogOutcomePending(null);
      }
    },
    [
      advanceAfterReview,
      applyReview,
      catalogOutcomePending,
      chooseDecision,
      current,
      feedbackDraft,
      getReview,
      onPromoteCandidate,
    ],
  );

  const toggleDefect = useCallback(
    (option: DefectOption) => {
      if (!current || !review) return;
      applyReview(current, (value) => {
        const existing = value.defects.find(
          (defect) => defect.key === option.key,
        );
        return {
          ...mergeDrafts(value, feedbackDraft),
          defects: existing
            ? value.defects.filter((defect) => defect.key !== option.key)
            : [
                ...value.defects,
                {
                  key: option.key,
                  label: option.label,
                  severity: defaultSeverity(value.decision),
                },
              ],
        };
      });
    },
    [applyReview, current, feedbackDraft, review],
  );

  const cycleDefectSeverity = useCallback(
    (defect: ReviewDefect) => {
      if (!current) return;
      applyReview(current, (value) => ({
        ...value,
        defects: value.defects.map((candidate) =>
          candidate.key === defect.key
            ? { ...candidate, severity: nextSeverity(candidate.severity) }
            : candidate,
        ),
      }));
    },
    [applyReview, current],
  );

  const cycleTag = useCallback(
    (key: string) => {
      if (!current) return;
      applyReview(current, (value) => ({
        ...value,
        tags: value.tags.map((tag) => {
          if (tag.key !== key) return tag;
          if (tag.state === "suggested") return { ...tag, state: "confirmed" };
          if (tag.state === "confirmed") return { ...tag, state: "rejected" };
          return { ...tag, state: "suggested" };
        }),
      }));
    },
    [applyReview, current],
  );

  const finishDetail = useCallback(() => {
    if (!current || !review) return;
    saveDrafts();
    setDetailMode(false);
    advanceAfterReview();
  }, [advanceAfterReview, current, review, saveDrafts]);

  const undo = useCallback(() => {
    const previous = undoRef.current.pop();
    if (!previous) {
      setMessage("NOTHING TO UNDO");
      return;
    }
    redoRef.current.push({
      item: previous.item,
      review: getReview(previous.item),
    });
    updateReview(previous.item, () => previous.review);
    setCurrentId(previous.item.renderId);
    setMessage("UNDONE");
  }, [getReview, updateReview]);

  const redo = useCallback(() => {
    const next = redoRef.current.pop();
    if (!next) {
      setMessage("NOTHING TO REDO");
      return;
    }
    undoRef.current.push({ item: next.item, review: getReview(next.item) });
    updateReview(next.item, () => next.review);
    setCurrentId(next.item.renderId);
    setMessage("REDONE");
  }, [getReview, updateReview]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if (isTyping) {
        if (event.key === "Escape") {
          (target as HTMLElement).blur();
          event.preventDefault();
        }
        if (event.key === "Enter" && event.shiftKey) {
          event.preventDefault();
          (target as HTMLElement).blur();
          if (detailMode) finishDetail();
          else move(1);
        }
        return;
      }

      if (/^[1-5]$/.test(event.key)) {
        event.preventDefault();
        setRating(Number(event.key));
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        if (detailMode) setDetailMode(false);
        else onClose();
        return;
      }
      if (event.key === "Enter" && detailMode) {
        event.preventDefault();
        finishDetail();
        return;
      }
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        noteRef.current?.focus();
        return;
      }

      if (detailMode) {
        const defect = DEFECTS.find(
          (option) => option.shortcut.toLowerCase() === event.key.toLowerCase(),
        );
        if (defect) {
          event.preventDefault();
          toggleDefect(defect);
        }
        return;
      }

      if (
        current &&
        "sourceKind" in current &&
        current.sourceKind === "redo-staging"
      ) {
        const key = event.key.toLowerCase();
        const outcome: CatalogOutcome | undefined =
          key === "o"
            ? "original"
            : key === "b"
              ? "both"
              : key === "n"
                ? "new"
                : key === "r"
                  ? "redo"
                  : undefined;
        if (outcome) {
          event.preventDefault();
          void chooseCatalogOutcome(outcome);
        }
        return;
      }

      const decision = DECISIONS.find(
        (option) => option.shortcut.toLowerCase() === event.key.toLowerCase(),
      );
      if (decision) {
        event.preventDefault();
        chooseDecision(decision.value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    chooseDecision,
    chooseCatalogOutcome,
    current,
    detailMode,
    finishDetail,
    move,
    onClose,
    redo,
    setRating,
    toggleDefect,
    undo,
  ]);

  if (!current || !review) {
    return (
      <ReviewCompleteState
        onClose={onClose}
        onReviewAll={() => setQueue("all")}
      />
    );
  }

  return (
    <div className="review-desk" role="dialog" aria-modal="true">
      <ReviewDeskHeader
        currentName={current.name}
        queue={queue}
        queueCounts={queueCounts}
        onQueueChange={(nextQueue) => {
          saveDrafts();
          setQueue(nextQueue);
          setCurrentId("");
          setDetailMode(false);
        }}
        currentIndex={currentIndex}
        queueItemsLength={queueItems.length}
        syncState={syncState}
        onClose={onClose}
      />

      <AutoHideScrollArea
        className="review-workspace-scroll"
        contentClassName="review-workspace"
      >
        <ReviewStage
          current={current}
          original={comparisonItem}
          compareWithCatalog={"sourceKind" in current}
          catalogOutcomeMode={
            "sourceKind" in current && current.sourceKind === "redo-staging"
          }
          onPrevious={() => move(-1)}
          onNext={() => move(1)}
          message={message}
        />

        <ReviewPanel
          review={review}
          detailMode={detailMode}
          comparisonMode={
            "sourceKind" in current && current.sourceKind === "redo-staging"
          }
          originalName={comparisonItem?.name}
          originalReview={comparisonReview}
          catalogOutcomePending={catalogOutcomePending}
          catalogOutcomeError={catalogOutcomeError}
          onSetRating={setRating}
          onChooseDecision={chooseDecision}
          onChooseCatalogOutcome={(outcome) => {
            void chooseCatalogOutcome(outcome);
          }}
          onCycleTag={cycleTag}
          onToggleDefect={toggleDefect}
          onCycleDefectSeverity={cycleDefectSeverity}
          feedbackDraft={feedbackDraft}
          onFeedbackDraftChange={setFeedbackDraft}
          onSaveDrafts={saveDrafts}
          noteRef={noteRef}
          onFinishDetail={finishDetail}
        />
      </AutoHideScrollArea>
    </div>
  );
}
