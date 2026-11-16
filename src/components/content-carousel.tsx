"use client";

import { Children, isValidElement, useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { useI18n } from "@/i18n/provider";
import { Icon } from "@/components/ui/icon";
import "./content-carousel.css";

type Props = {
  children: ReactNode;
  className?: string;
  label?: string;
  resetKey?: string;
  enabled?: boolean;
};

const smallScreenQuery = "(max-width: 1100px)";
function subscribeToScreen(callback: () => void) {
  const media = window.matchMedia(smallScreenQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function isSmallScreen() { return window.matchMedia(smallScreenQuery).matches; }
function serverScreen() { return false; }

export function ContentCarousel({ children, className = "", label, resetKey = "", enabled = true }: Props) {
  const { t } = useI18n();
  const active = useSyncExternalStore(subscribeToScreen, isSmallScreen, serverScreen);
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const contentKey = slides.map((slide, index) => isValidElement(slide) ? slide.key ?? index : index).join("|");
  const [position, setPosition] = useState({ start: 0, visible: 1, previous: false, next: count > 1 });

  useEffect(() => {
    const track = trackRef.current;
    if (!enabled || !active || !track || count === 0) return;

    function measure() {
      if (!track) return;
      const first = track.firstElementChild;
      if (!first) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = first.getBoundingClientRect().width + gap;
      if (!step) return;
      const visible = Math.min(count, Math.max(1, Math.round((track.clientWidth + gap) / step)));
      const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
      const nextPosition = {
        start: Math.min(Math.max(0, count - visible), Math.max(0, Math.round(track.scrollLeft / step))),
        visible,
        previous: track.scrollLeft > 2,
        next: track.scrollLeft < maximum - 2,
      };
      setPosition(previous => previous.start === nextPosition.start && previous.visible === nextPosition.visible && previous.previous === nextPosition.previous && previous.next === nextPosition.next ? previous : nextPosition);
    }

    track.scrollTo({ left: 0, behavior: "instant" });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    track.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", measure);
    };
  }, [count, contentKey, resetKey, enabled, active]);

  function move(direction: -1 | 1) {
    if (!active) return;
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first.getBoundingClientRect().width + gap;
    const visible = Math.min(count, Math.max(1, Math.round((track.clientWidth + gap) / step)));
    track.scrollBy({
      left: direction * step * visible,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  if (!enabled) return <div className={className}>{children}</div>;
  if (count === 0) return null;
  const tablet = Math.min(count, 2);
  return <div className="content-carousel" data-reveal-skip={active ? "true" : undefined} role="region" aria-roledescription={active ? t("Danh sách trượt") : undefined} aria-label={label ?? t("Bài viết và dự án")}
    style={{ "--carousel-tablet": tablet, "--carousel-max-width": `${tablet * 448 + (tablet - 1) * 24}px` } as CSSProperties}>
    <div className={`content-carousel-track ${className}`} id={trackId} ref={trackRef} tabIndex={active && count > 1 ? 0 : undefined}
      aria-label={label ?? t("Bài viết và dự án")}
      onKeyDown={event => {
        if (!active || event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          trackRef.current?.scrollTo({ left: event.key === "Home" ? 0 : trackRef.current.scrollWidth, behavior: "instant" });
        }
      }}>
      {slides}
    </div>
    {count > 1 && <div className="content-carousel-controls">
      <span className="content-carousel-position" aria-live="polite" aria-atomic="true">{position.start + 1}/{count}</span>
      <button className="content-carousel-control" type="button" onClick={() => move(-1)} disabled={!position.previous} aria-label={t("Xem mục trước")} aria-controls={trackId}><Icon name="arrowLeft" size={20} /></button>
      <button className="content-carousel-control" type="button" onClick={() => move(1)} disabled={!position.next} aria-label={t("Xem mục tiếp theo")} aria-controls={trackId}><Icon name="arrowRight" size={20} /></button>
    </div>}
  </div>;
}
