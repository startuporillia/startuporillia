import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Send, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

const FORMSPREE_FORM_ID = "xvzlwpbw";

const TOPICS = [
  { value: "workshop", label: "Pitch a workshop" },
  { value: "group", label: "Group rate" },
  { value: "partner", label: "Partner event" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "general", label: "General question" },
] as const;

type TopicValue = (typeof TOPICS)[number]["value"];

const isValidTopic = (v: string): v is TopicValue =>
  TOPICS.some((t) => t.value === v);

type Status = "idle" | "submitting" | "success" | "error";

const buildPrefilledMessage = (topic: TopicValue, workshop: string): string => {
  if (topic === "workshop") {
    return `I'd like to pitch the "${workshop}" workshop.\n\nA bit about me and how I'd run it:\n\n`;
  }
  if (topic === "group") {
    return `I'd like to bring a group to the "${workshop}" workshop.\n\nGroup size:\n\nScheduling preferences:\n\nAnything else worth knowing:\n\n`;
  }
  return "";
};

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get("topic");
  const initialWorkshop = searchParams.get("workshop");

  const resolvedTopic: TopicValue =
    initialTopic && isValidTopic(initialTopic) ? initialTopic : "general";
  const [topic, setTopic] = useState<TopicValue>(resolvedTopic);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    initialWorkshop ? buildPrefilledMessage(resolvedTopic, initialWorkshop) : ""
  );
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (initialTopic && isValidTopic(initialTopic)) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (initialWorkshop && initialTopic && isValidTopic(initialTopic)) {
      setMessage((prev) => (prev ? prev : buildPrefilledMessage(initialTopic, initialWorkshop)));
    }
  }, [initialWorkshop, initialTopic]);

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.trim().length > 0 &&
    status !== "submitting";

  const topicLabel = TOPICS.find((t) => t.value === topic)?.label ?? topic;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    if (honeypot) {
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
          name,
          email,
          topic: topicLabel,
          message,
        }),
      });

      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-4">
              <Mail className="h-3.5 w-3.5" />
              Contact
            </span>
            <h1 className="text-primary mb-5">Get in touch.</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Pitch a workshop, propose a partner event, ask about sponsorship, or just say hi.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {status === "success" ? (
            <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-3">
                Got it. Thanks!
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Dave will get back to you within a couple of days. In the meantime, the WhatsApp group is the fastest way to plug in.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back home
                  </Link>
                </Button>
                <Button asChild className="bg-brand-teal hover:bg-brand-teal-light text-white">
                  <a
                    href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Join WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-6"
            >
              {/* Honeypot — bots will fill this; humans won't see it */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute left-[-9999px] w-px h-px opacity-0"
                aria-hidden
              />

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-primary mb-3">
                  What's this about?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTopic(t.value)}
                      className={`px-4 py-3 text-sm font-medium rounded-xl border transition-all text-left ${
                        topic === t.value
                          ? "border-brand-orange bg-brand-orange/5 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-brand-orange/40 hover:text-primary"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder={
                    topic === "workshop"
                      ? "What would you teach? Format, audience, anything else relevant."
                      : topic === "group"
                      ? "Group size, scheduling preferences, anything else worth knowing."
                      : topic === "partner"
                      ? "Tell us about the event and how it fits the community."
                      : topic === "sponsorship"
                      ? "How would you like to support the community?"
                      : "How can we help?"
                  }
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors resize-none"
                />
              </div>

              {status === "error" && (
                <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Something went wrong. Try again or email{" "}
                    <a href="mailto:dave@startuporillia.ca" className="underline">
                      dave@startuporillia.ca
                    </a>
                    .
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-xs text-muted-foreground">
                  Or message Dave on{" "}
                  <a
                    href="https://www.linkedin.com/in/davecap/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary transition-colors"
                  >
                    LinkedIn
                  </a>
                  .
                </p>
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="bg-brand-orange hover:bg-brand-orange-light text-white"
                >
                  {status === "submitting" ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
