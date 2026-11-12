"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const sections = document.querySelectorAll("main > section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -36px 0px", threshold: 0.06 },
    );

    sections.forEach((section) => {
      section.setAttribute("data-reveal", "pending");
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
