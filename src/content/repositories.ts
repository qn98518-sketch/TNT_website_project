import {
  articles,
  faqs,
  guides,
  projects,
  services,
} from "@/content/local-data";
import type {
  ArticleRecord,
  ContentRepository,
  FaqRecord,
  GuideRecord,
  ProjectRecord,
  ServiceRecord,
} from "@/content/models";

function createLocalRepository<T extends { status: "approved" | "pending-review" }>(
  records: readonly T[],
): ContentRepository<T> {
  return {
    async listPublished() {
      return records.filter((record) => record.status === "approved");
    },
    async findPublishedBySlug(slug) {
      return (
        records.find(
          (record) =>
            "slug" in record &&
            record.slug === slug &&
            record.status === "approved",
        ) ?? null
      );
    },
  };
}

export interface FaqRepository {
  listPublished(): Promise<readonly FaqRecord[]>;
}

export interface ServiceRepository {
  listPublished(): Promise<readonly ServiceRecord[]>;
  findPublishedBySlug(slug: string): Promise<ServiceRecord | null>;
}

export const projectRepository = createLocalRepository<ProjectRecord>(projects);
export const articleRepository = createLocalRepository<ArticleRecord>(articles);
export const guideRepository = createLocalRepository<GuideRecord>(guides);
export const faqRepository: FaqRepository = {
  async listPublished() {
    return faqs.filter((faq) => faq.status === "approved");
  },
};
export const serviceRepository = createLocalRepository<ServiceRecord>(services);
