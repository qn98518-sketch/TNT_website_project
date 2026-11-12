export type ContentStatus = "approved" | "pending-review";

export type ContentTopic = "ERP" | "Sản xuất" | "Outsourcing" | "Body Shop" | "Khác";

export interface ContentRecord {
  slug: string;
  title: string;
  summary: string;
  topic: ContentTopic;
  status: ContentStatus;
  sourceLabel?: string;
  image?: string;
  imageAlt?: string;
}

export interface ProjectRecord extends ContentRecord {
  detailTitle?: string;
  industry: string;
  challenge: string;
  approach: string;
  outcome: string;
  service?: string;
  client?: string;
  scope?: string;
  challengeTitle?: string;
  solutionTitle?: string;
  solution?: string;
  gallery?: readonly { src: string; alt: string; width: number; height: number }[];
  relatedProjectSlugs?: readonly string[];
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface ArticleRecord extends ContentRecord {
  publishedAt: string;
  dateLabel: string;
  author?: string;
  readingTime: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  relatedArticleSlugs: readonly string[];
  sections: ArticleSection[];
  relatedServiceHref?: string;
  relatedServiceLabel?: string;
}

export interface GuideRecord extends ContentRecord {
  fileUrl: string;
  fileType: string;
  fileSize: string;
  preview: readonly string[];
}

export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  topic: ContentTopic;
  status: ContentStatus;
  sourceLabel?: string;
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

export type ServiceLandingSection =
  | {
      kind: "cards";
      eyebrow: string;
      title: string;
      accent: string;
      summary: string;
      cards: readonly { title: string; description: string }[];
      disclosure?: string;
    }
  | {
      kind: "flow";
      eyebrow: string;
      title: string;
      accent: string;
      summary: string;
      before: readonly string[];
      after: readonly string[];
      stages: readonly { title: string; description: string }[];
    }
  | {
      kind: "steps";
      eyebrow: string;
      title: string;
      accent: string;
      summary: string;
      steps: readonly { title: string; description: string }[];
    }
  | {
      kind: "image-callout";
      eyebrow: string;
      title: string;
      accent: string;
      summary: string;
      image: string;
      imageAlt: string;
      points: readonly string[];
      href?: string;
      linkLabel?: string;
      disclosure?: string;
    }
  | {
      kind: "projects";
      eyebrow: string;
      title: string;
      summary: string;
      projects: readonly {
        title: string;
        category: string;
        description: string;
        image: string;
        imageAlt: string;
        href: string;
        disclosure: string;
      }[];
    }
  | {
      kind: "faqs";
      eyebrow: string;
      title: string;
      summary: string;
      faqs: readonly { question: string; answer: string }[];
    };

export interface ServiceLandingContent {
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    summary: string;
    image: string;
    imageAlt: string;
    ctaLabel: string;
    secondaryLabel: string;
  };
  sections: readonly ServiceLandingSection[];
  contact: { title: string; description: string };
}

export interface HomePageContent {
  hero: { eyebrow: string; title: string; accent: string; summary: string };
  statistics: readonly {
    value: string;
    label: string;
    description: string;
  }[];
  statisticsNote: string;
  erpModules: readonly {
    label: string;
    code: string;
    icon: "shoppingCart" | "activity" | "box" | "chart" | "people" | "briefcase";
  }[];
  additionalServices: readonly {
    title: string;
    description: string;
    href: string;
  }[];
  featuredInsights: readonly {
    topic: string;
    title: string;
    href: string;
    image: string;
    imageAlt: string;
  }[];
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
  overview: {
    eyebrow: string;
    title: string;
    accent: string;
    paragraphs: readonly string[];
    images: readonly { src: string; alt: string; width: number; height: number }[];
  };
  industryCapabilities: readonly { title: string; description: string }[];
  methodSteps: readonly {
    english: string;
    title: string;
    description: string;
    icon: "message" | "diagram" | "checklist";
  }[];
  statistics: readonly { value: string; label: string }[];
  statisticsNote: string;
  fitPrinciple: { eyebrow: string; title: string; accent: string; summary: string };
  fitStages: readonly { label: string; title: string; description: string }[];
  capabilities: readonly { title: string; description: string }[];
  teamDisclosure: { eyebrow: string; title: string; accent: string; summary: string };
  teamRoles: readonly {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  }[];
}

export interface FoodSolutionPageContent {
  hero: {
    eyebrow: string;
    title: readonly string[];
    subtitle: string;
    summary: string;
    image: string;
    imageAlt: string;
  };
  challenges: readonly { title: string; description: string }[];
  workflow: readonly { title: string; description: string }[];
  workflowContext: {
    before: readonly string[];
    after: readonly string[];
  };
  fitStages: readonly { label: string; title: string; description: string }[];
  partnership: readonly { title: string; description: string }[];
  projectDisclosure: { title: string; summary: string; image: string; imageAlt: string };
  implementation: readonly { title: string; description: string }[];
  faqs: readonly { id: string; question: string; answer: string }[];
}

export interface ContentRepository<T> {
  listPublished(): Promise<readonly T[]>;
  findPublishedBySlug(slug: string): Promise<T | null>;
  listForPreview(): Promise<readonly T[]>;
  findForPreviewBySlug(slug: string): Promise<T | null>;
}
