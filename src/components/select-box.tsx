"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconName } from "@/components/ui/icon";
import { useI18n } from "@/i18n/provider";

export type SelectOption = { value: string; label: string; disabled?: boolean };

type Props = {
  options: readonly SelectOption[];
  label: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  icon?: IconName;
  errorMessage?: string;
};

const normalize = (value: string) => value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");

export function SelectBox({ options, label, id, name, value, defaultValue = "", onValueChange, required = false, disabled = false, icon, errorMessage }: Props) {
  const { t } = useI18n();
  const generatedId = useId();
  const baseId = id ?? `select-${generatedId}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const nativeRef = useRef<HTMLSelectElement>(null);
  const searchRef = useRef("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [invalid, setInvalid] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const attachTrigger = useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node;
    if (node) setPortalTarget(node.ownerDocument.body);
  }, []);
  const [placement, setPlacement] = useState({ left: 0, width: 0, edge: 0, height: 280, side: "bottom" });
  const selectedValue = value ?? internalValue;
  const selected = options.find(option => option.value === selectedValue) ?? options[0];
  const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
  if (disabled && open) setOpen(false);

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled || disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onValueChange?.(option.value);
    setInvalid(false);
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function show(last = false) {
    if (disabled || triggerRef.current?.matches(":disabled")) return;
    const current = options.findIndex(option => option.value === selectedValue && !option.disabled);
    setActive(current >= 0 ? current : enabled[last ? enabled.length - 1 : 0] ?? -1);
    setOpen(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "Escape") { if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false); } return; }
    if (event.key === "Tab") { setOpen(false); return; }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        show(event.key === "ArrowUp" || event.key === "End");
        if (event.key === "Home" || event.key === "End") setActive(enabled[event.key === "Home" ? 0 : enabled.length - 1] ?? -1);
        return;
      }
      if (event.key === "Home" || event.key === "End") setActive(enabled[event.key === "Home" ? 0 : enabled.length - 1] ?? -1);
      else {
        const current = enabled.indexOf(active);
        const next = (current + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length;
        setActive(enabled[next] ?? -1);
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); if (open) choose(active); else show(); return; }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      searchRef.current += normalize(event.key);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => { searchRef.current = ""; }, 650);
      const ordered = [...enabled.filter(index => index > active), ...enabled.filter(index => index <= active)];
      const next = ordered.find(index => normalize(options[index].label).startsWith(searchRef.current));
      if (next !== undefined) { setActive(next); setOpen(true); }
    }
  }

  useEffect(() => {
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, []);

  useEffect(() => {
    const form = nativeRef.current?.form;
    if (!form) return;
    const reset = () => {
      if (value === undefined) setInternalValue(defaultValue);
      setInvalid(false);
      setOpen(false);
    };
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [defaultValue, value]);

  useLayoutEffect(() => {
    if (!open || !portalTarget) return;
    function position() {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) { setOpen(false); return; }
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const side = below < 180 && above > below ? "top" : "bottom";
      const width = Math.min(rect.width, window.innerWidth - 16);
      const next = { width, left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)), edge: side === "bottom" ? rect.bottom + 6 : window.innerHeight - rect.top + 6, height: Math.max(64, Math.min(280, side === "bottom" ? below : above)), side };
      setPlacement(current => Object.keys(next).every(key => current[key as keyof typeof current] === next[key as keyof typeof next]) ? current : next);
    }
    position();
    const observer = new ResizeObserver(position);
    if (triggerRef.current) observer.observe(triggerRef.current);
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => { observer.disconnect(); document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true); };
  }, [open, portalTarget]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("[data-active=true]")?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  return <div className="custom-select" ref={rootRef}>
    <button id={baseId} className="custom-select-trigger" ref={attachTrigger} type="button" role="combobox" aria-label={`${label}: ${selected?.label ?? ""}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${baseId}-listbox`} aria-activedescendant={open && active >= 0 ? `${baseId}-option-${active}` : undefined} aria-required={required || undefined} aria-invalid={invalid || Boolean(errorMessage) || undefined} aria-describedby={invalid || errorMessage ? `${baseId}-error` : undefined} disabled={disabled} data-placeholder={!selectedValue} onClick={() => open ? setOpen(false) : show()} onKeyDown={handleKeyDown}>
      {icon && <Icon name={icon} purpose="control" size={18} />}<span className="custom-select-value">{selected?.label}</span><Icon className="custom-select-chevron" name="arrowDown" size={16} />
    </button>
    <select className="custom-select-native" ref={nativeRef} name={name} value={selectedValue} required={required} disabled={disabled} aria-hidden="true" tabIndex={-1} onChange={event => {
      if (value === undefined) setInternalValue(event.target.value);
      onValueChange?.(event.target.value);
      setInvalid(false);
    }} onFocus={() => triggerRef.current?.focus({ preventScroll: true })} onInvalid={event => { event.preventDefault(); setInvalid(true); show(); triggerRef.current?.focus({ preventScroll: true }); }}>
      {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select>
    {(invalid || errorMessage) && <span className="custom-select-error" id={`${baseId}-error`} role="alert">{t(errorMessage || "Vui lòng chọn một nội dung.")}</span>}
    {portalTarget && createPortal(<div className="custom-select-panel dropdown-surface" ref={panelRef} id={`${baseId}-listbox`} role="listbox" aria-label={label} aria-hidden={!open} inert={!open} data-open={open} data-side={placement.side} style={{ left: placement.left, width: placement.width, maxHeight: placement.height, top: placement.side === "bottom" ? placement.edge : undefined, bottom: placement.side === "top" ? placement.edge : undefined }} onPointerDown={event => { if (event.pointerType !== "touch") event.preventDefault(); }}>
      {options.map((option, index) => <div className="custom-select-option" role="option" id={`${baseId}-option-${index}`} key={option.value} aria-selected={option.value === selectedValue} aria-disabled={option.disabled || undefined} data-active={active === index} onPointerMove={event => { if (event.pointerType === "mouse" && !option.disabled) setActive(index); }} onClick={() => choose(index)}><span>{option.label}</span>{option.value === selectedValue && <Icon name="tickCircle" purpose="control" size={18} />}</div>)}
    </div>, portalTarget)}
  </div>;
}
