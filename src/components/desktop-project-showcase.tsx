"use client";
import { useI18n } from "@/i18n/provider";
import { SiteImage as Image } from "@/components/site-image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import type { ProjectRecord } from "@/content/models";
import { projectMedia } from "@/lib/media";
import "./home-project-showcase.css";
const tabLabels: Record<string, string> = { kala: "KALA", kova: "KOVA", "lomonoxop-my-dinh": "TN EDU", "cong-thong-tin-doanh-nghiep-ha-noi": "Hà Nội", wood: "Sản xuất gỗ", recruitment: "Tuyển dụng", elearning: "Giáo dục" };
const projectIcons: Record<string, IconName> = { "erp-che-bien-thuy-san": "building4", kala: "building", kova: "building4", "lomonoxop-my-dinh": "book", "cong-thong-tin-doanh-nghiep-ha-noi": "monitor", wood: "layer", recruitment: "people", elearning: "book" };
export function DesktopProjectShowcase({ projects }: { projects: readonly ProjectRecord[] }) {
    const { t } = useI18n();
    const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? "");
    const index = projects.findIndex(p => p.slug === selectedSlug);
    const selected = projects[index] ?? projects[0];
    if (!selected)
        return null;
    function advance(delta: number) { setSelectedSlug(projects[(index + delta + projects.length) % projects.length].slug); }
    return <>
      <div className="rf-project-heading">
        <div>
          <span className="rf-eyebrow">{t("CÂU CHUYỆN DỰ ÁN")}</span>
          <h2 className="tnt-section-title">{t("Giải pháp thực tế, ")}<em>{t("giá trị bền vững")}</em>
          </h2>
        </div>
        <p>{t("TNT đồng hành cùng doanh nghiệp trong những dự án công nghệ,")}<br />{t("triển khai các giải pháp phần mềm phù hợp với nhu cầu thực tế.")}</p>
        <div>
          <button onClick={() => advance(-1)} type="button" aria-label={t("Dự án trước")}>
            <Icon name="arrowLeft"/>
          </button>
          <button onClick={() => advance(1)} type="button" aria-label={t("Dự án tiếp theo")}>
            <Icon name="arrowRight"/>
          </button>
        </div>
      </div>
      <div className="rf-project-tabs" style={{ "--project-count": projects.length } as CSSProperties} role="tablist" aria-label={t("Dự án tham khảo")}>{t(projects.map((p, i) => <button id={`home-project-tab-${p.slug}`} key={p.slug} role="tab" aria-selected={selectedSlug === p.slug} aria-controls="home-project-panel" tabIndex={selectedSlug === p.slug ? 0 : -1} onClick={() => setSelectedSlug(p.slug)} onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            const next = (i + (e.key === "ArrowRight" ? 1 : -1) + projects.length) % projects.length;
            setSelectedSlug(projects[next].slug);
            document.getElementById(`home-project-tab-${projects[next].slug}`)?.focus();
        } }} type="button">
          <Icon name={projectIcons[p.slug] ?? "briefcase"} purpose="content"/>
          <span>
            <strong>{t(p.shortTitle ?? tabLabels[p.slug] ?? p.industry)}</strong>
            <small>{t(p.industry)}</small>
          </span>
        </button>))}</div>
      <article className="rf-project-feature" id="home-project-panel" role="tabpanel" aria-labelledby={`home-project-tab-${selected.slug}`}>
        <div className="rf-project-media">
          <Image unoptimized fill src={projectMedia(selected.slug,selected.image)} alt={t(selected.imageAlt ?? selected.title)} sizes="(max-width: 900px) 100vw, 50vw"/>
        </div>
        <div className="rf-project-copy">
          <span className="rf-pill">{t(selected.industry)}</span>
          {selected.isSimulation && <span className="project-simulation-label">{t(selected.sourceLabel ?? "Case study mô phỏng")}</span>}
          <h3>{t(selected.slug === "kala" ? "Triển khai hệ thống quản trị sản xuất TNM cho nhà máy kính KALA" : selected.title)}</h3>
          <p>{t(selected.summary)}</p>
          <div className="rf-project-points">
            <div>
              <Icon name="scan"/>
              <strong>{t("Bài toán")}</strong>
              <p>{t(selected.sourceUrl ? selected.challengeTitle ?? selected.challenge : selected.challenge)}</p>
            </div>
            <div>
              <Icon name="setting"/>
              <strong>{t("Giải pháp")}</strong>
              <p>{t(selected.sourceUrl ? selected.solutionTitle ?? selected.approach : selected.solution ?? selected.approach)}</p>
            </div>
            <div>
              <Icon name="chart"/>
              <strong>{t(selected.isSimulation ? "Giá trị kỳ vọng" : "Giá trị mang lại")}</strong>
              <p>{t(selected.outcome)}</p>
            </div>
          </div>
          <Link className="rf-button" href={`/du-an/${selected.slug}`}>{t("Xem câu chuyện dự án ")}<Icon name="arrowRight"/>
          </Link>
        </div>
      </article>

  </>;
}
