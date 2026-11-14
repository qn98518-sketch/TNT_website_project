"use client";
import { useEffect, useId, useRef, useState, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
type Common = { label: string; name: string; error?: string; hint?: string };
export function Field({ label, error, hint, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId(); return <div className="cms-field"><label htmlFor={id}>{label}{props.required && " *"}</label><input {...props} id={id} aria-invalid={Boolean(error) || undefined} aria-describedby={error || hint ? `${id}-help` : undefined} /><Help id={`${id}-help`} error={error} hint={hint} /></div>;
}
export function Choice({ label, error, hint, children, ...props }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId(); return <div className="cms-field"><label htmlFor={id}>{label}{props.required && " *"}</label><select {...props} id={id} aria-invalid={Boolean(error) || undefined} aria-describedby={error || hint ? `${id}-help` : undefined}>{children}</select><Help id={`${id}-help`} error={error} hint={hint} /></div>;
}
export function Textarea({ label, error, hint, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId(); return <div className="cms-field cms-full"><label htmlFor={id}>{label}</label><textarea {...props} id={id} aria-invalid={Boolean(error) || undefined} aria-describedby={error || hint ? `${id}-help` : undefined} /><Help id={`${id}-help`} error={error} hint={hint} /></div>;
}
function Help({ id, error, hint }: { id: string; error?: string; hint?: string }) { return error || hint ? <small id={id} className={error ? "cms-field-error" : "cms-hint"}>{error || hint}</small> : null; }
export function Notice({ message, success = false }: { message: string; success?: boolean }) { return message ? <p className={`cms-notice${success ? " cms-notice-success" : ""}`} role={success ? "status" : "alert"}>{message}</p> : null; }
export function focusInvalid(form: HTMLFormElement) { requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); }
export function Modal({ title, children, onClose, busy = false }: { title: string; children: ReactNode; onClose: () => void; busy?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null), id = useId();
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => { dialog?.close(); }; }, []);
  return <dialog ref={ref} className="cms-modal" aria-labelledby={id} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <div className="cms-modal-heading"><h3 id={id}>{title}</h3><button type="button" className="cms-icon-button" disabled={busy} aria-label="Đóng" onClick={onClose}>×</button></div>{children}
  </dialog>;
}
export function ConfirmDelete({ title, description, onClose, onDelete }: { title: string; description: string; onClose: () => void; onDelete: () => Promise<void> }) {
  const [state, setState] = useDeleteState();
  return <Modal title={title} onClose={onClose} busy={state.busy}><p className="cms-modal-description">{description}</p><Notice message={state.error} /><div className="cms-actions"><button type="button" className="cms-button cms-secondary" onClick={onClose} disabled={state.busy}>Hủy</button><button type="button" className="cms-button cms-danger" disabled={state.busy} onClick={async () => { setState({busy:true,error:""}); try { await onDelete(); } catch (error) { setState({busy:false,error:error instanceof Error ? error.message : "Không thể xóa. Vui lòng thử lại."}); } }}>{state.busy ? "Đang xóa…" : "Xác nhận xóa"}</button></div></Modal>;
}
function useDeleteState() { return useState({ busy: false, error: "" }); }
