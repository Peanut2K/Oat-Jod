"use client";
import { useEffect } from "react";

export default function ErrorLogger() {
  useEffect(() => {
    const KEY = "oat_jod_client_errors";

    const push = (msg: string) => {
      try {
        const raw = localStorage.getItem(KEY) || "[]";
        const arr = JSON.parse(raw);
        arr.push({ ts: Date.now(), msg });
        // keep last 100 entries
        localStorage.setItem(KEY, JSON.stringify(arr.slice(-100)));
      } catch (e) {
        // ignore
      }
    };

    const onError = (e: ErrorEvent) => push(`error: ${e.message} @${e.filename}:${e.lineno}`);
    const onRejection = (e: PromiseRejectionEvent) => push(`rejection: ${String(e.reason)}`);

    const origConsoleError = console.error;
    console.error = (...args: any[]) => {
      try {
        push(`console.error: ${args.map((a) => (a && a.stack) || String(a)).join(" ")}`);
      } catch {}
      origConsoleError.apply(console, args);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      console.error = origConsoleError;
    };
  }, []);

  return null;
}
