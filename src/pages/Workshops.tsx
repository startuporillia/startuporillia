import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LEVEL_DESCRIPTION,
  LEVEL_LABEL,
  TRACK_LABEL,
  TRACK_ORDER,
  workshops,
  type Workshop,
  type WorkshopTrack,
} from "@/lib/workshops";
import { getProfile } from "@/lib/profiles";
import {
  LevelChip,
  LevelDots,
  StatusBadge,
  TrackChip,
  formatDuration,
  formatPrice,
} from "@/components/workshop-chips";
import CustomWorkshopBuilder from "@/components/CustomWorkshopBuilder";

type TrackFilter = "all" | WorkshopTrack;

const WorkshopsPage = () => {
  const [filter, setFilter] = useState<TrackFilter>("all");
  const [builderOpen, setBuilderOpen] = useState(false);

  const filtered = filter === "all" ? workshops : workshops.filter((w) => w.track === filter);

  const scheduled = filtered.filter((w) => w.status === "scheduled");
  const interest = filtered.filter((w) => w.status === "interest");
  const soldOut = filtered.filter((w) => w.status === "sold-out");
  const past = filtered.filter((w) => w.status === "past");

  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Small rooms",
      description: "5–15 people. Everyone's in the conversation, hands on the work.",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Wednesday mornings",
      description: "9 AM starts. Sessions run 90 minutes to 4 hours, varies by workshop.",
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      title: "You leave with the work",
      description: "A live artifact, a deployed asset, or a tested workflow — not a stack of notes.",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Leveled per track",
      description: (
        <>
          L1 Foundations through L5 Leading.{" "}
          <a href="#levels" className="text-brand-orange hover:underline">
            How they work
          </a>
          .
        </>
      ),
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
              Practitioner-led intensives.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
              Small-group, in-person workshops in AI, building, founder craft, and modern operations —
              led by senior practitioners running this work every day.
            </p>
            <p className="text-base text-muted-foreground/90 leading-relaxed mb-8">
              For founders, operators, and builders who'd rather leave with a working artifact than a stack of notes.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild className="bg-brand-orange hover:bg-brand-orange-light text-white" size="lg">
                <a href="#upcoming">
                  See upcoming workshops
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
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
              The format
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Focused, hands-on work in a room of 5–15 people. Every session ends with
              something tangible in your hands.
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

      {/* How workshop levels work */}
      <section id="levels" className="container mx-auto px-4 pb-16 md:pb-20 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-secondary/30 border border-border/40 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-1">
                  How workshop levels work
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Every workshop has a level so you know what you're walking into.
                  Levels are <strong className="text-primary font-medium">per track</strong> —
                  you can be advanced in one and a beginner in another, with no judgement either way.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-card border border-border/60">
                <span className="font-semibold">L1</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">L5</span>
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
              {([1, 2, 3, 4, 5] as const).map((n) => (
                <div
                  key={n}
                  className="bg-card border border-border/50 rounded-xl p-4 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-semibold bg-brand-orange text-white">
                      L{n}
                    </span>
                    <span className="font-medium text-primary text-sm">
                      {LEVEL_LABEL[n]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-grow mb-3">
                    {LEVEL_DESCRIPTION[n]}
                  </p>
                  <LevelDots level={n} />
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Any "you'll get more out of this if..." notes on a workshop are recommendations, not requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming (scheduled, sold-out) — always renders; includes the custom workshop card */}
      <section id="upcoming" className="container mx-auto px-4 pb-16 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary">
                Upcoming workshops
              </h2>
              <p className="text-muted-foreground mt-1">
                Dates locked in. Reserve a seat before they fill up.
              </p>
            </div>
            {(scheduled.length > 0 || soldOut.length > 0) && (
              <span className="text-xs font-medium text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full">
                {scheduled.length + soldOut.length} scheduled
              </span>
            )}
          </div>

          <TrackFilters filter={filter} onChange={setFilter} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {scheduled.map((w) => (
              <FeatureWorkshopCard key={w.slug} workshop={w} />
            ))}
            {soldOut.map((w) => (
              <FeatureWorkshopCard key={w.slug} workshop={w} />
            ))}
            <CustomWorkshopCard onClick={() => setBuilderOpen(true)} />
          </div>
        </div>
      </section>

      {/* Coming soon (interest) */}
      {interest.length > 0 && (
        <section id="coming-soon" className="container mx-auto px-4 pb-16 scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary">
                  The full catalog
                </h2>
                <p className="text-muted-foreground mt-1">
                  Workshops we run on rotation. Tap one to view the syllabus and be notified when it's next on the calendar.
                </p>
              </div>
              <span className="text-xs font-medium text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-full">
                {interest.length} workshops
              </span>
            </div>

            {scheduled.length === 0 && soldOut.length === 0 && (
              <TrackFilters filter={filter} onChange={setFilter} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {interest.map((w) => (
                <CompactWorkshopCard key={w.slug} workshop={w} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section id="past" className="container mx-auto px-4 pb-16 scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">Past workshops</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {past.map((w) => (
                <Link
                  key={w.slug}
                  to={`/workshops/${w.slug}`}
                  className="bg-card/60 border border-border/40 rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-brand-orange/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-primary text-sm truncate">{w.title}</p>
                    <p className="text-xs text-muted-foreground">{TRACK_LABEL[w.track]}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center">
              <p className="text-muted-foreground">No workshops in this track yet.</p>
            </div>
          </div>
        </section>
      )}

      <CustomWorkshopBuilder open={builderOpen} onOpenChange={setBuilderOpen} />
    </div>
  );
};

/* -------------------------------------------------------------------------- */

const TrackFilters = ({
  filter,
  onChange,
}: {
  filter: TrackFilter;
  onChange: (f: TrackFilter) => void;
}) => (
  <div className="flex flex-wrap gap-2 mb-6">
    <TrackFilterButton active={filter === "all"} onClick={() => onChange("all")}>
      All
    </TrackFilterButton>
    {TRACK_ORDER.map((t) => (
      <TrackFilterButton key={t} active={filter === t} onClick={() => onChange(t)}>
        {TRACK_LABEL[t]}
      </TrackFilterButton>
    ))}
  </div>
);

const TrackFilterButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${
      active
        ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
        : "border-border bg-card text-muted-foreground hover:border-brand-orange/40 hover:text-primary"
    }`}
  >
    {children}
  </button>
);

/**
 * Special "Build a custom workshop" card. Always rendered as the last item in
 * the Upcoming grid so a team booking is one click away regardless of what's
 * scheduled. Visually distinct from the orange-accented feature cards.
 */
const CustomWorkshopCard = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative bg-gradient-to-br from-brand-teal/[0.06] to-brand-teal/[0.02] border-2 border-dashed border-brand-teal/40 rounded-2xl p-6 md:p-7 flex flex-col text-left hover:border-brand-teal hover:from-brand-teal/[0.10] transition-all"
  >
    <div className="flex items-center gap-2 text-xs font-medium text-brand-teal uppercase tracking-wider mb-4">
      <Sparkles className="h-3.5 w-3.5" />
      For your team
    </div>

    <h3 className="font-heading font-semibold text-primary text-xl md:text-2xl leading-tight mb-2 group-hover:text-brand-teal transition-colors">
      Build a custom workshop
    </h3>
    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 flex-grow">
      A private session for your team. Pick a topic, group size, and level — we'll come back with available dates and a quote.
    </p>

    <div className="pt-4 border-t border-brand-teal/20 flex items-center justify-between gap-3 text-xs text-muted-foreground">
      <span>3-15 people · Creative Nomad Studios</span>
    </div>

    <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-teal">
      Build a custom workshop
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </div>
  </button>
);

/** Large hero-style card for scheduled and sold-out workshops. */
const FeatureWorkshopCard = ({ workshop }: { workshop: Workshop }) => {
  const lead = getProfile(workshop.leadSlug);
  const isSoldOut = workshop.status === "sold-out";
  return (
    <Link
      to={`/workshops/${workshop.slug}`}
      className="group relative bg-card border-2 border-brand-orange/20 rounded-2xl p-6 md:p-7 flex flex-col hover:border-brand-orange hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <TrackChip track={workshop.track} short />
          <LevelChip level={workshop.level} />
        </div>
        <StatusBadge status={workshop.status} />
      </div>

      {workshop.scheduledTimeLabel && (
        <div className="flex items-center gap-2 mb-3 text-brand-orange">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-semibold">{workshop.scheduledTimeLabel}</span>
        </div>
      )}

      <h3 className="font-heading font-semibold text-primary text-xl md:text-2xl leading-tight mb-2 group-hover:text-brand-orange transition-colors">
        {workshop.title}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 flex-grow">
        {workshop.tagline}
      </p>

      <div className="pt-4 border-t border-border/40 flex items-end justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(workshop.durationMinutes)}
          </span>
          {lead && (
            <span className="flex items-center gap-1.5">
              <span className="block w-5 h-5 rounded-full overflow-hidden border border-border/60 bg-secondary flex-shrink-0">
                <img src={lead.photo} alt={lead.name} className="w-full h-full object-cover" loading="lazy" />
              </span>
              <span>{lead.name.split(" ")[0]}</span>
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-xl font-heading font-semibold text-primary">
            {formatPrice(workshop)}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              {workshop.price.currency}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-orange">
        {isSoldOut ? "Join the waitlist" : "Reserve my seat"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
};

/** Compact card for workshops in the "coming soon" catalog. */
const CompactWorkshopCard = ({ workshop }: { workshop: Workshop }) => (
  <Link
    to={`/workshops/${workshop.slug}`}
    className="group bg-card border border-border/50 rounded-xl p-5 flex flex-col hover:border-brand-teal/30 hover:shadow-sm transition-all"
  >
    <div className="flex items-center gap-2 mb-2 flex-wrap">
      <TrackChip track={workshop.track} short />
      <LevelChip level={workshop.level} />
    </div>
    <h4 className="font-heading font-semibold text-primary text-base leading-tight mb-1.5 group-hover:text-brand-teal transition-colors">
      {workshop.title}
    </h4>
    <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-grow line-clamp-2">
      {workshop.tagline}
    </p>
    <div className="flex items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-3 w-3" />
        {formatDuration(workshop.durationMinutes)}
        <span className="text-border">·</span>
        <span className="font-medium text-primary">
          {formatPrice(workshop)} {workshop.price.currency}
        </span>
      </div>
      <LevelDots level={workshop.level} />
    </div>
  </Link>
);

export default WorkshopsPage;
