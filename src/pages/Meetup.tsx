import {
  Calendar,
  Clock,
  MapPin,
  Coffee,
  Users,
  Wallet,
  Mic,
  Youtube,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  Timer,
  Wrench,
  Target,
  Ban,
  MessagesSquare,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddToCalendarButton from "@/components/AddToCalendarButton";
import { getNextMeetup } from "../lib/events";
import { WHATSAPP_GROUP_URL, YOUTUBE_CHANNEL_URL } from "../lib/links";

/* -------------------------------------------------------------------------- */
/*  Static facts about the recurring meetup                                    */
/* -------------------------------------------------------------------------- */

const FACTS = [
  {
    icon: Calendar,
    label: "When",
    value: "Last Tuesday of every month",
    sub: "9:00 AM – 1:00 PM Eastern",
  },
  {
    icon: MapPin,
    label: "Where",
    value: "Creative Nomad Studios",
    sub: "23 Mississaga St W, Orillia, ON",
  },
  {
    icon: Wallet,
    label: "Cost",
    value: "Free",
    sub: "Supported by the City of Orillia & Creative Nomad Studios",
  },
  {
    icon: Users,
    label: "Who's welcome",
    value: "Anyone building something",
    sub: "Founders, freelancers, makers, students, and the curious",
  },
];

const WHAT_YOU_DO = [
  {
    icon: Coffee,
    title: "Coffee & coworking",
    body: "Bring your laptop and work alongside other builders for the morning. Same room, real momentum.",
  },
  {
    icon: MessagesSquare,
    title: "Conversation",
    body: "Meet people, get unstuck, trade ideas, and find collaborators. The hallway chat is half the point.",
  },
  {
    icon: Mic,
    title: "Mini talks",
    body: "A handful of people share something practical for 5–10 minutes — optionally recorded for our YouTube channel.",
  },
];

/* Talk guideline rows */
const TALK_RULES = [
  {
    icon: Timer,
    label: "5–10 minutes, max",
    body: "Keep it tight — please don't go over. Leave a couple of minutes at the end for questions if time allows.",
  },
  {
    icon: Wrench,
    label: "Something you actually did",
    body: "Focus on something practical and recent. A problem you solved, a tool that saved you time, an experiment that worked (or failed).",
  },
  {
    icon: Target,
    label: "Keep it concrete",
    body: "Show examples, demos, screenshots, or before/after results whenever you can. Specific beats abstract.",
  },
  {
    icon: Ban,
    label: "No sales pitches",
    body: "The goal is to teach the group something useful — not to sell. That's the one hard rule.",
  },
];

const GOOD_TOPICS = [
  "A problem you solved and how you solved it.",
  "A challenging problem you're working on now and how you're thinking about it — invite discussion if you'd like feedback.",
  "A tool, workflow, or technique that saved you time.",
  "A lesson from building, launching, selling, or running your business.",
  "An interesting experiment that worked (or failed) and what you learned.",
  "A useful AI workflow, automation, or piece of software you've started using.",
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const MeetupPage = () => {
  const next = getNextMeetup();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-4">
              <Coffee className="h-3.5 w-3.5" />
              Monthly Meetup
            </span>
            <h1 className="text-primary mb-5">
              Coworking Day, the last Tuesday of every month.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              A free, in-person morning of coffee, coworking, and conversation for the people building
              interesting things in and around Orillia. Show up, work alongside others, and make progress
              on whatever you're shipping. No agenda, no pressure — just good company and momentum.
            </p>

            {/* Next date + CTAs */}
            <div className="flex flex-col items-center gap-5">
              {next && (
                <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-card border border-border/50 rounded-full px-5 py-2.5 shadow-sm">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    <Calendar className="h-4 w-4 text-brand-orange" />
                    Next: {next.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-brand-teal" />
                    {next.time}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white">
                  <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Join the WhatsApp Group
                  </a>
                </Button>
                {next?.startDate && next?.endDate && (
                  <AddToCalendarButton
                    event={{
                      title: next.title,
                      description: next.description,
                      location: next.location,
                      start: next.startDate,
                      end: next.endDate,
                      url:
                        typeof window !== "undefined"
                          ? `${window.location.origin}/meetup`
                          : undefined,
                    }}
                    filename="startup-orillia-coworking-day.ics"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="bg-card border border-border/50 rounded-2xl p-5 flex flex-col"
              >
                <div className="flex items-center gap-2 text-brand-teal mb-3">
                  <fact.icon className="h-5 w-5" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {fact.label}
                  </span>
                </div>
                <p className="font-heading font-semibold text-primary leading-snug">{fact.value}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-snug">{fact.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you do there */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-2">
              What actually happens
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              It's low-key by design. Come for an hour or stay the whole morning — whatever fits your day.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {WHAT_YOU_DO.map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-brand-orange" />
                </div>
                <h3 className="font-heading font-semibold text-primary text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini talks */}
      <section className="bg-secondary/30 border-y border-border/40">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-start">
              {/* Intro column */}
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-4">
                  <Mic className="h-3.5 w-3.5" />
                  New: Mini talks
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-4">
                  Got something worth sharing? Take the mic.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Each meetup, a few people get up and give a short talk about something
                  practical they've been working on. It's a great way to teach what you know, get
                  feedback on a hard problem, or just meet people working on similar things.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Talks are essentially <strong className="text-primary font-medium">walk-in</strong> — but
                  please prepare ahead of time and mention your topic in the{" "}
                  <a
                    href={WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-teal hover:text-brand-teal-light underline underline-offset-2 font-medium"
                  >
                    WhatsApp group
                  </a>{" "}
                  before the event so we know who wants to speak. Talks can optionally be recorded for
                  our YouTube channel.
                </p>
                <Button asChild className="bg-brand-teal hover:bg-brand-teal-light text-white">
                  <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Claim a talk in WhatsApp
                  </a>
                </Button>
              </div>

              {/* Guidelines column */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-heading font-semibold text-primary text-lg mb-5">
                  Talk guidelines
                </h3>
                <ul className="space-y-5">
                  {TALK_RULES.map((rule) => (
                    <li key={rule.label} className="flex gap-3.5">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                        <rule.icon className="h-4 w-4 text-brand-orange" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-primary leading-snug">{rule.label}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                          {rule.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Good topics */}
                <div className="mt-7 pt-6 border-t border-border/40">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-brand-teal" />
                    <p className="text-sm font-medium text-primary uppercase tracking-wide">
                      Good topics include
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {GOOD_TOPICS.map((topic) => (
                      <li key={topic} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-teal/60 flex-shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Pull quote */}
            <blockquote className="mt-12 max-w-3xl mx-auto text-center">
              <p className="text-lg md:text-xl font-heading text-primary leading-relaxed">
                The best talks answer:{" "}
                <span className="text-brand-orange">
                  "Here's something I did recently that made me think — everyone else should know about
                  this."
                </span>
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* YouTube */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <Youtube className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-semibold text-primary mb-3">
              Watch the talks on YouTube
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our channel is brand new — recorded mini talks land here after each meetup. Subscribe to
              catch them, and revisit the ones you want to steal ideas from.
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-500 text-white">
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                <Youtube className="mr-2 h-4 w-4" />
                Visit our YouTube channel
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-brand-cream to-background border border-border/50 rounded-2xl p-8 md:p-10 text-center">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-primary mb-3">
            Come to the next one
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            No need to sign up — just show up. Joining the WhatsApp group is the best way to get the
            reminder and see who's coming.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white">
              <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Join the WhatsApp Group
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border bg-card">
              <Link to="/events">
                See the full calendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeetupPage;
