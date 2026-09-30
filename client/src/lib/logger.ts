export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

export interface LogEntry {
  timestamp: string;
  level: Exclude<LogLevel, "silent">;
  message: string;
  context?: Record<string, unknown>;
  error?: SerializedError;
  [key: string]: unknown;
}

export interface SerializedError {
  name: string;
  message: string;
  code?: string;
  status?: number;
  cause?: SerializedError | unknown;
  [key: string]: unknown;
}

export type Transport = (entry: LogEntry) => void;

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

function safeReplacer() {
  const seen = new WeakSet<object>();

  return (_key: string, value: unknown) => {
    if (typeof value === "bigint") {
      return value.toString();
    }

    if (typeof value === "function") {
      return `[Function: ${value.name || "anonymous"}]`;
    }

    if (typeof value === "symbol") {
      return value.toString();
    }

    if (value instanceof Map) {
      return Object.fromEntries(value);
    }

    if (value instanceof Set) {
      return Array.from(value);
    }

    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }

      seen.add(value);
    }

    return value;
  };
}

function safeStringify(value: unknown, pretty = false): string {
  try {
    return (
      JSON.stringify(value, safeReplacer(), pretty ? 2 : undefined) ??
      "undefined"
    );
  } catch {
    try {
      return String(value);
    } catch {
      return "[Unserializable value]";
    }
  }
}

function serializeError(err: unknown, depth = 0): SerializedError | unknown {
  if (depth > 5) {
    return "[Max error depth reached]";
  }

  if (err === null || err === undefined) {
    return {
      name: "NonError",
      message: String(err),
    };
  }

  if (typeof err === "string") {
    return {
      name: "Error",
      message: err,
    };
  }

  if (typeof err !== "object") {
    return {
      name: "NonError",
      message: String(err),
    };
  }

  const value = err as Record<string, unknown>;

  const serialized: SerializedError = {
    name: typeof value.name === "string" ? value.name : "Error",

    message:
      typeof value.message === "string" ? value.message : "Unknown error",
  };

  if (typeof value.code === "string") {
    serialized.code = value.code;
  }

  if (typeof value.status === "number") {
    serialized.status = value.status;
  }

  if ("cause" in value && value.cause !== undefined) {
    serialized.cause = serializeError(value.cause, depth + 1);
  }

  return serialized;
}

const consoleTransport: Transport = (entry) => {
  const level = entry.level.toUpperCase();

  let output = `${level}  ${entry.message}`;

  if (entry.context && Object.keys(entry.context).length > 0) {
    output += `\n${safeStringify(entry.context, true)}`;
  }

  if (entry.error) {
    output += `\n${safeStringify(entry.error, true)}`;
  }

  switch (entry.level) {
    case "debug":
      console.debug(output);
      break;

    case "info":
      console.info(output);
      break;

    case "warn":
      console.warn(output);
      break;

    case "error":
      console.log(output);
      break;
  }
};

class Logger {
  private level: LogLevel = "debug";

  private globalContext: Record<string, unknown> = {};

  private transports: Transport[] = [consoleTransport];

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  setContext(context: Record<string, unknown>): void {
    try {
      this.globalContext = {
        ...this.globalContext,
        ...context,
      };
    } catch {
      // Ignore invalid context.
    }
  }

  clearContext(): void {
    this.globalContext = {};
  }

  setTransports(transports: Transport[]): void {
    this.transports = transports.length ? transports : [consoleTransport];
  }

  addTransport(transport: Transport): void {
    this.transports.push(transport);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("debug", message, undefined, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, undefined, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, undefined, context);
  }

  error(
    message: string,
    err?: unknown,
    context?: Record<string, unknown>,
  ): void {
    this.log("error", message, err, context);
  }

  private shouldLog(level: Exclude<LogLevel, "silent">): boolean {
    return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[this.level];
  }

  private log(
    level: Exclude<LogLevel, "silent">,
    message: string,
    err?: unknown,
    context?: Record<string, unknown>,
  ): void {
    try {
      if (!this.shouldLog(level)) {
        return;
      }

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
      };

      const mergedContext = {
        ...this.globalContext,
        ...context,
      };

      if (Object.keys(mergedContext).length > 0) {
        entry.context = mergedContext;
      }

      if (err !== undefined) {
        const serialized = serializeError(err);

        if (serialized && typeof serialized === "object") {
          entry.error = serialized as SerializedError;
        } else {
          entry.error = {
            name: "NonError",
            message: String(serialized),
          };
        }
      }

      for (const transport of this.transports) {
        try {
          transport(entry);
        } catch {
          try {
            console.log(
              safeStringify({
                ...entry,
                transportError: true,
              }),
            );
          } catch {
            // Ignore transport failures.
          }
        }
      }
    } catch {
      try {
        console.log(`[logger:${level}]`, message);
      } catch {
        // Ignore logger failures.
      }
    }
  }
}

export const logger = new Logger();

export default logger;
