import { createContext, useState } from "react";

import FeedbackModal, {
  type FeedbackOptions,
} from "@/components/core/feedback-modal";

type FeedbackContextType = {
  success: (message: string, title?: string) => void;
  error: (error: unknown, title?: string) => void;
  errorMessage: (message: string, title?: string) => void;
  close: () => void;
};

export const FeedbackContext = createContext<FeedbackContextType | null>(null);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
            detail?: string;
          };
        };
      }
    ).response;

    return (
      response?.data?.message ??
      response?.data?.detail ??
      "Something went wrong."
    );
  }

  return "Something went wrong.";
}

export default function FeedbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [feedback, setFeedback] = useState<FeedbackOptions | null>(null);

  function success(message: string, title = "Success") {
    setFeedback({
      type: "success",
      title,
      message,
    });
  }

  function error(error: unknown, title = "Failed") {
    setFeedback({
      type: "error",
      title,
      message: getErrorMessage(error),
    });
  }

  function errorMessage(message: string, title = "Failed") {
    setFeedback({
      type: "error",
      title,
      message,
    });
  }

  function close() {
    setFeedback(null);
  }

  return (
    <FeedbackContext.Provider
      value={{
        success,
        error,
        errorMessage,
        close,
      }}
    >
      {children}

      <FeedbackModal feedback={feedback} onClose={close} />
    </FeedbackContext.Provider>
  );
}
