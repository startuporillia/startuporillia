import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { FORMSPREE_FORM_ID } from "@/lib/links";
import { EXPERTISE_AREAS, type ExpertiseArea } from "@/lib/expert-network";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors";

const Field = ({
  id,
  label,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-primary mb-2">
      {label}
      {optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
  </div>
);

/**
 * Expert Network application. Submits to Formspree (same form as Contact) — these are
 * a handful of applications a human reads, not data to aggregate. The message body is
 * synthesized so it reads cleanly as an email.
 */
const ExpertApplicationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [localConnection, setLocalConnection] = useState("");
  const [areas, setAreas] = useState<ExpertiseArea[]>([]);
  const [years, setYears] = useState("");
  const [shipped, setShipped] = useState("");
  const [hireFor, setHireFor] = useState("");
  const [projectTypes, setProjectTypes] = useState("");
  const [engagement, setEngagement] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  const toggleArea = (a: ExpertiseArea) =>
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const canSubmit =
    name.trim() &&
    email.trim() &&
    localConnection.trim() &&
    areas.length > 0 &&
    years.trim() &&
    shipped.trim() &&
    hireFor.trim() &&
    status !== "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    if (website) {
      setStatus("success");
      return;
    }

    const message = [
      `Expert Network application from ${name}`,
      "",
      `LinkedIn / portfolio: ${link || "—"}`,
      `Local connection: ${localConnection}`,
      `Expertise: ${areas.join(", ")}`,
      `Years of hands-on experience: ${years}`,
      "",
      "Something they've delivered:",
      shipped,
      "",
      "What a business can hire them for:",
      hireFor,
      "",
      "Projects they're interested in:",
      projectTypes || "—",
      "",
      `Typical engagement size / rate: ${engagement || "—"}`,
    ].join("\n");

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          topic: "Expert Network application",
          link,
          localConnection,
          expertise: areas.join(", "),
          years,
          shipped,
          hireFor,
          projectTypes,
          engagement,
          message,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-heading font-semibold text-primary mb-3">Application received</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thanks. Dave reads every application personally and will be in touch within a week or so.
          If you're shortlisted, the next step is a short conversation.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-5"
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

      <div className="grid sm:grid-cols-2 gap-5">
        <Field id="en-name" label="Name">
          <input id="en-name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
        </Field>
        <Field id="en-email" label="Email">
          <input id="en-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
        </Field>
      </div>

      <Field id="en-link" label="LinkedIn or portfolio" optional>
        <input id="en-link" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" className={inputClass} />
      </Field>

      <Field id="en-local" label="Your connection to Orillia" hint="Live here, work here, grew up here, cottage nearby — whatever it is.">
        <input id="en-local" required value={localConnection} onChange={(e) => setLocalConnection(e.target.value)} placeholder="e.g. Live in Orillia, work remotely for a Toronto company" className={inputClass} />
      </Field>

      <div>
        <p className="block text-sm font-medium text-primary mb-2">Areas of expertise</p>
        <div className="flex flex-wrap gap-2">
          {EXPERTISE_AREAS.map(({ name: a }) => {
            const on = areas.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleArea(a)}
                aria-pressed={on}
                className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                  on
                    ? "border-brand-teal bg-brand-teal/10 text-primary font-medium"
                    : "border-border bg-background text-muted-foreground hover:border-brand-teal/40 hover:text-primary"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <Field id="en-years" label="Years of hands-on experience">
        <input id="en-years" required inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 8" className={`${inputClass} w-32`} />
      </Field>

      <Field id="en-shipped" label="Something you've delivered" hint="One thing you built, launched or turned around, and your role in it. A link is great.">
        <textarea id="en-shipped" required rows={3} value={shipped} onChange={(e) => setShipped(e.target.value)} className={inputClass} />
      </Field>

      <Field id="en-hire" label="What can a business realistically hire you to help with?" hint="Be concrete — this is how we'll know when to think of you.">
        <textarea id="en-hire" required rows={3} value={hireFor} onChange={(e) => setHireFor(e.target.value)} placeholder="e.g. Fixing a messy sales pipeline, automating a manual process, launching a new digital product, CRM implementation" className={inputClass} />
      </Field>

      <Field id="en-projects" label="What types of projects are you interested in?" optional>
        <textarea id="en-projects" rows={2} value={projectTypes} onChange={(e) => setProjectTypes(e.target.value)} placeholder="e.g. Short advisory calls, 2-6 week builds, ongoing retainers" className={inputClass} />
      </Field>

      <Field id="en-engagement" label="Typical engagement size or rate range" optional>
        <input id="en-engagement" value={engagement} onChange={(e) => setEngagement(e.target.value)} placeholder="e.g. $5-20K projects, or $150/hr" className={inputClass} />
      </Field>

      {status === "error" && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Something went wrong sending that. Try again, or email dave@startuporillia.ca directly.</span>
        </div>
      )}

      <div className="pt-1">
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          className="bg-brand-teal hover:bg-brand-teal-light text-white w-full sm:w-auto"
        >
          <Send className="mr-2 h-4 w-4" />
          {status === "submitting" ? "Sending…" : "Submit application"}
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Free to apply. Nothing is charged unless you're accepted and choose to join.
        </p>
      </div>
    </form>
  );
};

export default ExpertApplicationForm;
