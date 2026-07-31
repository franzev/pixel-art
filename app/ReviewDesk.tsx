"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AutoHideScrollArea } from "./AutoHideScrollArea";
import {
  type DefectSeverity,
  type GalleryItem,
  type RenderReview,
  type ReviewDecision,
  type ReviewDefect,
} from "./review-types";
import type { useReviewStore } from "./useReviewStore";

export type ReviewQueue =
  "unreviewed" | "all" | "kept" | "rejected" | "deletion" | "favorites";

export type ReviewStore = ReturnType<typeof useReviewStore>;

type DecisionOption = {
  value: ReviewDecision;
  label: string;
  shortcut: string;
  detail: boolean;
};

type DefectOption = {
  key: string;
  label: string;
  shortcut: string;
};

const QUEUE_LABELS: Record<ReviewQueue, string> = {
  unreviewed: "Unreviewed",
  all: "All renders",
  kept: "Kept",
  rejected: "Rejected · redo",
  deletion: "Marked for deletion",
  favorites: "Five-star anchors",
};

const DECISIONS: DecisionOption[] = [
  { value: "keep", label: "Keep", shortcut: "K", detail: false },
  { value: "reject", label: "Reject · redo", shortcut: "R", detail: true },
  { value: "delete", label: "Delete · next", shortcut: "D", detail: false },
];

const DEFECTS: DefectOption[] = [
  { key: "proportions", label: "Wrong proportions", shortcut: "P" },
  { key: "anatomy", label: "Anatomy or limbs", shortcut: "A" },
  { key: "hands-fingers", label: "Hands or fingers", shortcut: "F" },
  { key: "weapon-handling", label: "Weapon handling", shortcut: "H" },
  { key: "weapon-too-short", label: "Weapon too short", shortcut: "L" },
  { key: "weapon-bent", label: "Bent / crooked weapon", shortcut: "B" },
  { key: "wrong-weapon-design", label: "Wrong weapon design", shortcut: "W" },
  { key: "magic-effects", label: "Unwanted magic / effects", shortcut: "M" },
  { key: "silhouette-pose", label: "Silhouette or pose", shortcut: "S" },
  {
    key: "duplicate-repetition",
    label: "Feels repetitive / samey",
    shortcut: "Q",
  },
  { key: "costume", label: "Costume or styling", shortcut: "C" },
  { key: "technical", label: "Technical failure", shortcut: "T" },
];

const DETAIL_DECISIONS = new Set(
  DECISIONS.filter((decision) => decision.detail).map(
    (decision) => decision.value,
  ),
);

const SYNC_LABELS = {
  loading: "LOADING REVIEWS",
  saved: "ALL SAVED",
  saving: "SAVING",
  offline: "BUFFERED LOCALLY",
} as const;

function queueMatches(
  queue: ReviewQueue,
  item: GalleryItem,
  review?: RenderReview,
) {
  if (queue === "all") return true;
  if (queue === "unreviewed") {
    return item.status !== "rejected" && !review?.decision;
  }
  if (queue === "kept") return review?.decision === "keep";
  if (queue === "rejected") return review?.decision === "reject";
  if (queue === "deletion") return review?.deletionState === "marked";
  if (queue === "favorites") return review?.overallRating === 5;
  return Boolean(item);
}

function ReviewCanvasImage({ item }: { item: GalleryItem }) {
  const [originalLoaded, setOriginalLoaded] = useState(false);

  return (
    <span
      className="review-image-stack"
      data-original-loaded={originalLoaded ? "true" : "false"}
      style={
        {
          "--review-aspect-ratio": `${item.width} / ${item.height}`,
        } as CSSProperties
      }
    >
      <Image
        className="review-canvas-preview"
        src={item.url}
        alt=""
        fill
        sizes="(max-width: 760px) 92vw, 760px"
        quality={82}
        // vinext fill images default to inline `object-fit: cover`; the
        // review canvas must never crop the render.
        style={{ objectFit: "contain" }}
      />
      {/* The review surface must load the exact source PNG, not a transform. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="review-canvas-original"
        src={item.url}
        alt={item.name}
        decoding="async"
        onLoad={() => setOriginalLoaded(true)}
      />
      <span className="review-image-loading" aria-live="polite">
        Loading full resolution
      </span>
    </span>
  );
}

function defaultSeverity(decision: ReviewDecision | null): DefectSeverity {
  if (decision === "delete") return "fatal";
  return "major";
}

function nextSeverity(value: DefectSeverity): DefectSeverity {
  if (value === "minor") return "major";
  if (value === "major") return "fatal";
  return "minor";
}

function mergeDrafts(
  review: RenderReview,
  note: string,
  correctionNote: string,
) {
  return {
    ...review,
    note,
    correctionNote,
  };
}

export function ReviewDesk({
  items,
  store,
  initialRenderId,
  initialQueue = "unreviewed",
  onClose,
}: {
  items: GalleryItem[];
  store: ReviewStore;
  initialRenderId?: string;
  initialQueue?: ReviewQueue;
  onClose: () => void;
}) {
  const { reviews, syncState, getReview, updateReview } = store;
  const [queue, setQueue] = useState<ReviewQueue>(initialQueue);
  const [currentId, setCurrentId] = useState(initialRenderId ?? "");
  const [detailMode, setDetailMode] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [message, setMessage] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [correctionDraft, setCorrectionDraft] = useState("");
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const undoRef = useRef<{ item: GalleryItem; review: RenderReview }[]>([]);

  const queueItems = useMemo(
    () =>
      items.filter((item) => queueMatches(queue, item, reviews[item.renderId])),
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
    setNoteDraft(review?.note ?? "");
    setCorrectionDraft(review?.correctionNote ?? "");
    setZoomed(false);
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
      return updateReview(item, change);
    },
    [getReview, updateReview],
  );

  const saveDrafts = useCallback(() => {
    if (!current || !review) return;
    if (
      noteDraft === review.note &&
      correctionDraft === review.correctionNote
    ) {
      return;
    }
    applyReview(
      current,
      (value) => mergeDrafts(value, noteDraft, correctionDraft),
      false,
    );
  }, [applyReview, correctionDraft, current, noteDraft, review]);

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
      const autoKeep = rating === 5;
      applyReview(current, (value) => ({
        ...mergeDrafts(value, noteDraft, correctionDraft),
        overallRating: rating,
        ...(autoKeep
          ? {
              decision: "keep" as ReviewDecision,
              deletionState: "none" as const,
            }
          : {}),
      }));
      setMessage(autoKeep ? "5 / 5 · KEEP" : `${rating} / 5`);
      if (autoKeep) advanceAfterReview();
    },
    [advanceAfterReview, applyReview, correctionDraft, current, noteDraft],
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
        ...(decision === "delete"
          ? value
          : mergeDrafts(value, noteDraft, correctionDraft)),
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
      correctionDraft,
      current,
      getReview,
      noteDraft,
      review,
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
          ...mergeDrafts(value, noteDraft, correctionDraft),
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
    [applyReview, correctionDraft, current, noteDraft, review],
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
    updateReview(previous.item, () => previous.review);
    setCurrentId(previous.item.renderId);
    setMessage("UNDONE");
  }, [updateReview]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
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
      if (event.key === " ") {
        event.preventDefault();
        setZoomed((value) => !value);
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
    detailMode,
    finishDetail,
    move,
    onClose,
    setRating,
    toggleDefect,
    undo,
  ]);

  if (!current || !review) {
    return (
      <div className="review-desk" role="dialog" aria-modal="true">
        <header className="review-topbar">
          <strong>REVIEW DESK</strong>
          <button type="button" onClick={onClose}>
            CLOSE <kbd>ESC</kbd>
          </button>
        </header>
        <div className="review-complete">
          <span>QUEUE COMPLETE</span>
          <h2>No renders need attention here.</h2>
          <p>
            Choose another queue or return to the contact sheet. New renders
            will appear in Unreviewed after the local index refreshes.
          </p>
          <div>
            <button type="button" onClick={() => setQueue("all")}>
              REVIEW ALL
            </button>
            <button type="button" onClick={onClose}>
              RETURN TO GALLERY
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-desk" role="dialog" aria-modal="true">
      <header className="review-topbar">
        <div className="review-title">
          <span>REVIEW DESK</span>
          <strong>{current.name}</strong>
        </div>
        <label className="review-queue-picker">
          <span className="sr-only">Review queue</span>
          <select
            value={queue}
            onChange={(event) => {
              saveDrafts();
              setQueue(event.target.value as ReviewQueue);
              setCurrentId("");
              setDetailMode(false);
            }}
          >
            {(Object.keys(QUEUE_LABELS) as ReviewQueue[]).map((key) => (
              <option key={key} value={key}>
                {QUEUE_LABELS[key]} · {queueCounts[key]}
              </option>
            ))}
          </select>
        </label>
        <div className="review-progress">
          <span>
            {Math.max(currentIndex + 1, 1)} / {queueItems.length}
          </span>
          <small data-sync={syncState}>{SYNC_LABELS[syncState]}</small>
        </div>
        <button className="review-close" type="button" onClick={onClose}>
          CLOSE <kbd>ESC</kbd>
        </button>
      </header>

      <AutoHideScrollArea
        className="review-workspace-scroll"
        contentClassName="review-workspace"
      >
        <section className="review-stage">
          <AutoHideScrollArea
            className={zoomed ? "review-canvas is-zoomed" : "review-canvas"}
            horizontal
          >
            <button
              className="review-canvas-action"
              type="button"
              onClick={() => setZoomed((value) => !value)}
              aria-label="Toggle render zoom"
            >
              <ReviewCanvasImage key={current.renderId} item={current} />
            </button>
          </AutoHideScrollArea>
          <div className="review-stage-meta">
            <button type="button" onClick={() => move(-1)}>
              ← PREVIOUS
            </button>
            <div>
              <span>{current.collection}</span>
              <strong>
                {current.width}×{current.height}
              </strong>
            </div>
            <button type="button" onClick={() => move(1)}>
              NEXT →
            </button>
          </div>
          <div className="review-shortcuts" aria-hidden="true">
            <span>
              <kbd>1–5</kbd> RATE
            </span>
            <span>
              <kbd>K</kbd> KEEP
            </span>
            <span>
              <kbd>R</kbd> REJECT
            </span>
            <span>
              <kbd>D</kbd> DELETE QUEUE
            </span>
            <span>
              <kbd>SPACE</kbd> ZOOM
            </span>
          </div>
          {message ? <div className="review-message">{message}</div> : null}
        </section>

        <aside className="review-panel">
          <AutoHideScrollArea>
            <section className="rating-section">
              <div className="review-section-heading">
                <span>OVERALL RATING</span>
                <strong>{review.overallRating ?? "—"} / 5</strong>
              </div>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={
                      review.overallRating === rating ? "is-active" : undefined
                    }
                    onClick={() => setRating(rating)}
                    aria-pressed={review.overallRating === rating}
                  >
                    <kbd>{rating}</kbd>
                    <span>
                      {rating === 1 ? "Reject" : rating === 5 ? "Anchor" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="decision-section">
              <div className="review-section-heading">
                <span>DECISION</span>
                {review.decision ? (
                  <strong>{review.decision.toLocaleUpperCase()}</strong>
                ) : null}
              </div>
              <div className="decision-grid">
                {DECISIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      review.decision === option.value ? "is-active" : undefined
                    }
                    onClick={() => chooseDecision(option.value)}
                    aria-pressed={review.decision === option.value}
                  >
                    <kbd>{option.shortcut}</kbd>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="tag-section">
              <div className="review-section-heading">
                <span>SUGGESTED TAGS</span>
                <small>CLICK: CONFIRM → REJECT → RESET</small>
              </div>
              <div className="review-tags">
                {review.tags.map((tag) => (
                  <button
                    key={tag.key}
                    type="button"
                    data-state={tag.state}
                    onClick={() => cycleTag(tag.key)}
                    title={`${tag.source} · ${Math.round(tag.confidence * 100)}% confidence`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </section>

            {detailMode || review.defects.length ? (
              <section className="defect-section">
                <div className="review-section-heading">
                  <span>WHAT FAILED?</span>
                  <small>SELECT ALL THAT APPLY</small>
                </div>
                <div className="defect-list">
                  {DEFECTS.map((option) => {
                    const selected = review.defects.find(
                      (defect) => defect.key === option.key,
                    );
                    return (
                      <div
                        key={option.key}
                        className={selected ? "is-selected" : undefined}
                      >
                        <button
                          type="button"
                          onClick={() => toggleDefect(option)}
                          aria-pressed={Boolean(selected)}
                        >
                          <kbd>{option.shortcut}</kbd>
                          <span>{option.label}</span>
                        </button>
                        {selected ? (
                          <button
                            className="severity-button"
                            type="button"
                            data-severity={selected.severity}
                            onClick={() => cycleDefectSeverity(selected)}
                            aria-label={`Change ${option.label} severity`}
                          >
                            {selected.severity}
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <section className="feedback-section">
              <label>
                <span>FEEDBACK</span>
                <textarea
                  ref={noteRef as RefObject<HTMLTextAreaElement>}
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  onBlur={saveDrafts}
                  placeholder="What do you like or dislike?"
                  rows={3}
                />
              </label>
              <label>
                <span>NEXT ATTEMPT</span>
                <textarea
                  value={correctionDraft}
                  onChange={(event) => setCorrectionDraft(event.target.value)}
                  onBlur={saveDrafts}
                  placeholder="Preserve… Change…"
                  rows={3}
                />
              </label>
            </section>

            {detailMode ? (
              <button
                className="finish-review"
                type="button"
                onClick={finishDetail}
              >
                SAVE &amp; NEXT <kbd>ENTER</kbd>
              </button>
            ) : null}
          </AutoHideScrollArea>
        </aside>
      </AutoHideScrollArea>
    </div>
  );
}
