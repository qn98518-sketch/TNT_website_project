"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { ContentTopic } from "@/content/models";

export interface CatalogEntry {
  slug: string;
  title: string;
  summary: string;
  topic: ContentTopic;
  href: string;
  publishedAt?: string;
  industry?: string;
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
  project:
    "Danh sách dự án sẽ được cập nhật khi TNT xác nhận nội dung, kết quả và quyền công bố.",
  article:
    "Bài viết sẽ được đăng sau khi nội dung và thông tin biên tập được duyệt.",
  guide:
    "Tài liệu sẽ xuất hiện khi tệp tải xuống và quyền phát hành được xác nhận.",
};

export function CatalogBrowser({ entries, kind }: Props) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<ContentTopic | "all">("all");
  const [industry, setIndustry] = useState("all");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const industries = useMemo(
    () =>
      Array.from(
        new Set(
          entries
            .map((entry) => entry.industry)
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [entries],
  );
  const result = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("vi");
    return entries.filter((entry) => {
      const matchesTopic = topic === "all" || entry.topic === topic;
      const matchesIndustry =
        industry === "all" || entry.industry === industry;
      const matchesQuery =
        !needle ||
        `${entry.title} ${entry.summary} ${entry.topic} ${entry.industry ?? ""}`
          .toLocaleLowerCase("vi")
          .includes(needle);
      return matchesTopic && matchesIndustry && matchesQuery;
    });
  }, [entries, industry, query, topic]);

  useEffect(() => {
    if (
      kind === "article" &&
      new URLSearchParams(window.location.search).get("focus") === "search"
    ) {
      searchInputRef.current?.focus();
    }
  }, [kind]);

  function reset() {
    setQuery("");
    setTopic("all");
    setIndustry("all");
  }

  return (
    <div className="catalog">
      <div className="catalog-controls">
        <label className="catalog-search">
          <span className="visually-hidden">Tìm kiếm</span>
          <Icon name="search" size={18} />
          <input
            ref={searchInputRef}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={kind === "article" ? "Tìm trong bài viết" : "Tìm theo từ khóa"}
            type="search"
            value={query}
          />
        </label>
        <label className="catalog-topic">
          <span className="visually-hidden">Lọc theo chủ đề</span>
          <Icon name="settings" size={17} />
          <select
            onChange={(event) =>
              setTopic(event.target.value as ContentTopic | "all")
            }
            value={topic}
          >
            <option value="all">Tất cả chủ đề</option>
            {topics.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        {kind === "project" && (
          <label className="catalog-topic">
            <span className="visually-hidden">Lọc theo ngành</span>
            <Icon name="building" size={17} />
            <select
              onChange={(event) => setIndustry(event.target.value)}
              value={industry}
            >
              <option value="all">Tất cả ngành</option>
              {industries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="catalog-reset" onClick={reset} type="button">
          Xóa bộ lọc
        </button>
      </div>

      <p aria-live="polite" className="catalog-count">
        {result.length === 0
          ? "Chưa có kết quả phù hợp"
          : `${result.length} kết quả`}
      </p>

      {result.length > 0 ? (
        <div className="catalog-grid">
          {result.map((entry) => (
            <article className="catalog-card" key={entry.slug}>
              <span className="catalog-tag">{entry.topic}</span>
              {entry.industry && (
                <span className="catalog-tag catalog-industry">
                  {entry.industry}
                </span>
              )}
              <h2>{entry.title}</h2>
              {entry.publishedAt && (
                <time dateTime={entry.publishedAt}>{entry.publishedAt}</time>
              )}
              <p>{entry.summary}</p>
              <Link className="text-link" href={entry.href}>
                {kind === "guide" ? "Xem tài liệu" : "Tìm hiểu thêm"}
                <Icon name={kind === "guide" ? "download" : "arrowRight"} size={16} />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <span className="catalog-empty-icon">
            <Icon name={kind === "guide" ? "document" : "info"} size={25} />
          </span>
          <h2>
            {query || topic !== "all" || industry !== "all"
              ? "Không tìm thấy nội dung"
              : "Nội dung đang được cập nhật"}
          </h2>
          <p>
            {query || topic !== "all" || industry !== "all"
              ? "Thử từ khóa hoặc chủ đề khác, hoặc xóa bộ lọc để xem lại."
              : emptyMessages[kind]}
          </p>
          {(query || topic !== "all" || industry !== "all") && (
            <button className="button button-outline" onClick={reset} type="button">
              Xóa tìm kiếm và bộ lọc
            </button>
          )}
        </div>
      )}
    </div>
  );
}
