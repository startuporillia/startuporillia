import { Link } from "react-router-dom";
import {
  Briefcase,
  ArrowRight,
  Calendar,
  Check,
  Linkedin,
  Quote,
  Handshake,
  Eye,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ExpertApplicationForm from "@/components/ExpertApplicationForm";
import {
  APPLICATION_STEPS,
  ELIGIBILITY,
  EXAMPLE_PROBLEMS,
  EXPERTISE_AREAS,
  EXPERT_NETWORK_FEE_CAD,
  EXPERT_NETWORK_SEATS,
  MEMBER_BENEFITS,
  OPPORTUNITY_STEPS,
  expertMembers,
  openSeats,
} from "@/lib/expert-network";
import { getNextMeetup } from "@/lib/events";
import { getProfile } from "@/lib/profiles";

const BENEFIT_ICONS = [Briefcase, MessagesSquare, Eye, ShieldCheck];

const ExpertNetworkPage = () => {
  const nextMeetup = getNextMeetup();
  const lead = getProfile("dave-caplan");
  const seats = [
    ...expertMembers.map((m) => ({ kind: "member" as const, member: m })),
    ...Array.from({ length: openSeats }, (_, i) => ({ kind: "open" as const, i })),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — two-sided */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-3xl -translate-y-1/3" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-teal uppercase tracking-wider mb-4">
                <Briefcase className="h-3.5 w-3.5" />
                Expert Network
              </span>
              <h1 className="text-primary mb-5">
                Local experts who help businesses build and grow.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
                The Startup Orillia Expert Network connects businesses with experienced local professionals
                who can help you solve practical growth, technology and operational challenges.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                The Network includes people with experience across software, AI, automation, marketing, CRM,
                systems integration, product, digital strategy and scaling companies with technology.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Business side */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-5">
                  <Handshake className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-heading font-semibold text-primary mb-2">
                  Have a business challenge?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                  Tell us what you're trying to improve, build or figure out. Startup Orillia will help clarify
                  the opportunity and bring it to relevant members of the Expert Network.
                </p>
                <p className="text-sm font-medium text-primary mb-5">Free to submit</p>
                <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white w-full sm:w-auto self-start">
                  <Link to="/contact?topic=help">
                    Bring us a problem
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Expert side */}
              <div className="bg-card border border-brand-teal/30 rounded-2xl p-6 md:p-8 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-5">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-heading font-semibold text-primary mb-2">
                  Are you an experienced operator or specialist?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                  Join a small, curated group that gets early access to qualified local business opportunities.
                </p>
                <p className="text-sm font-medium text-primary mb-5">
                  Founding membership: ${EXPERT_NETWORK_FEE_CAD}/year · Free to apply
                </p>
                <Button asChild size="lg" className="bg-brand-teal hover:bg-brand-teal-light text-white w-full sm:w-auto self-start">
                  <a href="#apply">
                    Apply to the Expert Network
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What kinds of problems */}
      <section className="container mx-auto px-4 py-16 md:py-20 border-b border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-3">
              What kinds of problems?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Businesses don't always know what kind of expert they need. They might come to us saying:
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 mb-8">
            {EXAMPLE_PROBLEMS.map((q) => (
              <li key={q} className="flex items-start gap-3 bg-card border border-border/50 rounded-2xl px-5 py-4">
                <Quote className="h-4 w-4 text-brand-orange/70 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm font-medium text-primary">
            Startup Orillia helps clarify the problem before bringing it to the Network.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/30 border-b border-border/40">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-10">
              How it works
            </h2>
            <ol className="space-y-4">
              {OPPORTUNITY_STEPS.map((s, i) => (
                <li key={s.title} className="bg-card border border-border/50 rounded-2xl p-5 md:p-6 flex gap-4 md:gap-5">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-teal text-white font-heading font-semibold text-sm flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-primary text-lg leading-snug mb-1.5">{s.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 bg-card border border-border/50 rounded-2xl px-5 py-4">
              <p className="text-sm text-primary leading-relaxed">
                <span className="font-semibold">Problem Exchanges are for understanding the challenge and exploring possible approaches.</span>{" "}
                Members aren't expected to produce detailed proposals, designs or other speculative work for free.
              </p>
            </div>
            <div className="mt-4 flex items-start gap-3 bg-brand-teal/5 border border-brand-teal/20 rounded-2xl px-5 py-4">
              <div className="flex-shrink-0 rounded-full bg-brand-teal text-white font-heading font-bold text-sm px-2.5 py-1">
                0%
              </div>
              <p className="text-sm text-primary leading-relaxed">
                <span className="font-semibold">0% referral fee for founding members.</span> Startup Orillia won't take
                a commission on work generated through the Network during the founding year. Any future changes to
                the Network's fee structure would be disclosed before renewal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who's in the Network */}
      <section className="container mx-auto px-4 py-16 md:py-20 border-b border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-3">
              Who's in the Network?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We're looking for people with practical experience in areas such as:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {EXPERTISE_AREAS.map((a) => (
              <div key={a.name} className="bg-card border border-border/50 rounded-2xl p-5">
                <p className="font-heading font-semibold text-primary mb-1.5">{a.name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.detail}</p>
              </div>
            ))}
          </div>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary mb-3">Network members should:</p>
            <ul className="space-y-2.5 mb-5">
              {ELIGIBILITY.map((e) => (
                <li key={e} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                  <Check className="h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm font-medium text-primary">You don't need to be a founder, consultant or developer.</p>
          </div>
        </div>
      </section>

      {/* For members */}
      <section className="bg-secondary/30 border-b border-border/40">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-10 text-center">
              For Expert Network members
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {MEMBER_BENEFITS.map((b, i) => {
                const Icon = BENEFIT_ICONS[i];
                return (
                  <div key={b.title} className="bg-card border border-border/50 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-heading font-semibold text-primary mb-1.5">{b.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Founding cohort */}
      <section className="container mx-auto px-4 py-16 md:py-20 border-b border-border/40">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-3">
              Founding cohort
            </h2>
            <p className="text-lg text-primary font-medium mb-4">
              {EXPERT_NETWORK_SEATS} founding experts.{" "}
              {expertMembers.length === 0
                ? "Forming now."
                : `${expertMembers.length} accepted · ${openSeats} open.`}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We're starting with a small group of people with complementary experience across growth,
              operations, technology and digital business.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The goal isn't to assemble {EXPERT_NETWORK_SEATS} people with the same skills. It's to build a
              group that can look at a business problem from different angles and quickly figure out what
              kind of help is actually needed.
            </p>
          </div>

          <div>
            <ul className="grid grid-cols-5 gap-2 sm:gap-3 mb-8" aria-label="Founding cohort seats">
              {seats.map((s) =>
                s.kind === "member" ? (
                  <li key={s.member.slug} className="flex flex-col items-center gap-1.5 text-center">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-brand-teal bg-secondary">
                      <img src={s.member.photo} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-xs font-medium text-primary leading-tight">{s.member.name}</span>
                    <span className="text-[11px] text-brand-teal leading-tight">{s.member.expertNetwork?.area}</span>
                    {s.member.expertNetwork?.focus && (
                      <span className="text-[11px] text-muted-foreground/80 leading-tight">
                        {s.member.expertNetwork.focus.join(" · ")}
                      </span>
                    )}
                  </li>
                ) : (
                  <li key={`open-${s.i}`} className="flex flex-col items-center gap-1.5 text-center">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-border bg-background flex items-center justify-center">
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground/70">Open</span>
                    </div>
                    <span className="text-xs text-muted-foreground/70">Seat {expertMembers.length + s.i + 1}</span>
                  </li>
                ),
              )}
            </ul>

            {lead && (
              <div className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-border/50 bg-secondary">
                  <img src={lead.photo} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">Network Lead · Startup Orillia organizer</p>
                </div>
                {lead.linkedin && (
                  <a
                    href={lead.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-xs text-brand-teal hover:text-brand-teal-light"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="scroll-mt-24 container mx-auto px-4 py-16 md:py-20 border-b border-border/40">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-3">Apply</h2>
            <p className="text-muted-foreground mb-8">
              Free to apply. Membership is ${EXPERT_NETWORK_FEE_CAD}/year and offered only to accepted applicants.
            </p>
            <ol className="space-y-5">
              {APPLICATION_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-teal/40 text-brand-teal text-sm font-semibold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{s.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground mt-8">
              Applications remain open after the founding cohort is full for future openings.
            </p>
          </div>
          <ExpertApplicationForm />
        </div>
      </section>

      {/* Community stays free */}
      <section className="bg-brand-cream/60 border-b border-border/40">
        <div className="container mx-auto px-4 py-14 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-4">
              The community stays free.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The Expert Network is for professional referrals and paid work. Startup Orillia's regular meetups,
              talks, workshops and community participation remain open and free.
            </p>
            <Button asChild variant="outline" className="border-border bg-card">
              <Link to="/events">
                <Calendar className="mr-2 h-4 w-4" />
                {nextMeetup ? `Next free meetup: ${nextMeetup.date}` : "See upcoming events"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Businesses — closing CTA */}
      <section id="need-help" className="scroll-mt-24 container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-4">
            <Handshake className="h-3.5 w-3.5" />
            For businesses &amp; organizations
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-4">
            Have a business challenge?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Tell us what you're trying to improve, build or figure out. We'll help clarify the opportunity
            and bring it to relevant members of the Network. Free to submit.
          </p>
          <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
            <Link to="/contact?topic=help">
              Bring us a problem
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ExpertNetworkPage;
