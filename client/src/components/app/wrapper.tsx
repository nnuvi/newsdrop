import type { PropsWithChildren } from "react";
import AppStatusBar from "./statusbar";
import { QueryProvider } from "@/providers/query-provider";

export function Providers({ children }: PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>;
}
