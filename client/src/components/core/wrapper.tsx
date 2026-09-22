import type { PropsWithChildren } from "react";
import AppStatusBar from "./statusbar";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/features/auth/context/auth-provider";
import FeedbackProvider from "@/providers/feedback";

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <FeedbackProvider>
        <AuthProvider>{children}</AuthProvider>
      </FeedbackProvider>
    </QueryProvider>
  );
}
