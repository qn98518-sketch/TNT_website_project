"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { projects } from "@/content/local-data";
export function HomeProjectShowcase() {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? "");
  const index = projects.findIndex(p => p.slug === selectedSlug);
  const selected = projects[index] ?? projects[0];
  if (!selected) return null;
  function advance(delta: number) { setSelectedSlug(projects[(index + delta + projects.length) % projects.length].slug); }
  return <section className="rf-projects">
    <div className="rf-container">
      <div className="rf-project-heading">
        <div>
          <span className="rf-eyebrow">CÂU CHUYỆN DỰ ÁN</span>
          <h2>Giải pháp thực tế, <em>giá trị bền vững</em>
          </h2>
        </div>
        <p>TNT đồng hành cùng doanh nghiệp trong những dự án công nghệ,<br />triển khai các giải pháp phần mềm phù hợp với nhu cầu thực tế.</p>
        <div>
          <button onClick={() => advance(-1)} type="button" aria-label="Dự án trước">
            <Icon name="arrowLeft" />
          </button>
          <button onClick={() => advance(1)} type="button" aria-label="Dự án tiếp theo">
            <Icon name="arrowRight" />
          </button>
        </div>
      </div>
      <div className="rf-project-tabs" role="tablist" aria-label="Dự án tham khảo">{projects.map((p, i) =>
        <button id={`home-project-tab-${p.slug}`} key={p.slug} role="tab" aria-selected={selectedSlug === p.slug} aria-controls="home-project-panel" tabIndex={selectedSlug === p.slug ? 0 : -1} onClick={() => setSelectedSlug(p.slug)} onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const next = (i + (e.key === "ArrowRight" ? 1 : -1) + projects.length) % projects.length; setSelectedSlug(projects[next].slug); document.getElementById(`home-project-tab-${projects[next].slug}`)?.focus(); } }} type="button">
          <Icon name={i === 0 ? "building" : i === 1 ? "layer" : i === 2 ? "people" : "book"} />
          <span>
            <strong>{["KALA", "Sản xuất gỗ", "Tuyển dụng", "Giáo dục"][i]}</strong>
            <small>{p.industry}</small>
          </span>
        </button>)}</div>
      <article className="rf-project-feature" id="home-project-panel" role="tabpanel" aria-labelledby={`home-project-tab-${selected.slug}`}>
        <Image unoptimized src={selected.slug === "kala" ? "/images/work_factory.webp" : selected.image ?? "/images/solution.webp"} alt={selected.imageAlt ?? selected.title} width={1000} height={520} />
        <div>
          <span className="rf-pill">{selected.industry}</span>
          <h3>{selected.slug === "kala" ? "Triển khai hệ thống quản trị sản xuất TNM cho nhà máy kính KALA" : selected.title}</h3>
          <p>{selected.summary}</p>
          <div className="rf-project-points">
            <div>
              <Icon name="scan" />
              <strong>Bài toán</strong>
              <p>{selected.challenge}</p>
            </div>
            <div>
              <Icon name="setting" />
              <strong>Giải pháp</strong>
              <p>{selected.solution ?? selected.approach}</p>
            </div>
            <div>
              <Icon name="chart" />
              <strong>Giá trị mang lại</strong>
              <p>{selected.outcome}</p>
            </div>
          </div>
          <Link className="rf-button" href={`/du-an/${selected.slug}`}>Xem câu chuyện dự án <Icon name="arrowRight" />
          </Link>
        </div>
      </article>
      <small className="rf-review">Nội dung dự án là mẫu minh họa, chưa được xác nhận là công việc hoặc kết quả thực tế của TNT.</small>
    </div>
  </section>;
}
