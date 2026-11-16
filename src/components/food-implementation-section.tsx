"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./food-implementation-section.css";

export function FoodImplementationSection({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!section || motion.matches || !("IntersectionObserver" in window)) return;

    // Observe the section once, keeping every card in DOM/reading order.
    section.dataset.processReveal = "pending";
    let revealed = false;
    const observer = new IntersectionObserver(entries => {
      if (revealed || !entries.some(entry => entry.isIntersecting)) return;
      revealed = true;
      section.dataset.processReveal = "running";
      observer.disconnect();
    }, { threshold: 0 });

    function onMotionChange() {
      if (!motion.matches) return;
      revealed = true;
      section!.dataset.processReveal = "complete";
      observer.disconnect();
    }

    observer.observe(section);
    motion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      delete section.dataset.processReveal;
    };
  }, []);

  return <section className="rf-food-implementation" data-reveal-skip ref={sectionRef}>{children}</section>;
}
