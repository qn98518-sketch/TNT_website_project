import Link from "next/link";
import type { ReactNode } from "react";
import { SiteImage } from "@/components/site-image";
import { Icon } from "@/components/ui/icon";
import "./content-cards.css";

type Props = {
  href: string;
  title: string;
  summary: string;
  image?: string;
  imageAlt?: string;
  metadata: ReactNode;
  linkLabel: string;
  heading?: "h2" | "h3";
  imageArrow?: boolean;
};

/** One set of dimensions for article and project previews everywhere. */
export function ContentCard({ href, title, summary, image, imageAlt, metadata, linkLabel, heading: Heading = "h3", imageArrow = false }: Props) {
  return <article className="content-card">
    <Link className="content-card-image" href={href} aria-label={title} tabIndex={-1}>
      {image && <SiteImage src={image} alt={imageAlt ?? title} width={1600} height={1000} sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1100px) calc((100vw - 88px) / 2), 448px" />}
      {imageArrow && <span className="content-card-image-arrow"><Icon name="arrowRight" size={20} /></span>}
    </Link>
    <div className="content-card-copy">
      <div className="content-card-meta">{metadata}</div>
      <Heading className="content-card-title"><Link href={href}>{title}</Link></Heading>
      <p className="content-card-summary">{summary}</p>
      <Link className="content-card-link" href={href}>{linkLabel}<Icon name="arrowRight" size={16} /></Link>
    </div>
  </article>;
}
