"use client";
import { useI18n } from "@/i18n/provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { LanguageSwitcher } from "@/components/language-switcher";
type NavLink = {
    href: string;
    label: string;
};
type DropdownName = "services" | "insights";
const links = {
    home: { href: "/", label: "Trang chủ" },
    solution: {
        href: "/giai-phap-nganh-thuc-pham",
        label: "Giải pháp",
    },
    projects: { href: "/du-an", label: "Dự án" },
    about: { href: "/ve-tnt", label: "Về TNT" },
    contact: { href: "/#contact", label: "Trao đổi dự án" },
    search: { href: "/kien-thuc/blog?focus=search", label: "Tìm kiếm" },
};
const serviceLinks: readonly NavLink[] = [
    { href: "/dich-vu", label: "Tổng quan dịch vụ" },
    { href: "/dich-vu/erp", label: "ERP" },
    { href: "/dich-vu/outsourcing", label: "Outsourcing" },
    { href: "/dich-vu/body-shop", label: "Body Shop" },
];
const insightLinks: readonly NavLink[] = [
    { href: "/kien-thuc", label: "Tổng quan kiến thức" },
    { href: "/kien-thuc/blog", label: "Blog" },
    { href: "/kien-thuc/guides", label: "Tài liệu / Guides" },
    { href: "/kien-thuc/faq", label: "FAQ" },
];
function isCurrentRoute(pathname: string, href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}
export function SiteHeader() {
    const { t } = useI18n();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<DropdownName | null>(null);
    const menuRef = useRef<HTMLElement>(null);
    useEffect(() => {
        function handlePointerDown(event: PointerEvent) {
            if (!menuRef.current?.contains(event.target as Node)) {
                setMenuOpen(false);
                setOpenDropdown(null);
            }
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMenuOpen(false);
                setOpenDropdown(null);
            }
        }
        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    function closeMenus() {
        setMenuOpen(false);
        setOpenDropdown(null);
    }
    function renderDropdown(id: DropdownName, label: string, items: readonly NavLink[]) {
        const expanded = openDropdown === id;
        const active = items.some((item) => isCurrentRoute(pathname, item.href));
        return (<div className="nav-dropdown">
        <button aria-expanded={expanded} aria-haspopup="true" className="nav-dropdown-trigger" data-active={active || undefined} onClick={() => setOpenDropdown(expanded ? null : id)} onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setOpenDropdown(id);
                    requestAnimationFrame(() => {
                        menuRef.current
                            ?.querySelector<HTMLAnchorElement>(`[data-menu="${id}"] a`)
                            ?.focus();
                    });
                }
            }} type="button">
          {t(label)}
          <Icon name="arrowDown" size={15}/>
        </button>
        <div className="nav-dropdown-panel" data-menu={id} hidden={!expanded} onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    const anchors = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("a"));
                    const index = anchors.indexOf(document.activeElement as HTMLAnchorElement);
                    const direction = event.key === "ArrowDown" ? 1 : -1;
                    event.preventDefault();
                    anchors[(index + direction + anchors.length) % anchors.length]?.focus();
                }
            }}>
          {t(items.map((item) => (<Link aria-current={isCurrentRoute(pathname, item.href) ? "page" : undefined} href={item.href} key={item.href} onClick={closeMenus}>
              {t(item.label)}
            </Link>)))}
        </div>
      </div>);
    }
    return (<header className="site-header" ref={menuRef}>
      <div className="container header-inner">
        <Link aria-label={t("TNT — Trang chủ")} className="brand" href="/" onClick={closeMenus}>
          <span aria-hidden="true" className="brand-lockup">
            <span className="brand-lockup-title">{t("TNT")}</span>
            <span className="brand-lockup-caption">{t("TRÍ NGHĨA TECH")}</span>
          </span>
        </Link>

        <nav aria-label={t("Điều hướng chính")} className="desktop-nav">
          <Link aria-current={isCurrentRoute(pathname, "/") ? "page" : undefined} href={links.home.href} onClick={closeMenus}>
            {t(links.home.label)}
          </Link>
          <Link aria-current={isCurrentRoute(pathname, links.solution.href) ? "page" : undefined} href={links.solution.href} onClick={closeMenus}>
            {t(links.solution.label)}
          </Link>
          {t(renderDropdown("services", "Dịch vụ", serviceLinks))}
          <Link aria-current={isCurrentRoute(pathname, links.projects.href) ? "page" : undefined} href={links.projects.href} onClick={closeMenus}>
            {t(links.projects.label)}
          </Link>
          {t(renderDropdown("insights", "Kiến thức", insightLinks))}
          <Link aria-current={isCurrentRoute(pathname, links.about.href) ? "page" : undefined} href={links.about.href} onClick={closeMenus}>
            {t(links.about.label)}
          </Link>
        </nav>

        <div className="header-actions">
          <Link aria-label={t("Tìm kiếm bài viết")} className="header-icon-button" href={links.search.href} onClick={closeMenus} title={t("Tìm kiếm bài viết")}>
            <Icon name="search" size={19}/>
          </Link>
          <LanguageSwitcher />
          <Link className="button button-small header-cta" href={links.contact.href} onClick={closeMenus}>
            {t(links.contact.label)} <Icon name="arrowRight" size={17}/>
          </Link>
        </div>

        <div className="mobile-menu">
          <button aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label={t(menuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng")} className="mobile-menu-button" onClick={() => setMenuOpen((isOpen) => !isOpen)} type="button">
            <Icon name="menu" size={23}/>
          </button>
          <nav aria-label={t("Điều hướng di động")} className="mobile-nav" hidden={!menuOpen} id="mobile-navigation">
            <Link aria-current={isCurrentRoute(pathname, "/") ? "page" : undefined} href="/" onClick={closeMenus}>{t("Trang chủ")}</Link>
            <Link aria-current={isCurrentRoute(pathname, links.solution.href) ? "page" : undefined} href={links.solution.href} onClick={closeMenus}>{t("Giải pháp")}</Link>
            <div className="mobile-nav-group">
              <button aria-expanded={openDropdown === "services"} onClick={() => setOpenDropdown(openDropdown === "services" ? null : "services")} type="button">{t("Dịch vụ ")}<Icon name="arrowDown" size={16}/>
              </button>
              {t(openDropdown === "services" &&
            serviceLinks.map((item) => (<Link aria-current={isCurrentRoute(pathname, item.href) ? "page" : undefined} href={item.href} key={item.href} onClick={closeMenus}>
                    {t(item.label)}
                  </Link>)))}
            </div>
            <Link aria-current={isCurrentRoute(pathname, links.projects.href) ? "page" : undefined} href={links.projects.href} onClick={closeMenus}>{t("Dự án")}</Link>
            <div className="mobile-nav-group">
              <button aria-expanded={openDropdown === "insights"} onClick={() => setOpenDropdown(openDropdown === "insights" ? null : "insights")} type="button">{t("Kiến thức ")}<Icon name="arrowDown" size={16}/>
              </button>
              {t(openDropdown === "insights" &&
            insightLinks.map((item) => (<Link aria-current={isCurrentRoute(pathname, item.href) ? "page" : undefined} href={item.href} key={item.href} onClick={closeMenus}>
                    {t(item.label)}
                  </Link>)))}
            </div>
            <Link aria-current={isCurrentRoute(pathname, links.about.href) ? "page" : undefined} href={links.about.href} onClick={closeMenus}>{t("Về TNT")}</Link>
            <Link className="mobile-search" href={links.search.href} onClick={closeMenus}>
              <span><Icon name="search" size={17}/>{t(" Tìm kiếm")}</span>
              <Icon name="arrowRight" size={16}/>
            </Link>
            <span aria-current="true" aria-label={t("Ngôn ngữ hiện tại: Tiếng Việt")} className="mobile-language" lang="vi">{t("VI · Tiếng Việt")}</span>
            <Link className="mobile-contact" href={links.contact.href} onClick={closeMenus}>{t("Trao đổi dự án ")}<Icon name="arrowRight" size={17}/>
            </Link>
          </nav>
        </div>
      </div>
    </header>);
}
