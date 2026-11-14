"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Statistic = { value: string; label: string; description?: string };
const duration = 1800;
const slideInterval = 3000;

export function HomeStatistics({ statistics, label, className = "" }: { statistics: readonly Statistic[]; label: string; className?: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || statistics.length < 2) return;
    const mobile = window.matchMedia("(max-width: 760px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>(":scope > article"));
    let active = 0;
    let direction = 1;
    let visible = !("IntersectionObserver" in window);
    let interacting = false;
    let measuredWidth = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    function center(index: number, behavior: ScrollBehavior = "smooth") {
      const card = cards[index];
      if (!card) return;
      active = index;
      const bounds = viewport!.getBoundingClientRect();
      const cardBounds = card.getBoundingClientRect();
      const left = viewport!.scrollLeft + cardBounds.left + cardBounds.width / 2 - bounds.left - bounds.width / 2;
      viewport!.scrollTo({ left: Math.max(0, Math.min(left, viewport!.scrollWidth - viewport!.clientWidth)), behavior });
    }

    function stopTimer() {
      clearInterval(timer);
      timer = undefined;
    }

    function startTimer() {
      stopTimer();
      if (!mobile.matches || reducedMotion.matches || !visible || document.hidden || interacting) return;
      timer = setInterval(() => {
        if (active === cards.length - 1) direction = -1;
        else if (active === 0) direction = 1;
        center(active + direction);
      }, slideInterval);
    }

    function settle() {
      clearTimeout(settleTimer);
      if (!mobile.matches) return;
      const bounds = viewport!.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      let closest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const next = Math.abs(rect.left + rect.width / 2 - centerX);
        if (next < distance) { closest = index; distance = next; }
      });
      active = closest;
    }

    function onScroll() {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 160);
    }

    function startInteraction() {
      interacting = true;
      stopTimer();
    }

    function endInteraction() {
      if (!interacting) return;
      interacting = false;
      startTimer();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!mobile.matches || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      settle();
      const index = event.key === "Home" ? 0 : event.key === "End" ? cards.length - 1 : Math.max(0, Math.min(cards.length - 1, active + (event.key === "ArrowRight" ? 1 : -1)));
      center(index, reducedMotion.matches ? "instant" : "smooth");
      startTimer();
    }

    function measure() {
      if (viewport!.clientWidth === measuredWidth) return;
      measuredWidth = viewport!.clientWidth;
      if (mobile.matches) center(active, "instant");
    }

    function updateLayout() {
      measuredWidth = 0;
      if (!mobile.matches) viewport!.scrollTo({ left: 0, behavior: "instant" });
      measure();
      startTimer();
    }

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        const nextVisible = entries.some(entry => entry.isIntersecting);
        if (nextVisible === visible) return;
        visible = nextVisible;
        startTimer();
      }, { threshold: 0.15 });
      observer.observe(viewport);
    }
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    measure();
    startTimer();
    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("scrollend", settle);
    viewport.addEventListener("pointerdown", startInteraction, { passive: true });
    viewport.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerup", endInteraction);
    document.addEventListener("pointercancel", endInteraction);
    document.addEventListener("visibilitychange", startTimer);
    mobile.addEventListener("change", updateLayout);
    reducedMotion.addEventListener("change", startTimer);
    window.addEventListener("resize", measure);
    return () => {
      stopTimer();
      clearTimeout(settleTimer);
      observer?.disconnect();
      resizeObserver.disconnect();
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("scrollend", settle);
      viewport.removeEventListener("pointerdown", startInteraction);
      viewport.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerup", endInteraction);
      document.removeEventListener("pointercancel", endInteraction);
      document.removeEventListener("visibilitychange", startTimer);
      mobile.removeEventListener("change", updateLayout);
      reducedMotion.removeEventListener("change", startTimer);
      window.removeEventListener("resize", measure);
    };
  }, [statistics.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let played = false;
    let disposed = false;
    let startedAt: number | null = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function animate(now: number) {
      if (disposed) return;
      if (reducedMotion.matches) { setProgress(1); return; }
      startedAt ??= now;
      const elapsed = Math.min((now - startedAt) / duration, 1);
      setProgress(1 - Math.pow(1 - elapsed, 2));
      if (elapsed < 1) frame = requestAnimationFrame(animate);
    }

    function start() {
      if (played || disposed) return;
      played = true;
      observer?.disconnect();
      frame = requestAnimationFrame(animate);
    }

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) start();
      }, { threshold: 0.15 });
      observer.observe(viewport);
    } else {
      start();
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div className={`home-statistics ${className}`.trim()} style={{ "--statistics-columns": statistics.length } as CSSProperties}>
    <div className="rf-statistics" ref={viewportRef} role="region" aria-label={label} tabIndex={0}>
      {statistics.map(statistic => {
        const target = Number.parseInt(statistic.value, 10);
        const count = Math.floor(1 + (target - 1) * progress);
        return <article key={statistic.label}>
          <strong><span className="visually-hidden">{statistic.value}</span><span aria-hidden="true">{count}+</span></strong>
          <h3>{statistic.label}</h3>
          {statistic.description && <p>{statistic.description}</p>}
        </article>;
      })}
    </div>
  </div>;
}
