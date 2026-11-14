"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";
import type { ContentTopic } from "@/content/models";
import "./guide-cards.css";

type Guide = {
  slug: string;
  title: string;
  summary: string;
  topic: ContentTopic;
  fileType?: string;
  preview?: readonly string[];
};

export function GuideCard({ guide, inlinePreview = true }: { guide: Guide; inlinePreview?: boolean }) {
  const { t } = useI18n();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const id = `guide-${guide.slug}`;
  const titleId = `${id}-title`;

  useEffect(() => {
    if (!inlinePreview) return;
    const revealLinkedGuide = () => {
      if (window.location.hash === `#${id}` && detailsRef.current) detailsRef.current.open = true;
    };
    revealLinkedGuide();
    window.addEventListener("hashchange", revealLinkedGuide);
    return () => window.removeEventListener("hashchange", revealLinkedGuide);
  }, [id, inlinePreview]);

  return <article className="guide-card" id={id} aria-labelledby={titleId}>
    <div className="guide-card-cover" aria-hidden="true">
      <Icon name="document" size={54} />
      <span className="guide-card-cover-lines"><i /><i /><i /></span>
      <span className="guide-card-cover-brand">TNT / RESOURCE</span>
    </div>
    <div className="guide-card-copy">
      <div className="guide-card-meta"><span>{t(guide.topic)}</span><span className="guide-card-meta-dot" aria-hidden="true">•</span><span>{t(guide.fileType ?? "Hướng dẫn trực tuyến")}</span></div>
      <h3 id={titleId}>{t(guide.title)}</h3>
      <p>{t(guide.summary)}</p>
      {inlinePreview && guide.preview?.length ? <details className="guide-card-details" ref={detailsRef}>
        <summary className="guide-card-action"><span>{t("Xem nội dung tài liệu")}</span><Icon name="arrowRight" size={18} /></summary>
        <div className="guide-card-preview"><strong>{t("Nội dung tham khảo")}</strong><ul>{guide.preview.map(line => <li key={line}>{t(line)}</li>)}</ul></div>
      </details> : <Link className="guide-card-action" href={`/kien-thuc/guides#${id}`}><span>{t("Xem nội dung tài liệu")}</span><Icon name="arrowRight" size={18} /></Link>}
    </div>
  </article>;
}
