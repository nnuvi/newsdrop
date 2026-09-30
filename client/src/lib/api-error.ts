import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          detail?:
            | {
                message?: string;
              }
            | string;
          message?: string;
          error?: string;
        }
      | undefined;

    if (
      typeof data?.detail === "object" &&
      typeof data.detail?.message === "string"
    ) {
      return data.detail.message;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (typeof data?.error === "string") {
      return data.error;
    }

    if (!error.response) {
      return "Unable to connect to the server. Please check your connection.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
