"use client";
import { useI18n } from "@/i18n/provider";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { ContentTopic, FaqRecord } from "@/content/models";
type Props = {
    items: readonly FaqRecord[];
};
export function FaqBrowser({ items }: Props) {
    const { t } = useI18n();
    const [query, setQuery] = useState("");
    const [topic, setTopic] = useState<ContentTopic | "all">("all");
    const topics = ["all", ...Array.from(new Set(items.map((item) => item.topic)))] as const;
    const needle = query.trim().toLocaleLowerCase("vi");
    const result = items.filter((item) => {
            const matchesTopic = topic === "all" || item.topic === topic;
            const matchesQuery = !needle ||
                `${item.question} ${item.answer} ${item.topic} ${t(item.question)} ${t(item.answer)} ${t(item.topic)}`
                    .toLocaleLowerCase("vi")
                    .includes(needle);
            return matchesTopic && matchesQuery;
        });
    return (<div className="faq-browser">
      <div className="catalog-controls">
        <label className="catalog-search">
          <span className="visually-hidden">{t("Tìm câu hỏi")}</span>
          <Icon name="search" size={18}/>
          <input onChange={(event) => setQuery(event.target.value)} placeholder={t("Tìm câu hỏi")} type="search" value={query}/>
        </label>
        <button className="catalog-reset" onClick={() => {
            setQuery("");
            setTopic("all");
        }} type="button">{t("Xóa bộ lọc")}</button>
      </div>
      <div aria-label={t("Lọc câu hỏi theo chủ đề")} className="faq-tabs" role="group">
        {t(topics.map((item) => (<button aria-pressed={topic === item} className={topic === item ? "is-selected" : undefined} key={item} onClick={() => setTopic(item)} type="button">
            {t(item === "all" ? "Tất cả" : item)}
          </button>)))}
      </div>
      <p aria-live="polite" className="catalog-count">
        {t(result.length)}{t(" câu hỏi phù hợp")}</p>
      <div className="faq-list">
        {t(result.map((item, index) => (<details className="faq-item" key={item.id}>
            <summary>
              <span className="faq-index">{t(String(index + 1).padStart(2, "0"))}</span>
              <span>{t(item.question)}</span>
              <span aria-hidden="true" className="faq-toggle">
                <Icon className="faq-toggle-closed" name="addCircle" size={19}/>
                <Icon className="faq-toggle-open" name="closeCircle" size={19}/>
              </span>
            </summary>
            <p>{t(item.answer)}</p>
          </details>)))}
        {t(result.length === 0 && (<div className="catalog-empty compact-empty">
            <h2>{t("Không tìm thấy câu hỏi")}</h2>
            <p>{t("Thử từ khóa khác hoặc chọn “Tất cả chủ đề”.")}</p>
          </div>))}
      </div>
    </div>);
}
