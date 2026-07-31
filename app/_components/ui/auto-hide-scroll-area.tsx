"use client";

import { ScrollArea } from "@base-ui/react/scroll-area";
import type { ReactNode, Ref } from "react";

type AutoHideScrollAreaProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  horizontal?: boolean;
  viewportClassName?: string;
  viewportRef?: Ref<HTMLDivElement>;
};

function classes(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function AutoHideScrollArea({
  children,
  className,
  contentClassName,
  horizontal = false,
  viewportClassName,
  viewportRef,
}: AutoHideScrollAreaProps) {
  return (
    <ScrollArea.Root className={classes("auto-hide-scroll-area", className)}>
      <ScrollArea.Viewport
        ref={viewportRef}
        className={classes("auto-hide-scroll-viewport", viewportClassName)}
      >
        <ScrollArea.Content
          className={classes("auto-hide-scroll-content", contentClassName)}
        >
          {children}
        </ScrollArea.Content>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar className="auto-hide-scrollbar">
        <ScrollArea.Thumb className="auto-hide-scroll-thumb" />
      </ScrollArea.Scrollbar>

      {horizontal ? (
        <>
          <ScrollArea.Scrollbar
            className="auto-hide-scrollbar"
            orientation="horizontal"
          >
            <ScrollArea.Thumb className="auto-hide-scroll-thumb" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner className="auto-hide-scroll-corner" />
        </>
      ) : null}
    </ScrollArea.Root>
  );
}
