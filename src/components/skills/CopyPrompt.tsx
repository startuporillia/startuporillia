import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyPrompt({ text }: { text: string }) {
  const [status, setStatus] = useState("Copy prompt");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      setStatus("Could not copy. Select the text above.");
    }
    timer.current = setTimeout(() => setStatus("Copy prompt"), 3000);
  }
  return <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
    {status === "Copied" ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
    <span aria-live="polite">{status}</span>
  </button>;
}
