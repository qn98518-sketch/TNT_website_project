// A single observer per page; completed targets release their animation state.
const targets = [
  "main > section",
  "main > section > :is(.container, .rf-container) > *",
  "main :is(.rf-heading, .wf-section-heading, .section-heading)",
  "main :is(.content-card-grid, .wf-service-grid, .wf-feature-grid, .wf-value-grid, .wf-gallery, .wf-topics, .guide-card-grid, .rf-service-grid, .rf-food-card-grid, .rf-values, .rf-fit-options, .wf-project-facts) > *",
  "main :is(.rf-process-grid, .wf-process-grid, .rf-food-steps, .rf-workflow-nodes, .rf-about-method ol, .rf-about-capabilities ul) > li",
  "main :is(.rf-erp-panel, .rf-overview-top, .rf-overview-bottom, .rf-mission, .rf-workflow-states, .wf-compare) > *",
  "main .rf-erp-modules > li",
  "main .rf-erp-laptop",
  "main .rf-food-faq h2",
  "main :is(.catalog-controls, .catalog-count, .catalog-empty, .wf-article-callout, .wf-article-related-links, .project-story-figure)",
  "main :is(.wf-article-body, .project-story-body) > section",
  ".rf-footer-grid > div",
  ".rf-footer-bottom",
].join(",");

const protectedContent = [
  "[data-reveal-skip]", "[data-aos]", ".aos-init",
  ".home-statistics", ".leadership-carousel", ".rf-project-tabs", ".rf-project-feature",
  ".animated-collapse", ".animated-accordion", ".cms-app",
].join(",");
const unavailable = "[hidden], [aria-hidden='true'], [inert]";
const fadeOnly = "img, picture, figure, nav, form, .wf-photo, .lead-card, .project-story-figure, .rf-footer-bottom, .catalog-controls, .catalog-count";

type MotionNavigator = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export function installScrollReveal(root: HTMLElement): () => void {
  const device = navigator as MotionNavigator;
  const constrained = device.connection?.saveData ||
    (device.deviceMemory !== undefined && device.deviceMemory <= 2) ||
    (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 2);
  if (constrained || !("IntersectionObserver" in window)) return () => {};

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const tablet = window.matchMedia("(max-width: 1100px), (hover: none) and (pointer: coarse)");
  const phone = window.matchMedia("(max-width: 760px)");
  const visited = new WeakSet<HTMLElement>();
  const pending = new Set<HTMLElement>();
  const queued = new Set<HTMLElement>();
  let frame = 0;
  let disposed = false;

  function finish(element: HTMLElement) {
    observer.unobserve(element);
    pending.delete(element);
    element.removeAttribute("data-reveal");
    element.removeAttribute("data-reveal-effect");
    element.style.removeProperty("--reveal-delay");
    visited.add(element);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      if (!entry.isIntersecting || !pending.has(element)) continue;
      observer.unobserve(element);
      if (motion.matches || document.hidden || !element.isConnected || element.closest(protectedContent)) {
        finish(element);
      } else {
        element.setAttribute("data-reveal", "visible");
      }
    }
  }, { rootMargin: "0px 0px 24px 0px", threshold: 0 });

  function register(scope: HTMLElement) {
    if (disposed || motion.matches || !scope.isConnected) return;
    const candidates = new Set<HTMLElement>();
    if (scope.matches(targets)) candidates.add(scope);
    scope.querySelectorAll<HTMLElement>(targets).forEach(element => candidates.add(element));

    // Pick the smallest meaningful blocks, avoiding parent/child animations.
    // Keep visited children in this calculation so a later scan cannot animate
    // their parent a second time.
    const parents = new Set<HTMLElement>();
    for (const element of candidates) {
      for (let parent = element.parentElement; parent && parent !== root; parent = parent.parentElement) {
        if (candidates.has(parent)) parents.add(parent);
      }
    }

    // Batch geometry reads before opacity/translate writes to avoid layout thrashing.
    const measured = Array.from(candidates).filter(element => {
      if (parents.has(element) || visited.has(element) || element.closest(`${protectedContent},${unavailable},[data-reveal]`) || element.querySelector(protectedContent)) return false;
      for (let parent = element.parentElement; parent && parent !== root; parent = parent.parentElement) {
        if (visited.has(parent)) return false;
      }
      return true;
    }).map(element => ({ element, rect: element.getBoundingClientRect() }));
    for (const { element, rect } of measured) {
      if (!rect.width || !rect.height) continue;
      if (rect.top < window.innerHeight - 24 || element.matches(":target") || element.contains(document.activeElement)) {
        visited.add(element);
        continue;
      }
      observer.observe(element);
      element.setAttribute("data-reveal-effect", element.matches(fadeOnly) ? "fade-in" : "fade-up");
      const index = element.parentElement ? Array.prototype.indexOf.call(element.parentElement.children, element) : 0;
      element.style.setProperty("--reveal-delay", `${(index % 3) * 45}ms`);
      element.setAttribute("data-reveal", "pending");
      visited.add(element);
      pending.add(element);
    }
  }

  function flush() {
    frame = 0;
    if (disposed || document.hidden || motion.matches) return;
    const scopes = Array.from(queued);
    queued.clear();
    for (const scope of scopes) register(scope);
  }

  function schedule(scope: HTMLElement) {
    if (disposed || motion.matches || scope.closest(protectedContent)) return;
    for (const parent of queued) if (parent.contains(scope)) return;
    for (const child of queued) if (scope.contains(child)) queued.delete(child);
    queued.add(scope);
    if (queued.size > 8) { queued.clear(); queued.add(root); }
    if (!frame && !document.hidden) frame = requestAnimationFrame(flush);
  }

  const mutations = typeof MutationObserver === "undefined" ? null : new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "attributes") {
        const element = record.target as HTMLElement;
        if (element.hasAttribute("data-reveal-skip")) {
          for (const target of pending) if (element.contains(target)) finish(target);
        } else schedule(element);
        continue;
      }
      for (const node of record.removedNodes) {
        if (node instanceof HTMLElement) for (const target of pending) if (node.contains(target)) finish(target);
      }
      for (const node of record.addedNodes) if (node instanceof HTMLElement) schedule(node);
    }
  });

  function onAnimationEnd(event: AnimationEvent) {
    if (event.animationName.startsWith("tnt-reveal-") && event.target instanceof HTMLElement && pending.has(event.target)) finish(event.target);
  }
  function onFocus(event: FocusEvent) {
    if (!(event.target instanceof HTMLElement)) return;
    const target = event.target.closest<HTMLElement>("[data-reveal]");
    if (target && pending.has(target)) finish(target);
  }
  function onMotionChange() {
    if (motion.matches) {
      observer.disconnect();
      for (const target of pending) finish(target);
      queued.clear();
      cancelAnimationFrame(frame);
      frame = 0;
    } else schedule(root);
  }
  function onVisibilityChange() {
    if (document.hidden) {
      for (const target of pending) if (target.getAttribute("data-reveal") === "visible") finish(target);
    } else if (queued.size && !frame) frame = requestAnimationFrame(flush);
  }
  function onLayoutChange() { schedule(root); }

  // Clear state left by the earlier section-wide reveal during development/HMR.
  root.querySelectorAll<HTMLElement>("main > section[data-reveal]").forEach(element => element.removeAttribute("data-reveal"));
  register(root);
  mutations?.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-reveal-skip"] });
  root.addEventListener("animationend", onAnimationEnd);
  root.addEventListener("animationcancel", onAnimationEnd);
  root.addEventListener("focusin", onFocus);
  document.addEventListener("visibilitychange", onVisibilityChange);
  motion.addEventListener("change", onMotionChange);
  tablet.addEventListener("change", onLayoutChange);
  phone.addEventListener("change", onLayoutChange);

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    mutations?.disconnect();
    for (const target of pending) finish(target);
    queued.clear();
    root.removeEventListener("animationend", onAnimationEnd);
    root.removeEventListener("animationcancel", onAnimationEnd);
    root.removeEventListener("focusin", onFocus);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    motion.removeEventListener("change", onMotionChange);
    tablet.removeEventListener("change", onLayoutChange);
    phone.removeEventListener("change", onLayoutChange);
  };
}
