import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertCircle } from "lucide-react";
import { FORMSPREE_FORM_ID } from "@/lib/links";

interface Props {
  workshopSlug: string;
  workshopTitle: string;
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Single-field opt-in for unscheduled workshops.
 *
 * Submits straight to Formspree — each notify-me request lands in Dave's
 * inbox tagged with the workshop title and slug, ready to filter on later.
 *
 * The Neon-backed `/api/interest` endpoint + `npm run announce` script are
 * still in place but currently unused; switch back when notify-me volume
 * justifies aggregation queries.
 */
const WorkshopInterestForm = ({ workshopSlug, workshopTitle }: Props) => {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  const canSubmit = email.trim().length > 0 && status !== "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    if (website) {
      // honeypot tripped — pretend success, don't submit
      setStatus("success");
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          topic: "Notify me",
          workshop: workshopTitle,
          workshop_slug: workshopSlug,
          message: `Notify request for "${workshopTitle}" (${workshopSlug}).`,
          _subject: `Notify me: ${workshopTitle}`,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          You're on the list for{" "}
          <span className="font-medium text-primary">{workshopTitle}</span>. We'll
          email the moment a date is set.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute left-[-9999px] w-px h-px opacity-0"
        aria-hidden
      />

      <div className="flex items-center gap-2 mb-3">
        <Bell className="h-4 w-4 text-brand-teal" />
        <p className="text-sm font-medium text-primary">Notify me when this is scheduled</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors"
        />
        <Button
          type="submit"
          disabled={!canSubmit}
          className="bg-brand-teal hover:bg-brand-teal-light text-white"
        >
          {status === "submitting" ? "Sending..." : "Notify me"}
        </Button>
      </div>

      {status === "error" && (
        <div className="mt-3 flex items-start gap-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <span>Something went wrong. Try again in a moment.</span>
        </div>
      )}
    </form>
  );
};

export default WorkshopInterestForm;
