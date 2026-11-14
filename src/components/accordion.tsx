"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatedCollapse } from "@/components/animated-collapse";
import { Icon } from "@/components/ui/icon";

export function Accordion({ question, children, index }: {
  question: string;
  children: ReactNode;
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <article className="faq-item animated-accordion" data-open={open}>
    <button className="faq-question" type="button" aria-expanded={open} aria-controls={`${id}-answer`} onClick={() => setOpen(value => !value)}>
      {index !== undefined && <span className="faq-index">{String(index + 1).padStart(2, "0")}</span>}
      <span className="faq-question-text">{question}</span><Icon className="faq-question-icon" name="addCircle" size={22} />
    </button>
    <AnimatedCollapse open={open} id={`${id}-answer`}><div className="faq-answer-content">{children}</div></AnimatedCollapse>
  </article>;
}
