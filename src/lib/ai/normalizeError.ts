export interface NormalizedError {
  name: string;
  status: number;
  message: string;
  headers?: Record<string, string>;
}

export function normalizeError(error: unknown): NormalizedError {
  // AI SDK / OpenAI style error
  if (typeof error === "object" && error !== null) {
    const err = error as any;

    return {
      name: err.name || "UnknownError",
      status: err.status || err.statusCode || 500,
      message:
        err.message ||
        err.error?.message ||
        "Something went wrong while processing request",
      headers: err.headers,
    };
  }

  return {
    name: "UnknownError",
    status: 500,
    message: "Unexpected error occurred",
  };
}
