import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Linkedin,
  MapPin,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LEVEL_DESCRIPTION,
  LEVEL_LABEL,
  TRACK_LABEL,
  currentStatus,
  formatLevelLabel,
  getWorkshop,
  levelRange,
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
import WorkshopInterestForm from "@/components/WorkshopInterestForm";
import ReserveSeatForm from "@/components/ReserveSeatForm";

const WorkshopDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const workshop = slug ? getWorkshop(slug) : undefined;

  if (!workshop) {
    return <Navigate to="/workshops" replace />;
  }

  const lead = getProfile(workshop.leadSlug);
  const coLeads = (workshop.coLeadSlugs ?? [])
    .map((s) => getProfile(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const [lo, hi] = levelRange(workshop.level);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/workshops"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All workshops
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <TrackChip track={workshop.track} />
              <LevelChip level={workshop.level} />
              <StatusBadge status={currentStatus(workshop)} />
            </div>

            <h1 className="text-primary mb-4">{workshop.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              {workshop.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-orange" />
                {formatDuration(workshop.durationMinutes)}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-brand-teal" />
                {workshop.capacity.min}-{workshop.capacity.max} people
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-orange" />
                Creative Nomad Studios, Orillia
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-brand-orange font-medium">
                  {formatPrice(workshop)} {workshop.price.currency}
                </span>
              </div>
              {workshop.scheduledTimeLabel && currentStatus(workshop) === "scheduled" && (
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-brand-teal" />
                  {workshop.scheduledTimeLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {workshop.description}
          </p>

          {/* Status-driven CTA */}
          <CTASection workshop={workshop} />

          {/* Who this is for */}
          <Block icon={<Users className="h-4 w-4" />} title="Who this is for" accent="teal">
            <ul className="space-y-2">
              {workshop.whoFor.map((item, i) => (
                <li key={i} className="flex gap-2 text-base text-muted-foreground leading-relaxed">
                  <span className="text-brand-teal mt-1.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Block>

          {/* What you'll leave with */}
          <Block icon={<Sparkles className="h-4 w-4" />} title="What you'll leave with" accent="orange">
            <ul className="space-y-2">
              {workshop.youWillLeaveWith.map((item, i) => (
                <li key={i} className="flex gap-2 text-base text-muted-foreground leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-brand-orange mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Block>

          {/* What you'll learn */}
          <Block icon={<Wrench className="h-4 w-4" />} title="What you'll learn" accent="teal">
            <ul className="space-y-2">
              {workshop.whatYouWillLearn.map((item, i) => (
                <li key={i} className="flex gap-2 text-base text-muted-foreground leading-relaxed">
                  <span className="text-brand-teal mt-1.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Block>

          {/* Agenda */}
          {workshop.agenda && workshop.agenda.length > 0 && (
            <Block icon={<Clock className="h-4 w-4" />} title="Agenda" accent="orange">
              <div className="space-y-3">
                {workshop.agenda.map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <div className="text-sm font-medium text-brand-orange flex-shrink-0 sm:w-28 tabular-nums">
                      {item.time}
                    </div>
                    <div className="text-base text-primary">
                      <span className="font-medium">{item.topic}</span>
                      {item.detail && (
                        <span className="text-muted-foreground"> — {item.detail}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {/* Prerequisites */}
          {workshop.prerequisites && workshop.prerequisites.length > 0 && (
            <Block
              icon={<CheckCircle2 className="h-4 w-4" />}
              title="You'll get more out of this if..."
              accent="teal"
            >
              <ul className="space-y-2">
                {workshop.prerequisites.map((item, i) => (
                  <li key={i} className="flex gap-2 text-base text-muted-foreground leading-relaxed">
                    <span className="text-brand-teal mt-1.5 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {/* Instructor */}
          {lead && (
            <Block icon={<Users className="h-4 w-4" />} title="Led by" accent="orange">
              <InstructorCard
                name={lead.name}
                title={lead.title}
                bio={lead.bio}
                photo={lead.photo}
                linkedin={lead.linkedin}
              />
              {coLeads.length > 0 && (
                <>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-6 mb-3">
                    With
                  </p>
                  <div className="space-y-4">
                    {coLeads.map((c) => (
                      <InstructorCard
                        key={c.slug}
                        name={c.name}
                        title={c.title}
                        bio={c.bio}
                        photo={c.photo}
                        linkedin={c.linkedin}
                      />
                    ))}
                  </div>
                </>
              )}
            </Block>
          )}

          {/* Level explainer */}
          <div className="bg-secondary/30 border border-border/40 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-heading font-semibold text-primary">
                About workshop levels
              </h3>
              <LevelDots level={workshop.level} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This workshop is{" "}
              <span className="font-medium text-primary">
                {formatLevelLabel(workshop.level)}
              </span>{" "}
              in the <span className="font-medium text-primary">{TRACK_LABEL[workshop.track]}</span> track.
              Levels are per-track — being advanced in one doesn't mean you can't start at L1 in another.
            </p>
            <div className="space-y-2 text-sm">
              {([1, 2, 3, 4, 5] as const).map((n) => {
                const isCurrent = n >= lo && n <= hi;
                return (
                  <div
                    key={n}
                    className={`flex gap-3 p-2 rounded-lg ${
                      isCurrent ? "bg-card border border-border/60" : ""
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-semibold ${
                        isCurrent
                          ? "bg-brand-orange text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      L{n}
                    </span>
                    <div className="min-w-0">
                      <div className={`font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                        {LEVEL_LABEL[n]}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {LEVEL_DESCRIPTION[n]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* -------------------------------------------------------------------------- */

const accentText: Record<"orange" | "teal", string> = {
  orange: "text-brand-orange",
  teal: "text-brand-teal",
};
const accentBg: Record<"orange" | "teal", string> = {
  orange: "bg-brand-orange/10",
  teal: "bg-brand-teal/10",
};

const Block = ({
  icon,
  title,
  hint,
  accent,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  accent: "orange" | "teal";
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-9 h-9 rounded-xl ${accentBg[accent]} ${accentText[accent]} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h2 className="font-heading font-semibold text-primary text-xl">{title}</h2>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
    {children}
  </div>
);

/** Right-aligned price block — single price, no discount theatre. */
const PriceBlock = ({
  workshop,
}: {
  workshop: NonNullable<ReturnType<typeof getWorkshop>>;
}) => (
  <div className="text-right">
    <div className="text-2xl font-heading font-semibold text-primary">
      {formatPrice(workshop)}
      <span className="text-sm font-normal text-muted-foreground ml-1">
        {workshop.price.currency}
      </span>
    </div>
  </div>
);

const InstructorCard = ({
  name,
  title,
  bio,
  photo,
  linkedin,
}: {
  name: string;
  title: string;
  bio: string;
  photo: string;
  linkedin?: string;
}) => (
  <div className="flex items-start gap-4 bg-card border border-border/50 rounded-2xl p-5">
    <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden border border-border/50 bg-secondary">
      <img src={photo} alt={name} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <div className="min-w-0">
      <p className="font-heading font-semibold text-primary">{name}</p>
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-brand-teal hover:text-brand-teal-light transition-colors mt-3"
        >
          <Linkedin className="h-3 w-3" />
          LinkedIn
        </a>
      )}
    </div>
  </div>
);

const CTASection = ({
  workshop,
}: {
  workshop: NonNullable<ReturnType<typeof getWorkshop>>;
}) => {
  if (currentStatus(workshop) === "scheduled") {
    return (
      <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-brand-orange uppercase tracking-wider mb-1">
              Scheduled
            </p>
            <h2 className="text-2xl font-heading font-semibold text-primary">
              {workshop.scheduledTimeLabel ?? "Date confirmed"}
            </h2>
          </div>
          <PriceBlock workshop={workshop} />
        </div>
        {workshop.lumaUrl ? (
          <ReserveSeatForm
            workshopSlug={workshop.slug}
            lumaUrl={workshop.lumaUrl}
            accent="orange"
            buttonLabel="Reserve my seat"
          />
        ) : (
          <div className="bg-card border border-border/50 rounded-2xl p-5">
            <p className="text-sm text-primary font-medium mb-1">Tickets opening soon</p>
            <p className="text-xs text-muted-foreground mb-3">
              The date is locked in. Drop your email to be first when registration opens.
            </p>
            <WorkshopInterestForm
              workshopSlug={workshop.slug}
              workshopTitle={workshop.title}
              headerLabel="Notify me when tickets open"
              successFollowup="We'll email the moment registration opens."
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-3">
          Bringing a team?{" "}
          <Link
            to={`/contact?topic=group&workshop=${encodeURIComponent(workshop.title)}`}
            className="text-brand-orange hover:underline"
          >
            Book a private session for your team
          </Link>
        </p>
      </div>
    );
  }

  if (currentStatus(workshop) === "sold-out") {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Sold out</p>
        <h2 className="text-2xl font-heading font-semibold text-primary mb-3">
          This run is full
        </h2>
        <p className="text-muted-foreground mb-4">
          Join the waitlist on Luma — we'll let you know if a seat opens up, and we usually run popular workshops again.
        </p>
        {workshop.lumaUrl && (
          <ReserveSeatForm
            workshopSlug={workshop.slug}
            lumaUrl={workshop.lumaUrl}
            accent="primary"
            buttonLabel="Join the waitlist"
          />
        )}
      </div>
    );
  }

  if (currentStatus(workshop) === "past") {
    return (
      <div className="bg-secondary/30 border border-border rounded-2xl p-6 md:p-8">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Completed
        </p>
        <h2 className="text-2xl font-heading font-semibold text-primary mb-3">
          This workshop has run
        </h2>
        <p className="text-muted-foreground mb-4">
          Want us to schedule it again? Drop your interest and we'll get in touch when the next run is on the calendar.
        </p>
        <WorkshopInterestForm
          workshopSlug={workshop.slug}
          workshopTitle={workshop.title}
          headerLabel="Notify me about the next run"
          successFollowup="We'll email when this one is back on the calendar."
        />
      </div>
    );
  }

  // status === "interest"
  return (
    <div>
      <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-xs font-medium text-brand-teal uppercase tracking-wider mb-1">
              Coming soon
            </p>
            <h2 className="text-2xl font-heading font-semibold text-primary">
              No date set yet
            </h2>
          </div>
          <PriceBlock workshop={workshop} />
        </div>
        <p className="text-sm text-muted-foreground">
          Leave your email — we'll notify you the moment a date is set. Or{" "}
          <Link
            to={`/contact?topic=group&workshop=${encodeURIComponent(workshop.title)}`}
            className="text-brand-teal hover:underline"
          >
            book a private session for your team
          </Link>
          .
        </p>
      </div>
      <WorkshopInterestForm workshopSlug={workshop.slug} workshopTitle={workshop.title} />
    </div>
  );
};

export default WorkshopDetailPage;
