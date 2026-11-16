"use client";
import { useI18n } from "@/i18n/provider";
import { ContentCard } from "@/components/content-card";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import type { ContentTopic } from "@/content/models";
import { SelectBox } from "@/components/select-box";
import { GuideCard } from "@/components/guide-card";
import { ContentCarousel } from "@/components/content-carousel";
export interface CatalogEntry {
    slug: string;
    title: string;
    summary: string;
    topic: ContentTopic;
    href: string;
    publishedAt?: string;
    dateLabel?: string;
    industry?: string;
    isSimulation?: boolean;
    image?: string;
    imageAlt?: string;

    readingTime?: string;
    preview?: readonly string[];
    fileType?: string;
}
const topics: readonly ContentTopic[] = [
    "ERP",
    "Sản xuất",
    "Outsourcing",
    "Body Shop",
    "Giáo dục",
    "Khác",
];
type Props = {
    entries: readonly CatalogEntry[];
    kind: "project" | "article" | "guide";
};
const emptyMessages = {
    project: "Hiện chưa có dự án trong danh sách.",
    article: "Hiện chưa có bài viết trong danh sách.",
    guide: "Hiện chưa có tài liệu trong danh sách.",
};
export function CatalogBrowser({ entries, kind }: Props) {
    const { t } = useI18n();
    const searchParams = useSearchParams();
    const initialTopic = searchParams.get('topic');
    const [query, setQuery] = useState("");
    const [topic, setTopic] = useState<ContentTopic | "all">(() => topics.includes(initialTopic as ContentTopic) ? initialTopic as ContentTopic : 'all');
    const [industry, setIndustry] = useState("all");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const industries = useMemo(() => Array.from(new Set(entries
        .map((entry) => entry.industry)
        .filter((value): value is string => Boolean(value)))), [entries]);
    const needle = query.trim().toLocaleLowerCase("vi");
    const result = entries.filter((entry) => {
            const matchesTopic = topic === "all" || entry.topic === topic;
            const matchesIndustry = industry === "all" || entry.industry === industry;
            const matchesQuery = !needle ||
                `${entry.title} ${entry.summary} ${entry.topic} ${entry.industry ?? ""} ${t(entry.title)} ${t(entry.summary)} ${t(entry.topic)} ${t(entry.industry ?? "")}`
                    .toLocaleLowerCase("vi")
                    .includes(needle);
            return matchesTopic && matchesIndustry && matchesQuery;
        });
    useEffect(() => {
        if (kind === "article" &&
            new URLSearchParams(window.location.search).get("focus") === "search") {
            searchInputRef.current?.focus();
        }
    }, [kind]);
    function reset() {
        setQuery("");
        setTopic("all");
        setIndustry("all");
    }
    return (<div className="catalog">
      <div className="catalog-controls">
        <label className="catalog-search">
          <span className="visually-hidden">{t("Tìm kiếm")}</span>
          <Icon name="search" size={18}/>
          <input ref={searchInputRef} onChange={(event) => setQuery(event.target.value)} placeholder={t(kind === "article" ? "Tìm trong bài viết" : kind === "guide" ? "Nhập tên tài liệu..." : "Tìm theo từ khóa")} type="search" value={query}/>
        </label>
        <div className="catalog-topic"><SelectBox label={t("Lọc theo chủ đề")} icon="settings" value={topic} onValueChange={value => setTopic(value as ContentTopic | "all")} options={[{value: "all", label: t("Tất cả chủ đề")}, ...topics.map(item => ({value: item, label: t(item)}))]} /></div>
        {kind === "project" && <div className="catalog-topic"><SelectBox label={t("Lọc theo ngành")} icon="building" value={industry} onValueChange={setIndustry} options={[{value: "all", label: t("Tất cả ngành")}, ...industries.map(item => ({value: item, label: t(item)}))]} /></div>}
        <button className="catalog-reset" onClick={reset} type="button">{t("Xóa bộ lọc")}</button>
      </div>

      <p aria-live="polite" className="catalog-count">
        {t(result.length === 0
            ? "Chưa có kết quả phù hợp"
            : `${result.length} kết quả`)}
      </p>

      {t(result.length > 0 ? (<ContentCarousel enabled={kind !== "guide"} label={t(kind === "article" ? "Blog" : "Dự án")} resetKey={`${kind}:${topic}:${industry}:${needle}`} className={kind === "guide" ? "guide-card-grid" : "content-card-grid"}>
          {t(result.map((entry) => (kind === "guide" ? <GuideCard guide={entry} key={entry.slug} /> : <ContentCard key={entry.slug}
            href={entry.href} title={t(entry.title)} summary={t(entry.summary)} image={entry.image} imageAlt={t(entry.imageAlt ?? entry.title)}
            heading={kind === "article" ? "h3" : "h2"}
            metadata={<>{t(entry.topic)}{entry.isSimulation && <> · <span className="project-simulation-label">{t("Case study mô phỏng")}</span></>}{entry.industry && <> · {t(entry.industry)}</>}{entry.publishedAt && <> · <time dateTime={entry.publishedAt}>{t(entry.dateLabel ?? entry.publishedAt)}</time></>}{entry.readingTime && <> · {t(entry.readingTime)}</>}</>}
            linkLabel={t(kind === "article" ? "Đọc bài viết" : "Xem câu chuyện dự án")} />)))}
        </ContentCarousel>) : (<div className="catalog-empty">
          <span className="catalog-empty-icon">
            <Icon name={kind === "guide" ? "document" : "info"} size={25}/>
          </span>
          <h2>
            {t(query || topic !== "all" || industry !== "all"
                ? "Không tìm thấy nội dung"
                : "Nội dung đang được cập nhật")}
          </h2>
          <p>
            {t(query || topic !== "all" || industry !== "all"
                ? "Thử từ khóa hoặc chủ đề khác, hoặc xóa bộ lọc để xem lại."
                : emptyMessages[kind])}
          </p>
          {t((query || topic !== "all" || industry !== "all") && (<button className="button button-outline" onClick={reset} type="button">{t("Xóa tìm kiếm và bộ lọc")}</button>))}
        </div>))}
    </div>);
}
