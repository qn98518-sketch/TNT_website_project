"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { projects } from "@/content/local-data";

export function HomeProjectShowcase() {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? "");
  const selectedProject =
    projects.find((project) => project.slug === selectedSlug) ?? projects[0];

  if (!selectedProject) return null;

  return (
    <section className="section home-project-section">
      <div className="container">
        <div className="section-heading home-project-heading">
          <div>
            <span className="eyebrow">GIẢI PHÁP THỰC TẾ</span>
            <h2 className="section-title">
              Giải pháp thực tế,
              <br />
              <span>giá trị bền vững.</span>
            </h2>
          </div>
          <p className="section-lede">
            TNT đồng hành cùng doanh nghiệp trong những dự án công nghệ và
            quản trị. Thông tin công bố cần được TNT duyệt.
          </p>
        </div>
        <div aria-label="Dự án tham khảo" className="home-project-tabs" role="tablist">
          {projects.map((project) => (
            <button
              aria-selected={selectedSlug === project.slug}
              className={selectedSlug === project.slug ? "is-current" : undefined}
              id={`home-project-tab-${project.slug}`}
              key={project.slug}
              onClick={() => setSelectedSlug(project.slug)}
              role="tab"
              type="button"
            >
              <strong>{project.industry}</strong>
              <span>{project.title}</span>
            </button>
          ))}
        </div>
        <article
          aria-labelledby={`home-project-tab-${selectedProject.slug}`}
          className="home-project-feature"
          role="tabpanel"
        >
          <div className="home-project-image">
            {selectedProject.image && (
              <Image
                alt={selectedProject.imageAlt ?? ""}
                fill
                sizes="(max-width: 760px) 100vw, 54vw"
                src={selectedProject.image}
              />
            )}
            <span className="home-project-image-label">DỰ ÁN THAM KHẢO</span>
          </div>
          <div className="home-project-copy">
            <span className="eyebrow">
              {selectedProject.service} · {selectedProject.industry}
            </span>
            <h3>{selectedProject.title}</h3>
            {selectedProject.sourceLabel && (
              <span className="review-label">{selectedProject.sourceLabel}</span>
            )}
            <p>{selectedProject.summary}</p>
            <div className="home-project-detail">
              <strong>Bài toán</strong>
              <p>{selectedProject.challenge}</p>
            </div>
            <div className="home-project-detail">
              <strong>Giải pháp</strong>
              <p>{selectedProject.solution ?? selectedProject.approach}</p>
            </div>
            <Link className="text-link" href={`/du-an/${selectedProject.slug}`}>
              Xem chi tiết <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </article>
        <p className="home-project-disclosure">
          Nội dung dự án là mẫu minh họa, chưa được xác nhận là công việc hoặc
          kết quả thực tế của TNT.
        </p>
      </div>
    </section>
  );
}
