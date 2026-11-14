"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/** Keep complete CTA labels on one row, scaling the whole row only when needed. */
export function ResponsiveActions({ children, className = "" }: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const row = rowRef.current;
    if (!container || !row) return;
    let active = true;
    let frame = 0;

    function fit() {
      if (!active || !container || !row) return;
      // offsetWidth/Height exclude transforms, so repeated measurements do not
      // compound the scale. Reserve two pixels for fractional layout rounding.
      const available = container.clientWidth;
      const natural = row.offsetWidth;
      if (available <= 0 || natural <= 0) return;
      const scale = Math.min(1, Math.max(0, available - 2) / natural);
      container.style.setProperty("--actions-scale", String(scale));
      container.style.setProperty("--actions-height", `${Math.ceil(row.offsetHeight * scale)}px`);
    }

    function scheduleFit() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    }

    fit();
    const observer = new ResizeObserver(scheduleFit);
    observer.observe(container);
    observer.observe(row);
    // Web fonts and locale changes can alter the intrinsic width of the labels.
    document.fonts.ready.then(() => { if (active) scheduleFit(); });
    window.addEventListener("resize", scheduleFit);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleFit);
    };
  }, []);

  return (
    <div className={`responsive-actions ${className}`} ref={containerRef}>
      <div className="responsive-actions-row" ref={rowRef}>{children}</div>
    </div>
  );
}
