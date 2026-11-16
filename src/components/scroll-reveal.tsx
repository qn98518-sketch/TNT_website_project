"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { installScrollReveal } from "@/lib/scroll-reveal";

export function ScrollReveal() {
  const marker = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>(".rf-frame");
    if (root) return installScrollReveal(root);
  }, [pathname]);
  return <span ref={marker} hidden aria-hidden="true" />;
}
