import { useEffect, useRef, useState } from "react";

export default function McpUrlBox({ url }: { url: string }) {
  const [status, setStatus] = useState("Copy");
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timeout.current), []);
  const copy = async () => {
    clearTimeout(timeout.current);
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Copied");
    } catch {
      setStatus("Unable to copy");
    }
    timeout.current = setTimeout(() => setStatus("Copy"), 2500);
  };
  return <button type="button" onClick={copy} aria-label="Copy MCP URL" className="w-full text-left rounded-xl bg-primary text-primary-foreground p-4 font-mono text-sm break-all flex items-center justify-between gap-3 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"><code>{url}</code><span aria-live="polite" className="text-xs px-2 py-1 rounded bg-white/10 shrink-0">{status}</span></button>;
}
