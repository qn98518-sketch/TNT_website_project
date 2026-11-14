import type { ReactNode } from "react";

export function AnimatedCollapse({ open, children, id, className = "" }: {
  open: boolean;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return <div id={id} className={`animated-collapse ${className}`} data-open={open} aria-hidden={!open} inert={!open}>
    <div className="animated-collapse-clip">{children}</div>
  </div>;
}
