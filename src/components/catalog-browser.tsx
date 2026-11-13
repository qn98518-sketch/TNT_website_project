"use client";
import { useI18n } from "@/i18n/provider";
import Link from "next/link";
import { SiteImage as Image } from "@/components/site-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import type { ContentTopic } from "@/content/models";
export interface CatalogEntry {
    slug: string;
    title: string;
    summary: string;
    topic: ContentTopic;
    href: string;
    publishedAt?: string;
    dateLabel?: string;
    industry?: string;
    image?: string;
    imageAlt?: string;
    sourceLabel?: string;
    readingTime?: string;
    preview?: readonly string[];
}
const topics: readonly ContentTopic[] = [
    "ERP",
    "Sản xuất",
    "Outsourcing",
    "Body Shop",
    "Khác",
];
type Props = {
    entries: readonly CatalogEntry[];
    kind: "project" | "article" | "guide";
};
const emptyMessages = {
    project: "Danh sách dự án sẽ được cập nhật khi TNT xác nhận nội dung, kết quả và quyền công bố.",
    article: "Bài viết sẽ được đăng sau khi nội dung và thông tin biên tập được duyệt.",
    guide: "Tài liệu sẽ xuất hiện khi tệp tải xuống và quyền phát hành được xác nhận.",
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
          <input ref={searchInputRef} onChange={(event) => setQuery(event.target.value)} placeholder={t(kind === "article" ? "Tìm trong bài viết" : "Tìm theo từ khóa")} type="search" value={query}/>
        </label>
        <label className="catalog-topic">
          <span className="visually-hidden">{t("Lọc theo chủ đề")}</span>
          <Icon name="settings" size={17}/>
          <select onChange={(event) => setTopic(event.target.value as ContentTopic | "all")} value={topic}>
            <option value="all">{t("Tất cả chủ đề")}</option>
            {t(topics.map((item) => (<option key={item} value={item}>
                {t(item)}
              </option>)))}
          </select>
        </label>
        {t(kind === "project" && (<label className="catalog-topic">
            <span className="visually-hidden">{t("Lọc theo ngành")}</span>
            <Icon name="building" size={17}/>
            <select onChange={(event) => setIndustry(event.target.value)} value={industry}>
              <option value="all">{t("Tất cả ngành")}</option>
              {t(industries.map((item) => (<option key={item} value={item}>
                  {t(item)}
                </option>)))}
            </select>
          </label>))}
        <button className="catalog-reset" onClick={reset} type="button">{t("Xóa bộ lọc")}</button>
      </div>

      <p aria-live="polite" className="catalog-count">
        {t(result.length === 0
            ? "Chưa có kết quả phù hợp"
            : `${result.length} kết quả`)}
      </p>

      {t(result.length > 0 ? (<div className={kind === "article" ? "catalog-grid catalog-grid-article" : "catalog-grid"}>
          {t(result.map((entry) => (<article className={`catalog-card catalog-card-${kind}`} key={entry.slug}>
              {t(entry.image && (<Link aria-label={t(entry.title)} className="catalog-card-image" href={entry.href} tabIndex={-1}>
                  <Image alt={t(entry.imageAlt ?? "")} fill sizes={kind === "article"
                        ? "(max-width: 760px) 100vw, 50vw"
                        : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"} src={entry.image}/>
                </Link>))}
              <div className="catalog-card-content">
                <div className="catalog-card-tags">
                  <span className="catalog-tag">{t(entry.topic)}</span>
                  {t(entry.industry && (<span className="catalog-tag catalog-industry">
                      {t(entry.industry)}
                    </span>))}
                </div>
                <h2>{t(entry.title)}</h2>
                {t(entry.publishedAt && (<p className="catalog-meta">
                    <time dateTime={entry.publishedAt}>
                      {t(entry.dateLabel ?? entry.publishedAt)}
                    </time>
                    {t(entry.readingTime && <span>{t(entry.readingTime)}</span>)}
                  </p>))}
                {t(entry.sourceLabel && (<span className="review-label">{t(entry.sourceLabel)}</span>))}
                <p>{t(entry.summary)}</p>
                <Link className="text-link" href={entry.href}>
                  {t(kind === "guide"
                    ? "Xem nội dung tham khảo"
                    : kind === "article"
                        ? "Đọc bài viết"
                        : "Xem câu chuyện dự án")}
                  <Icon name="arrowRight" size={16}/>
                </Link>
              </div>
              {t(entry.preview && (<div className="catalog-card-preview" id={`guide-${entry.slug}`}>
                  <strong>{t("Nội dung tham khảo")}</strong>
                  <ul>
                    {t(entry.preview.map((line) => <li key={line}>{t(line)}</li>))}
                  </ul>
                </div>))}
            </article>)))}
        </div>) : (<div className="catalog-empty">
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
