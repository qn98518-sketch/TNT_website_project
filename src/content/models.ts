export type ContentStatus = "approved" | "pending-review";

export type ContentTopic = "ERP" | "Sản xuất" | "Outsourcing" | "Body Shop" | "Khác";

export interface ContentRecord {
  slug: string;
  title: string;
  summary: string;
  topic: ContentTopic;
  status: ContentStatus;
}

export interface ProjectRecord extends ContentRecord {
  industry: string;
  challenge: string;
  approach: string;
  outcome: string;
  gallery?: readonly { src: string; alt: string; width: number; height: number }[];
  relatedProjectSlugs?: readonly string[];
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface ArticleRecord extends ContentRecord {
  publishedAt: string;
  author: string;
  sections: ArticleSection[];
  relatedServiceHref?: string;
  relatedServiceLabel?: string;
}

export interface GuideRecord extends ContentRecord {
  fileUrl: string;
  fileType: string;
  fileSize: string;
}

export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  topic: ContentTopic;
  status: ContentStatus;
}

export interface ServiceRecord {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  href: string;
  points: string[];
  status: ContentStatus;
}

export interface HomePageContent {
  hero: { eyebrow: string; title: string; accent: string; summary: string };
  introduction: { eyebrow: string; title: string; accent: string; summary: string };
  reasons: readonly { title: string; description: string }[];
  process: readonly { title: string; description: string }[];
  fitPrinciple: { eyebrow: string; title: string; summary: string; linkLabel: string };
  industry: {
    eyebrow: string;
    title: string;
    accent: string;
    summary: string;
    linkLabel: string;
  };
  projectDisclosure: { eyebrow: string; title: string; accent: string; summary: string };
  proofChecks: readonly { title: string; description: string }[];
  insightPrompts: readonly { topic: string; question: string; description: string }[];
}

export interface AboutPageContent {
  hero: { eyebrow: string; title: string; accent: string; summary: string };
  overview: { eyebrow: string; title: string; accent: string; paragraphs: readonly string[] };
  fitPrinciple: { eyebrow: string; title: string; accent: string; summary: string };
  fitStages: readonly { label: string; title: string; description: string }[];
  capabilities: readonly { title: string; description: string }[];
  teamDisclosure: { eyebrow: string; title: string; accent: string; summary: string };
  teamRoles: readonly { title: string; description: string }[];
}

export interface FoodSolutionPageContent {
  hero: { eyebrow: string; title: readonly string[]; summary: string };
  challenges: readonly { title: string; description: string }[];
  workflow: readonly string[];
  implementation: readonly { title: string; description: string }[];
  faqs: readonly { id: string; question: string; answer: string }[];
}

export interface ContentRepository<T> {
  listPublished(): Promise<readonly T[]>;
  findPublishedBySlug(slug: string): Promise<T | null>;
}
