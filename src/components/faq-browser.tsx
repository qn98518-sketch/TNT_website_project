"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { ContentTopic, FaqRecord } from "@/content/models";

type Props = {
  items: readonly FaqRecord[];
};

export function FaqBrowser({ items }: Props) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<ContentTopic | "all">("all");
  const result = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("vi");
    return items.filter((item) => {
      const matchesTopic = topic === "all" || item.topic === topic;
      const matchesQuery =
        !needle ||
        `${item.question} ${item.answer} ${item.topic}`
          .toLocaleLowerCase("vi")
          .includes(needle);
      return matchesTopic && matchesQuery;
    });
  }, [items, query, topic]);

  return (
    <div className="faq-browser">
      <div className="catalog-controls">
        <label className="catalog-search">
          <span className="visually-hidden">Tìm câu hỏi</span>
          <Icon name="search" size={18} />
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm câu hỏi"
            type="search"
            value={query}
          />
        </label>
        <label className="catalog-topic">
          <span className="visually-hidden">Lọc câu hỏi theo chủ đề</span>
          <Icon name="settings" size={17} />
          <select
            onChange={(event) =>
              setTopic(event.target.value as ContentTopic | "all")
            }
            value={topic}
          >
            <option value="all">Tất cả chủ đề</option>
            {Array.from(new Set(items.map((item) => item.topic))).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button
          className="catalog-reset"
          onClick={() => {
            setQuery("");
            setTopic("all");
          }}
          type="button"
        >
          Xóa bộ lọc
        </button>
      </div>
      <p aria-live="polite" className="catalog-count">
        {result.length} câu hỏi
      </p>
      <div className="faq-list">
        {result.map((item, index) => (
          <details className="faq-item" key={item.id}>
            <summary>
              <span className="faq-index">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.question}</span>
              <span aria-hidden="true" className="faq-toggle">
                <Icon className="faq-toggle-closed" name="addCircle" size={19} />
                <Icon className="faq-toggle-open" name="closeCircle" size={19} />
              </span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
        {result.length === 0 && (
          <div className="catalog-empty compact-empty">
            <h2>Không tìm thấy câu hỏi</h2>
            <p>Thử từ khóa khác hoặc chọn “Tất cả chủ đề”.</p>
          </div>
        )}
      </div>
    </div>
  );
}
