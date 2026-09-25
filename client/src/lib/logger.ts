/**
 * logger.ts
 * -----------------------------------------------------------------------
 * A scalable, crash-proof JSON logger for React Native (and any JS/TS app).
 *
 * Features
 *  - Levels: debug, info, warn, error (+ optional "silent" to disable all)
 *  - Every log line is a single JSON object (easy to ship to Sentry,
 *    Datadog, Logstash, a file, etc.)
 *  - Error objects (including nested `cause`) are safely serialized with
 *    their stack trace — never just "[object Object]"
 *  - Circular references / non-serializable values never throw
 *  - Logging itself NEVER throws or crashes the app — any internal failure
 *    is swallowed and, at worst, falls back to a plain console.log
 *  - Global + per-call context (userId, screen, requestId, etc.)
 *  - Pluggable transports (console by default, add remote/file transports)
 *  - Runtime-configurable minimum level (e.g. lower verbosity in prod)
 *  - Optional caller info via stack-trace parsing — off by default because
 *    it's unreliable in bundled Hermes builds (see notes near getCallSite);
 *    just prefix your message string (e.g. "[API] Response") instead
 *
 * Usage
 * -----------------------------------------------------------------------
 *  import { logger } from "./logger";
 *
 *  logger.debug("Fetching user", { userId: 42 });
 *  logger.info("User loaded", { userId: 42, ms: 120 });
 *  logger.warn("Falling back to cache", { reason: "timeout" });
 *
 *  try {
 *    doSomethingRisky();
 *  } catch (err) {
 *    logger.error("Failed to do risky thing", err, { userId: 42 });
 *  }
 *
 *  // Add global context once (e.g. after login)
 *  logger.setContext({ userId: 42, appVersion: "1.4.0" });
 *
 *  // Add a custom transport (e.g. send errors to a remote service)
 *  logger.addTransport((entry) => {
 *    if (entry.level === "error") sendToSentry(entry);
 *  });
 *
 *  // Silence debug logs in production
 *  logger.setLevel(__DEV__ ? "debug" : "warn");
 *
 *  // Caller info is off by default — see the note above INTERNAL_FRAME_PATTERN
 *  // for why it's unreliable in a bundled RN app. Just tag the message
 *  // yourself instead, e.g. logger.debug("[SummaryCard] Rendered", { title });
 * -----------------------------------------------------------------------
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

export interface LogEntry {
  timestamp: string;
  level: Exclude<LogLevel, "silent">;
  message: string;
  context?: Record<string, unknown>;
  error?: SerializedError;
  caller?: CallSite;
  [key: string]: unknown;
}

export interface CallSite {
  file?: string;
  function?: string;
  line?: number;
  column?: number;
}

export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
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

/**
 * JSON.stringify replacer that survives circular references and
 * non-serializable values (functions, symbols, BigInt) instead of throwing.
 */
function safeReplacer() {
  const seen = new WeakSet();
  return (_key: string, value: unknown) => {
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "function")
      return `[Function: ${value.name || "anonymous"}]`;
    if (typeof value === "symbol") return value.toString();
    if (value instanceof Map) return Object.fromEntries(value);
    if (value instanceof Set) return Array.from(value);
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    return value;
  };
}

function safeStringify(value: unknown, pretty = false): string {
  try {
    return JSON.stringify(value, safeReplacer(), pretty ? 2 : undefined);
  } catch {
    try {
      return String(value);
    } catch {
      return "[Unserializable value]";
    }
  }
}

/** Turns any thrown value (Error, string, object, ...) into a plain JSON-safe shape. */
function serializeError(err: unknown, depth = 0): SerializedError | unknown {
  if (depth > 5) return "[Max error depth reached]";

  if (err instanceof Error) {
    const base: SerializedError = {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
    // Preserve any extra enumerable props (e.g. `err.code`, `err.statusCode`)
    for (const key of Object.keys(err)) {
      if (!(key in base)) {
        (base as Record<string, unknown>)[key] = (
          err as unknown as Record<string, unknown>
        )[key];
      }
    }
    const cause = (err as { cause?: unknown }).cause;
    if (cause !== undefined) {
      base.cause = serializeError(cause, depth + 1);
    }
    return base;
  }

  if (typeof err === "string") {
    return { name: "Error", message: err };
  }

  if (err && typeof err === "object") {
    // Plain object thrown as an "error" — keep it, but mark it clearly.
    return { name: "NonError", message: safeStringify(err) };
  }

  return { name: "NonError", message: String(err) };
}

// Frames belonging to the logger itself — skipped when walking the stack
// so we land on the code that actually called logger.debug/info/warn/error.
//
// NOTE: this only produces useful results in an *unbundled* dev environment
// (plain Node, Jest, a debugger with source maps loaded). In a Metro/Hermes
// RN bundle the whole app is compiled into one function table, so class
// methods collapse to generic names like "log" and the "file" in the stack
// frame is the entire bundle request URL, not your source file — there's no
// way to recover real file/line without an async round-trip to Metro's
// symbolicate endpoint, which isn't worth doing per log call. Because of
// that this is opt-in and off by default; prefer createLogger(namespace)
// below for "where did this log come from" in an RN app.
const INTERNAL_FRAME_PATTERN =
  /at\s+(Logger\.(debug|info|warn|error|log)|getCallSite)\b|getCallSite@|Logger\.(debug|info|warn|error|log)@/;

function parseStackLine(line: string): CallSite | undefined {
  // V8 / Hermes (dev): "at functionName (file:line:col)"
  let match = line.match(/^at\s+(.*?)\s+\((.*):(\d+):(\d+)\)$/);
  if (match) {
    return {
      function: match[1],
      file: shortenFile(match[2]),
      line: Number(match[3]),
      column: Number(match[4]),
    };
  }
  // V8 / Hermes: "at file:line:col" (anonymous frame)
  match = line.match(/^at\s+(.*):(\d+):(\d+)$/);
  if (match) {
    return {
      function: "<anonymous>",
      file: shortenFile(match[1]),
      line: Number(match[2]),
      column: Number(match[3]),
    };
  }
  // JavaScriptCore style: "functionName@file:line:col"
  match = line.match(/^(.*)@(.*):(\d+):(\d+)$/);
  if (match) {
    return {
      function: match[1] || "<anonymous>",
      file: shortenFile(match[2]),
      line: Number(match[3]),
      column: Number(match[4]),
    };
  }
  return undefined;
}

/** Trims a long bundler path down to the last couple of segments for readability. */
function shortenFile(file: string): string {
  const clean = file.split("?")[0]; // strip Metro's query params
  const parts = clean.split("/").filter(Boolean);
  return parts.slice(-2).join("/");
}

/** Walks a fresh stack trace to find the first frame outside of logger.ts itself. */
function getCallSite(): CallSite | undefined {
  try {
    const stack = new Error().stack;
    if (!stack) return undefined;

    const lines = stack.split("\n").slice(1); // drop the leading "Error" line
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || INTERNAL_FRAME_PATTERN.test(line)) continue;
      const parsed = parseStackLine(line);
      if (parsed) return parsed;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

const consoleTransport: Transport = (entry) => {
  const line = safeStringify(entry); // compact single-line JSON — best for log aggregators
  switch (entry.level) {
    case "debug":
      console.debug(line);
      break;
    case "info":
      console.info(line);
      break;
    case "warn":
      console.warn(line);
      break;
    case "error":
      console.error(line);
      break;
  }
};

// ANSI colors for the level tag. These render correctly in the Metro/RN
// packager terminal (a real TTY), but will show as raw escape codes in
// non-TTY viewers like `adb logcat` or some CI log viewers — harmless there,
// just not pretty. If that's your primary log surface, use consoleTransport
// instead, or strip colors with a NO_COLOR-style env check.
const LEVEL_COLOR: Record<Exclude<LogLevel, "silent">, string> = {
  debug: "\x1b[90m", // gray
  info: "\x1b[36m", // cyan
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
};
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

/**
 * Dev-friendly transport: colored level tag + pretty-printed (indented) JSON,
 * so each field is on its own line and easy to scan in a terminal. Still
 * valid JSON underneath — only the whitespace differs from consoleTransport.
 */
const prettyConsoleTransport: Transport = (entry) => {
  const color = LEVEL_COLOR[entry.level];
  const tag = `${color}${BOLD}${entry.level.toUpperCase()}${RESET}`;
  const body = safeStringify(entry, /* pretty */ true);
  const line = `${tag} ${body}`;
  switch (entry.level) {
    case "debug":
      console.debug(line);
      break;
    case "info":
      console.info(line);
      break;
    case "warn":
      console.warn(line);
      break;
    case "error":
      console.error(line);
      break;
  }
};

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

class Logger {
  private level: LogLevel = "debug";
  private globalContext: Record<string, unknown> = {};
  private transports: Transport[] = [
    isDev ? prettyConsoleTransport : consoleTransport,
  ];
  // Off by default — see the note above INTERNAL_FRAME_PATTERN. In a bundled
  // Hermes app this produces the same fake location for every call, which is
  // worse than no location at all. Prefer createLogger(namespace) instead.
  private captureCallsite = false;

  /** Toggle capturing {file, function, line} of the calling code on each log entry. */
  setCaptureCallsite(enabled: boolean): void {
    this.captureCallsite = enabled;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  /** Merge in context applied to every subsequent log call (e.g. userId). */
  setContext(context: Record<string, unknown>): void {
    try {
      this.globalContext = { ...this.globalContext, ...context };
    } catch {
      // never let context tracking break the app
    }
  }

  clearContext(): void {
    this.globalContext = {};
  }

  /** Replace the transport list entirely. */
  setTransports(transports: Transport[]): void {
    this.transports = transports.length ? transports : [consoleTransport];
  }

  /** Add an additional transport (e.g. remote logging, file, crash reporter). */
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

  /** `error` accepts an optional Error/unknown as the 2nd arg, context as the 3rd. */
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
    // Logging must NEVER throw — wrap everything.
    try {
      if (!this.shouldLog(level)) return;

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message: typeof message === "string" ? message : safeStringify(message),
      };

      const mergedContext = { ...this.globalContext, ...context };
      if (Object.keys(mergedContext).length > 0) {
        entry.context = mergedContext;
      }

      if (err !== undefined) {
        entry.error = serializeError(err) as SerializedError;
      }

      if (this.captureCallsite) {
        const caller = getCallSite();
        if (caller) entry.caller = caller;
      }

      for (const transport of this.transports) {
        try {
          transport(entry);
        } catch {
          // one bad transport should never take down the others,
          // or the app. Fall back to a minimal console write.
          try {
            console.log(safeStringify({ ...entry, transportError: true }));
          } catch {
            /* truly give up silently */
          }
        }
      }
    } catch {
      // Absolute last resort — logging itself must never crash the app.
      try {
        console.log(`[logger:${level}]`, message);
      } catch {
        /* noop */
      }
    }
  }
}

export const logger = new Logger();
export default logger;
