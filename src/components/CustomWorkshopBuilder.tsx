import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LEVEL_LABEL,
  TRACK_LABEL,
  TRACK_ORDER,
  workshops,
  type WorkshopLevel,
  type WorkshopTrack,
} from "@/lib/workshops";
import { FORMSPREE_FORM_ID } from "@/lib/links";
import { Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CUSTOM_TOPIC_VALUE = "__custom";

/**
 * Modal for requesting a custom private workshop. Submits to Formspree
 * with structured fields + a synthesized human-readable message body.
 */
const CustomWorkshopBuilder = ({ open, onOpenChange }: Props) => {
  const [workshopChoice, setWorkshopChoice] = useState<string>(CUSTOM_TOPIC_VALUE);
  const [customTopic, setCustomTopic] = useState("");
  const [attendees, setAttendees] = useState<number>(6);
  const [level, setLevel] = useState<WorkshopLevel | null>(null);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  const isCustom = workshopChoice === CUSTOM_TOPIC_VALUE;
  const selectedWorkshop = workshops.find((w) => w.slug === workshopChoice);

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    (!isCustom || customTopic.trim().length > 0) &&
    attendees >= 3 &&
    status !== "submitting";

  const reset = () => {
    setWorkshopChoice(CUSTOM_TOPIC_VALUE);
    setCustomTopic("");
    setAttendees(6);
    setLevel(null);
    setNotes("");
    setName("");
    setEmail("");
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    if (website) {
      // honeypot tripped — pretend success
      setStatus("success");
      return;
    }

    const topicLabel = isCustom
      ? `Custom: ${customTopic}`
      : `${selectedWorkshop!.title} (${TRACK_LABEL[selectedWorkshop!.track]})`;

    const levelLabel = level ? `L${level} ${LEVEL_LABEL[level]}` : "Not specified";

    const message = [
      `Custom workshop request`,
      ``,
      `Workshop: ${topicLabel}`,
      `Attendees: ${attendees}`,
      `Level: ${levelLabel}`,
      ``,
      notes ? `Notes:\n${notes}` : `Notes: (none)`,
    ].join("\n");

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          topic: "Custom workshop request",
          workshop: topicLabel,
          attendees,
          level: levelLabel,
          message,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading">
            <Sparkles className="h-5 w-5 text-brand-teal" />
            Custom workshop for your team
          </DialogTitle>
          <DialogDescription>
            Private session for your group. Pick a topic, size, and level — we'll come back
            with a date and a quote.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-semibold text-primary text-lg mb-2">
              Request sent
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Dave will reach out within a couple of business days with available dates
              and a quote.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Workshop topic */}
            <div>
              <label htmlFor="cw-topic" className="block text-sm font-medium text-primary mb-2">
                Topic
              </label>
              <select
                id="cw-topic"
                value={workshopChoice}
                onChange={(e) => setWorkshopChoice(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors"
              >
                <option value={CUSTOM_TOPIC_VALUE}>Something else (describe below)</option>
                {TRACK_ORDER.map((track) => {
                  const tracked = workshops.filter((w) => w.track === track);
                  if (tracked.length === 0) return null;
                  return (
                    <optgroup key={track} label={TRACK_LABEL[track]}>
                      {tracked.map((w) => (
                        <option key={w.slug} value={w.slug}>
                          {w.title}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            {isCustom && (
              <div>
                <label htmlFor="cw-custom" className="block text-sm font-medium text-primary mb-2">
                  Describe the topic
                </label>
                <input
                  id="cw-custom"
                  type="text"
                  required
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. RAG for legal documents, AI-assisted product strategy"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors"
                />
              </div>
            )}

            {/* Attendees */}
            <div>
              <label htmlFor="cw-attendees" className="block text-sm font-medium text-primary mb-2">
                How many people?
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  Min 3, max 15
                </span>
              </label>
              <input
                id="cw-attendees"
                type="number"
                min={3}
                max={15}
                value={attendees}
                onChange={(e) => setAttendees(Math.max(3, Math.min(15, Number(e.target.value))))}
                className="w-32 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Group level
                <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {([1, 2, 3, 4, 5] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setLevel(level === n ? null : n)}
                    className={`px-2 py-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                      level === n
                        ? "border-brand-teal bg-brand-teal/5 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-brand-teal/40 hover:text-primary"
                    }`}
                  >
                    <span className="font-semibold">L{n}</span>
                    <span className="text-[10px]">{LEVEL_LABEL[n]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="cw-notes" className="block text-sm font-medium text-primary mb-2">
                Notes
                <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="cw-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Timing preferences, specific outcomes you want, anything else worth knowing."
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors resize-none"
              />
            </div>

            {/* Name + email */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="cw-name" className="block text-sm font-medium text-primary mb-2">
                  Your name
                </label>
                <input
                  id="cw-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors"
                />
              </div>
              <div>
                <label htmlFor="cw-email" className="block text-sm font-medium text-primary mb-2">
                  Email
                </label>
                <input
                  id="cw-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors"
                />
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Something went wrong. Try again in a moment.</span>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="bg-brand-teal hover:bg-brand-teal-light text-white"
              >
                {status === "submitting" ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send request
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomWorkshopBuilder;
