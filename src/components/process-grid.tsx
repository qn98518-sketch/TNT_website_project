"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import "./process-grid.css";

/** Share natural text heights across cards, including wrapped translations. */
export function ProcessGrid({ children }: { children: ReactNode }) {
  const gridRef = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const titles = Array.from(grid.querySelectorAll<HTMLElement>(".rf-process-title-text"));
    const descriptions = Array.from(grid.querySelectorAll<HTMLElement>(".rf-process-description-text"));
    let frame = 0;
    let disposed = false;
    function measure() {
      if (disposed) return;
      for (const [name, elements] of [["--process-title-height", titles], ["--process-description-height", descriptions]] as const) {
        const height = Math.ceil(Math.max(0, ...elements.map(element => element.getBoundingClientRect().height)));
        const value = `${height}px`;
        if (grid!.style.getPropertyValue(name) !== value) grid!.style.setProperty(name, value);
      }
    }
    function schedule() {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }
    measure();
    const observer = new ResizeObserver(schedule);
    [grid, ...titles, ...descriptions].forEach(element => observer.observe(element));
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);
    document.fonts?.addEventListener("loadingdone", schedule);
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      document.fonts?.removeEventListener("loadingdone", schedule);
      cancelAnimationFrame(frame);
    };
  }, [children]);

  return <ol className="rf-process-grid" ref={gridRef}>{children}</ol>;
}
