"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { SiteImage } from "@/components/site-image";
import { Icon } from "@/components/ui/icon";
import type { LeadershipProfile } from "@/content/models";

const AUTO_ADVANCE_MS = 3000;
const TRANSITION_MS = 550;

export function LeadershipCarousel({ members }: { members: readonly LeadershipProfile[] }) {
  const { t } = useI18n();
  const count = members.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(count);
  const movingRef = useRef(false);
  const completionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotionRef = useRef(false);
  const geometryRef = useRef({ visible: 3, step: 0 });
  const autoplayBlockedRef = useRef(true);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState(count);
  const [geometry, setGeometry] = useState({ visible: 3, step: 0 });
  const [animating, setAnimating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cards = [...members, ...members, ...members];
  const logicalIndex = count ? ((position % count) + count) % count : 0;

  const finishMove = useCallback(() => {
    if (completionRef.current) clearTimeout(completionRef.current);
    completionRef.current = null;
    movingRef.current = false;
    setAnimating(false);
    if (count) {
      const normalized = count + ((positionRef.current % count) + count) % count;
      positionRef.current = normalized;
      setPosition(normalized);
    }
  }, [count]);

  const moveTo = useCallback((next: number) => {
    if (!count || movingRef.current) return;
    setOpenIndex(null);
    setHoveredIndex(null);
    positionRef.current = next;
    setPosition(next);
    if (reducedMotionRef.current) {
      finishMove();
    } else {
      movingRef.current = true;
      setAnimating(true);
      // Complete even if resizing or a background tab prevents transitionend.
      completionRef.current = setTimeout(finishMove, TRANSITION_MS + 100);
    }
  }, [count, finishMove]);

  const move = useCallback((delta: number) => moveTo(positionRef.current + delta), [moveTo]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    function measure() {
      if (!viewport || !track) return;
      const visible = Math.min(count, Math.max(1, parseInt(getComputedStyle(viewport).getPropertyValue("--leaders-visible"), 10) || 3));
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      if (viewport.clientWidth && visible) {
        const next = { visible, step: (viewport.clientWidth + gap) / visible };
        // Image/font loading can resize height without changing the slide width.
        // Ignore those notifications instead of interrupting an active slide.
        if (next.visible === geometryRef.current.visible && Math.abs(next.step - geometryRef.current.step) < 0.5) return;
        geometryRef.current = next;
        finishMove();
        setGeometry(next);
      }
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [count, finishMove]);

  useEffect(() => {
    const updateVisibility = () => {
      setPageVisible(!document.hidden);
      // A throttled background-tab transition must not leave movingRef stuck.
      if (document.hidden) finishMove();
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => { reducedMotionRef.current = media.matches; };
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      media.removeEventListener("change", updateMotion);
      if (completionRef.current) clearTimeout(completionRef.current);
      completionRef.current = null;
      movingRef.current = false;
    };
  }, [finishMove]);

  useLayoutEffect(() => {
    // Pause only while a profile is actually being read or a swipe is active.
    // Hover/focus on the arrows, dots or empty carousel space must not stop it.
    autoplayBlockedRef.current = !geometry.step || dragging || openIndex !== null || hoveredIndex !== null || !pageVisible;
  }, [geometry.step, dragging, openIndex, hoveredIndex, pageVisible]);

  useEffect(() => {
    if (count < 2) return;
    // Decreasing the index moves the visible strip from LEFT to RIGHT.
    // Keep one clock alive; transient layout/interaction state cannot reset it.
    const timer = setInterval(() => {
      if (!autoplayBlockedRef.current) move(-1);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [count, move]);

  useEffect(() => {
    if (openIndex !== null) trackRef.current?.querySelector<HTMLButtonElement>(`[data-leader-index="${openIndex}"] [data-close-profile]`)?.focus();
  }, [openIndex]);

  function closeProfile(index: number) {
    setOpenIndex(null);
    setHoveredIndex(null);
    requestAnimationFrame(() => trackRef.current?.querySelector<HTMLButtonElement>(`[data-leader-index="${index}"] [data-open-profile]`)?.focus());
  }

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" || (event.target as HTMLElement).closest("button, .leader-card-details")) return;
    swipeRef.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = swipeRef.current;
    swipeRef.current = null;
    setDragging(false);
    if (!start) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) move(x > 0 ? -1 : 1);
  }

  if (!count) return null;
  return <div className="leadership-carousel" role="region" aria-roledescription="carousel" aria-label={t("Hồ sơ đội ngũ lãnh đạo")}
    onPointerLeave={() => setHoveredIndex(null)}>
    <div className="leader-carousel-viewport" ref={viewportRef} tabIndex={0} onPointerDown={startSwipe} onPointerUp={endSwipe} onPointerCancel={() => { swipeRef.current = null; setDragging(false); }}
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
        if (event.key === "Escape" && openIndex !== null) { event.preventDefault(); closeProfile(openIndex); }
      }}>
      <div className="leader-carousel-track" ref={trackRef} style={{ transform: `translate3d(${-position * geometry.step}px, 0, 0)`, transitionDuration: animating ? `${TRANSITION_MS}ms` : "0ms" }}
        onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === "transform") finishMove(); }}>
        {cards.map((member, index) => {
          const visible = index >= position && index < position + geometry.visible;
          const expanded = visible && (openIndex === index || hoveredIndex === index);
          const detailId = `leader-profile-${member.id}-${index}`;
          return <article className="leader-card" key={`${member.id}-${index}`} data-leader-index={index} data-member-id={member.id} data-expanded={expanded} aria-hidden={!visible}
            role="group" aria-roledescription={t("Hồ sơ")} aria-label={`${index % count + 1} / ${count}: ${member.name}`}
            onPointerEnter={event => { if (event.pointerType === "mouse" && window.matchMedia("(hover: hover)").matches) setHoveredIndex(index); }}
            onPointerLeave={() => setHoveredIndex(current => current === index ? null : current)}>
            <div className="leader-card-media"><SiteImage src={member.image} alt={`${member.name} — ${t(member.role)}`} width={1024} height={1280} sizes="(max-width: 639px) 100vw, (max-width: 1399px) 50vw, 33vw" mediaKind="background" draggable={false} /></div>
            <div className="leader-card-summary">
              <h3>{member.name}</h3><p className="leader-role">{t(member.role)}</p><p className="leader-brief">{t(member.summary)}</p>
              <button className="leader-details-toggle" type="button" data-open-profile aria-controls={detailId} aria-expanded={expanded} tabIndex={visible && !expanded ? 0 : -1} onClick={() => setOpenIndex(index)}>{t("Xem hồ sơ")}<Icon name="arrowUp" size={16} /></button>
            </div>
            <div className="leader-card-details" id={detailId} aria-hidden={!expanded} inert={!expanded}>
              <div className="leader-details-heading"><div><h3>{member.name}</h3><p>{t(member.role)}</p></div><button type="button" data-close-profile className="leader-details-close" aria-label={`${t("Đóng hồ sơ")}: ${member.name}`} tabIndex={expanded ? 0 : -1} onClick={() => closeProfile(index)}><Icon name="closeCircle" size={24} /></button></div>
              <ul>{member.details.map(detail => <li key={detail}>{t(detail)}</li>)}</ul>
            </div>
          </article>;
        })}
      </div>
    </div>
    <div className="leader-carousel-controls">
      <div className="leader-carousel-arrows"><button type="button" aria-label={t("Lãnh đạo trước")} onClick={() => move(-1)}><Icon name="arrowLeft" size={20} /></button><button type="button" aria-label={t("Lãnh đạo tiếp theo")} onClick={() => move(1)}><Icon name="arrowRight" size={20} /></button></div>
      <div className="leader-carousel-dots" aria-label={t("Chọn thành viên")}>{members.map((member, index) => <button type="button" key={member.id} aria-label={`${t("Hiển thị hồ sơ")}: ${member.name}`} aria-current={logicalIndex === index ? "true" : undefined} onClick={() => moveTo(count + index)}><span /></button>)}</div>
    </div>
    <p className="visually-hidden" aria-live="off">{members[logicalIndex].name} · {logicalIndex + 1} / {count}</p>
  </div>;
}
