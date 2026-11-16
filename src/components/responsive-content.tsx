import type { ReactNode } from "react";

export function ResponsiveContent({ desktop, children }: { desktop: ReactNode; children: ReactNode }) {
  return <>
    <div className="content-desktop-layout">{desktop}</div>
    <div className="content-small-layout">{children}</div>
  </>;
}
