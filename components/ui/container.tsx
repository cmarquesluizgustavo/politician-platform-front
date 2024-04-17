import { ReactNode } from "react";

export function Container({ children }: {children: ReactNode}) {
  return <div className="container py-8">{children}</div>
}
