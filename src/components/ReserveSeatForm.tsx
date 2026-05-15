import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, AlertCircle } from "lucide-react";

interface Props {
  workshopSlug: string;
  lumaUrl: string;
  /** Brand accent: scheduled = orange, sold-out (waitlist) = primary. */
  accent?: "orange" | "primary";
  buttonLabel?: string;
}

type Status = "idle" | "submitting" | "error";

/**
 * Compact two-field form (name + email) shown on scheduled workshops.
 * Records site-side reservation intent in Neon, then redirects to Luma
 * for the actual payment/ticketing flow.
 *
 * Falls back to a direct Luma link if the registration POST fails — we
 * never block someone from reaching the ticket page.
 */
const ReserveSeatForm = ({
  workshopSlug,
  lumaUrl,
  accent = "orange",
  buttonLabel = "Reserve my seat",
}: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  const canSubmit =
    name.trim().length > 0 && email.trim().length > 0 && status !== "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    try {
      // Fire-and-forget log — if it fails, still let the user through to Luma
      await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workshop_slug: workshopSlug,
          name,
          email,
          source: "site_click",
          website,
        }),
      });
    } catch {
      // ignore — we'll still redirect
    }

    // Always redirect to Luma so the user reaches the ticket page
    window.open(lumaUrl, "_blank", "noopener,noreferrer");
    setStatus("idle");
  };

  const buttonClass =
    accent === "orange"
      ? "bg-brand-orange hover:bg-brand-orange-light text-white"
      : "bg-primary hover:bg-primary/90 text-primary-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors"
        />
      </div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-muted-foreground">
          Click below to confirm payment on Luma. Opens in a new tab.
        </p>
        <Button type="submit" disabled={!canSubmit} size="lg" className={buttonClass}>
          {status === "submitting" ? (
            "..."
          ) : (
            <>
              {buttonLabel}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {status === "error" && (
        <div className="flex items-start gap-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <span>Couldn't record your reservation, but Luma is still available.</span>
        </div>
      )}
    </form>
  );
};

export default ReserveSeatForm;
