import { Wrench, Users, Clock, Megaphone, Ticket, MapPin, ArrowRight, Mail, Calendar, MessageCircle, Lightbulb, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { upcomingEvents, EVENT_TYPE_LABEL } from "../lib/events";
import {
  workshopIdeas,
  WORKSHOP_CATEGORY_LABEL,
  WORKSHOP_CATEGORY_ORDER,
  type WorkshopCategory,
} from "../lib/workshopIdeas";

const WorkshopsPage = () => {
  const workshops = upcomingEvents.filter((e) => e.type === "workshop");

  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "10-15 people",
      description: "Small enough that everyone's in the room.",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "1-3 hours",
      description: "Focused sessions. No filler.",
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      title: "Useful, not theoretical",
      description: "You leave with something you can apply that week.",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Modern topics",
      description: "AI adoption, workflows, productivity, growth, product, operations.",
    },
  ];

  const orgPerks = [
    {
      icon: <Megaphone className="h-5 w-5" />,
      title: "Marketing",
      description: "We promote it across the WhatsApp group, the site, and partner channels.",
    },
    {
      icon: <Ticket className="h-5 w-5" />,
      title: "Ticketing",
      description: "We handle signups, payments, and reminders so you don't have to.",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Logistics",
      description: "Venue, setup, and the day-of details. All sorted.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/3" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-4">
              <Wrench className="h-3.5 w-3.5" />
              Workshops
            </span>
            <h1 className="text-primary mb-5">
              Workshops by people who actually do the work.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
              Small-group sessions on AI tools, workflows, productivity, growth, product, operations, and modern ways of working, led by community members who use this stuff every day.
            </p>
            <p className="text-base text-muted-foreground/90 leading-relaxed mb-8">
              For founders, operators, freelancers, small business teams, and curious professionals looking to level up how they work.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild className="bg-brand-orange hover:bg-brand-orange-light text-white" size="lg">
                <Link to="/events">
                  See upcoming workshops
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border bg-card">
                <a href="#run-a-workshop">Run a workshop</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-3">
              What to expect
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Workshops are paid (small fee, keeps people committed), capped at 10-15 attendees, and designed so you walk away with something you can actually use in your work.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-medium text-primary mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming workshops */}
      <section className="container mx-auto px-4 pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary">
              Upcoming workshops
            </h2>
            <span className="text-xs font-medium text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full">
              {workshops.length > 0 ? `${workshops.length} scheduled` : "Coming soon"}
            </span>
          </div>

          {workshops.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
              {workshops.map((w, idx) => (
                <Link
                  key={idx}
                  to="/events"
                  className="group bg-card border border-border/50 rounded-2xl p-6 hover:border-brand-orange/30 hover:shadow-md transition-all"
                >
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-brand-orange/10 text-brand-orange mb-3">
                    {EVENT_TYPE_LABEL[w.type]}
                  </span>
                  <h3 className="font-heading font-semibold text-primary text-lg mb-2 group-hover:text-brand-orange transition-colors">
                    {w.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{w.description}</p>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-orange" />
                    <span>{w.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center">
              <p className="text-muted-foreground mb-5">
                Nothing on the schedule right now. A few are in the works, and we're always looking for new leads.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild size="sm" className="bg-brand-orange hover:bg-brand-orange-light text-white">
                  <a href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-1.5 h-4 w-4" />
                    Get notified via WhatsApp
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/contact?topic=workshop">
                    <Mail className="mr-1.5 h-4 w-4" />
                    Apply to run one
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Run a workshop */}
      <section id="run-a-workshop" className="bg-secondary/30 border-y border-border/40 scroll-mt-24">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-teal uppercase tracking-wider mb-3">
                  <Megaphone className="h-3.5 w-3.5" />
                  For workshop leads
                </span>
                <h2 className="text-primary mb-5 flex items-center gap-2 flex-wrap">
                  <span>Interested in running a workshop?</span>
                  <Link
                    to="/workshops#run-a-workshop"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-card text-muted-foreground hover:bg-brand-teal/10 hover:text-brand-teal transition-colors"
                    aria-label="Copy link to this section"
                    title="Link to this section"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Link>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  If you've got something to teach (AI workflows, founder lessons, product, design, growth, anything builders care about), we'll handle the rest.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  You focus on running a great session. We handle the room, the people, and the logistics.
                </p>
                <Button asChild size="lg" className="bg-brand-teal hover:bg-brand-teal-light text-white">
                  <Link to="/contact?topic=workshop">
                    <Mail className="mr-2 h-4 w-4" />
                    Pitch a workshop
                  </Link>
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Startup Orillia handles
                </p>
                {orgPerks.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 bg-card border border-border/50 rounded-2xl p-5"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-primary mb-1">{p.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workshop ideas */}
            <div id="ideas" className="mt-16 pt-12 border-t border-border/50 scroll-mt-24">
              <div className="max-w-2xl mb-10">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-3">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Workshop ideas
                </span>
                <h2 className="text-primary mb-3 flex items-center gap-2 flex-wrap">
                  <span>Workshops we'd love to see</span>
                  <Link
                    to="/workshops#ideas"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/60 text-muted-foreground hover:bg-brand-orange/10 hover:text-brand-orange transition-colors"
                    aria-label="Copy link to this section"
                    title="Link to this section"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Link>
                </h2>
                <div className="space-y-3 text-base md:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Not sure what kind of workshop to run? These are the kinds of practical, modern sessions people in the community have been asking for.
                  </p>
                  <p>
                    Some are startup-oriented. Others are focused on AI, workflows, productivity, operations, and modern ways of working.
                  </p>
                  <p>
                    If you could lead one of these, or something similar, we'd love to hear from you.
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                {WORKSHOP_CATEGORY_ORDER.map((cat: WorkshopCategory) => {
                  const ideas = workshopIdeas.filter((w) => w.category === cat);
                  if (ideas.length === 0) return null;

                  return (
                    <div key={cat}>
                      <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                        {WORKSHOP_CATEGORY_LABEL[cat]}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {ideas.map((idea) => (
                          <div
                            key={idea.title}
                            className="bg-card border border-border/50 rounded-2xl p-5 flex flex-col hover:border-brand-orange/30 transition-colors"
                          >
                            <h4 className="font-heading font-semibold text-primary text-base mb-2">
                              {idea.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-grow">
                              {idea.description}
                            </p>
                            <p className="text-xs text-muted-foreground/80 mb-4">
                              <span className="font-medium text-primary/70">For:</span> {idea.audience}
                            </p>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="self-start border-brand-orange/40 text-brand-orange hover:bg-brand-orange/5 group"
                            >
                              <Link
                                to={`/contact?topic=workshop&workshop=${encodeURIComponent(idea.title)}`}
                              >
                                Pitch this workshop
                                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Got a different idea? Pitch it.
                </p>
                <Button asChild variant="outline" className="border-brand-teal/40 text-brand-teal hover:bg-brand-teal/5">
                  <Link to="/contact?topic=workshop">
                    <Mail className="mr-1.5 h-4 w-4" />
                    Pitch your own workshop
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkshopsPage;
