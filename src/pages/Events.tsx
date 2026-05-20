import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddToCalendarButton from "@/components/AddToCalendarButton";
import {
  upcomingEvents,
  pastEvents,
  EVENT_TYPE_LABEL,
  type Event,
  type EventType,
} from "../lib/events";
import { workshops as workshopsCatalog, workshopAsEvent } from "../lib/workshops";
import { LUMA_CALENDAR_URL, WHATSAPP_GROUP_URL } from "../lib/links";

const typeStyles: Record<EventType, string> = {
  coworking: "bg-brand-teal/10 text-brand-teal",
  workshop: "bg-brand-orange/10 text-brand-orange",
  community: "bg-primary/10 text-primary",
  partner: "bg-purple-500/10 text-purple-700",
};

type TypeFilter = "all" | "workshop" | "community" | "partner";
type CostFilter = "all" | "free" | "paid";

const isFreeEvent = (e: Event): boolean => e.cost.toLowerCase().startsWith("free");

const monthLabel = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/Toronto",
  });

/* -------------------------------------------------------------------------- */
/*  Event card (used in the chronological list)                               */
/* -------------------------------------------------------------------------- */

const EventCard = ({ event }: { event: Event }) => {
  const hasRsvpLink = !!event.rsvpUrl;

  return (
    <article className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="bg-secondary/30 border-b border-border/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeStyles[event.type]} whitespace-nowrap`}>
          {EVENT_TYPE_LABEL[event.type]}
        </span>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground min-w-0">
          <Calendar className="h-4 w-4 text-brand-orange flex-shrink-0" />
          <span className="truncate">{event.date}</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {event.detailUrl ? (
          <Link
            to={event.detailUrl}
            className="block text-lg sm:text-xl font-heading font-semibold text-primary mb-2 break-words hover:text-brand-orange transition-colors"
          >
            {event.title}
          </Link>
        ) : (
          <h3 className="text-lg sm:text-xl font-heading font-semibold text-primary mb-2 break-words">
            {event.title}
          </h3>
        )}
        <p className="text-muted-foreground mb-5 leading-relaxed text-sm sm:text-base flex-grow">
          {event.description}
        </p>

        <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 mb-5 text-sm min-w-0">
          <div className="flex items-center gap-2 text-muted-foreground min-w-0">
            <Clock className="h-4 w-4 text-brand-teal flex-shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground min-w-0">
            <MapPin className="h-4 w-4 text-brand-orange flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border/40 flex flex-wrap items-center gap-2">
          {hasRsvpLink ? (
            <Button asChild size="sm" className="bg-brand-orange hover:bg-brand-orange-light text-white group">
              <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer">
                {event.type === "workshop" ? "Reserve" : "RSVP"}
                <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>
          ) : event.detailUrl ? (
            <Button asChild size="sm" className="bg-brand-orange hover:bg-brand-orange-light text-white">
              <Link to={event.detailUrl}>
                View workshop
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline" className="border-brand-teal/40 text-brand-teal hover:bg-brand-teal/5">
              <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1.5 h-4 w-4" />
                RSVP via WhatsApp
              </a>
            </Button>
          )}
          {event.detailUrl && hasRsvpLink && (
            <Button asChild size="sm" variant="outline" className="border-border">
              <Link to={event.detailUrl}>Details</Link>
            </Button>
          )}
          {event.startDate && event.endDate && (
            <AddToCalendarButton
              event={{
                title: event.title,
                description: event.description,
                location: event.location,
                start: event.startDate,
                end: event.endDate,
                url:
                  event.detailUrl
                    ? typeof window !== "undefined"
                      ? `${window.location.origin}${event.detailUrl}`
                      : undefined
                    : typeof window !== "undefined"
                      ? `${window.location.origin}/events`
                      : undefined,
              }}
              filename={`${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`}
            />
          )}
        </div>
      </div>
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/*  Featured "Next up" card                                                   */
/* -------------------------------------------------------------------------- */

const NextUpCard = ({ event }: { event: Event }) => {
  const hasRsvpLink = !!event.rsvpUrl;

  return (
    <article className="relative bg-card border-2 border-brand-orange/30 rounded-2xl overflow-hidden shadow-md">
      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider bg-card px-2 py-1 rounded-full border border-brand-orange/30">
        <Sparkles className="h-3 w-3" />
        Next up
      </div>

      <div className="p-6 sm:p-8 pt-14 sm:pt-12 flex flex-col md:flex-row md:items-start gap-6">
        <div className="md:flex-shrink-0 md:w-48 md:border-r md:border-border/40 md:pr-6">
          <div className="flex items-center gap-2 text-brand-orange mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-semibold">{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Clock className="h-3.5 w-3.5 text-brand-teal" />
            {event.time}
          </div>
          <div className="flex items-start gap-2 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5 text-brand-orange mt-0.5 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeStyles[event.type]}`}>
              {EVENT_TYPE_LABEL[event.type]}
            </span>
          </div>
          {event.detailUrl ? (
            <Link
              to={event.detailUrl}
              className="block text-xl md:text-2xl font-heading font-semibold text-primary mb-2 hover:text-brand-orange transition-colors"
            >
              {event.title}
            </Link>
          ) : (
            <h3 className="text-xl md:text-2xl font-heading font-semibold text-primary mb-2">
              {event.title}
            </h3>
          )}
          <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {hasRsvpLink ? (
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white group">
                <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer">
                  {event.type === "workshop" ? "Reserve my seat" : "RSVP"}
                  <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Button>
            ) : event.detailUrl ? (
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white">
                <Link to={event.detailUrl}>
                  View workshop
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline" className="border-brand-teal/40 text-brand-teal hover:bg-brand-teal/5">
                <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  RSVP via WhatsApp
                </a>
              </Button>
            )}
            {event.detailUrl && hasRsvpLink && (
              <Button asChild size="lg" variant="outline" className="border-border">
                <Link to={event.detailUrl}>Details</Link>
              </Button>
            )}
            {event.startDate && event.endDate && (
              <AddToCalendarButton
                event={{
                  title: event.title,
                  description: event.description,
                  location: event.location,
                  start: event.startDate,
                  end: event.endDate,
                  url:
                    event.detailUrl && typeof window !== "undefined"
                      ? `${window.location.origin}${event.detailUrl}`
                      : undefined,
                }}
                filename={`${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/*  Filter UI                                                                 */
/* -------------------------------------------------------------------------- */

const FilterPill = ({
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
    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
      active
        ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
        : "border-border bg-card text-muted-foreground hover:border-brand-orange/40 hover:text-primary"
    }`}
  >
    {children}
  </button>
);

const FilterRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 flex-wrap">
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-16 flex-shrink-0">
      {label}
    </span>
    <div className="flex items-center gap-1.5 flex-wrap">{children}</div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const EventsPage = () => {
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [costFilter, setCostFilter] = useState<CostFilter>("all");

  // Combine workshop catalog + native events into one chronological list.
  const scheduledWorkshops: Event[] = workshopsCatalog
    .filter((w) => w.status === "scheduled" || w.status === "sold-out")
    .map(workshopAsEvent);
  const partnerAndCommunity = upcomingEvents.filter((e) => e.type !== "workshop");
  const allUpcoming: Event[] = [...scheduledWorkshops, ...partnerAndCommunity]
    .filter((e) => e.startDate)
    .sort((a, b) => a.startDate!.getTime() - b.startDate!.getTime());

  const availableMonths = Array.from(
    new Map(
      allUpcoming.map((e) => [
        `${e.startDate!.getUTCFullYear()}-${e.startDate!.getUTCMonth()}`,
        monthLabel(e.startDate!),
      ]),
    ).values(),
  );

  const filtered = allUpcoming.filter((e) => {
    if (monthFilter !== "all" && monthLabel(e.startDate!) !== monthFilter) return false;
    if (typeFilter === "workshop" && e.type !== "workshop") return false;
    if (
      typeFilter === "community" &&
      e.type !== "coworking" &&
      e.type !== "community"
    )
      return false;
    if (typeFilter === "partner" && e.type !== "partner") return false;
    if (costFilter === "free" && !isFreeEvent(e)) return false;
    if (costFilter === "paid" && isFreeEvent(e)) return false;
    return true;
  });

  const nextUp = filtered[0];
  const rest = filtered.slice(1);

  const filtersActive =
    monthFilter !== "all" || typeFilter !== "all" || costFilter !== "all";

  const clearFilters = () => {
    setMonthFilter("all");
    setTypeFilter("all");
    setCostFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              Events
            </span>
            <h1 className="text-primary mb-5">
              What's on the calendar.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Coworking days, workshops, demos, and partner events. All in-person, all in Orillia.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Filters */}
          {allUpcoming.length > 0 && (
            <div className="bg-card border border-border/50 rounded-2xl p-5 mb-8 space-y-3">
              <FilterRow label="Month">
                <FilterPill active={monthFilter === "all"} onClick={() => setMonthFilter("all")}>
                  All
                </FilterPill>
                {availableMonths.map((m) => (
                  <FilterPill key={m} active={monthFilter === m} onClick={() => setMonthFilter(m)}>
                    {m}
                  </FilterPill>
                ))}
              </FilterRow>
              <FilterRow label="Type">
                <FilterPill active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
                  All
                </FilterPill>
                <FilterPill active={typeFilter === "workshop"} onClick={() => setTypeFilter("workshop")}>
                  Workshops
                </FilterPill>
                <FilterPill active={typeFilter === "community"} onClick={() => setTypeFilter("community")}>
                  Community
                </FilterPill>
                <FilterPill active={typeFilter === "partner"} onClick={() => setTypeFilter("partner")}>
                  Partner
                </FilterPill>
              </FilterRow>
              <FilterRow label="Cost">
                <FilterPill active={costFilter === "all"} onClick={() => setCostFilter("all")}>
                  All
                </FilterPill>
                <FilterPill active={costFilter === "free"} onClick={() => setCostFilter("free")}>
                  Free
                </FilterPill>
                <FilterPill active={costFilter === "paid"} onClick={() => setCostFilter("paid")}>
                  Paid
                </FilterPill>
              </FilterRow>
              {filtersActive && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Next up */}
          {nextUp && (
            <div className="mb-8">
              <NextUpCard event={nextUp} />
            </div>
          )}

          {/* Rest of the list */}
          {rest.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5">
              {rest.map((event, idx) => (
                <EventCard key={`${event.title}-${idx}`} event={event} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="bg-card border border-dashed border-border rounded-2xl p-10 text-center">
              <p className="text-muted-foreground mb-4">
                {filtersActive
                  ? "Nothing matches these filters."
                  : "Nothing on the calendar right now."}
              </p>
              {filtersActive && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 text-center mt-12">
            <h3 className="text-xl md:text-2xl font-heading font-semibold text-primary mb-3">
              Get notified first
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Both channels carry the announcement — pick whichever fits your inbox.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-brand-teal hover:bg-brand-teal-light text-white">
                <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Join the WhatsApp Group
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-brand-orange/40 text-brand-orange hover:bg-brand-orange/5">
                <a href={LUMA_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-4 w-4" />
                  Follow on Luma
                </a>
              </Button>
            </div>
          </div>

          {/* Past events */}
          {pastEvents.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-6">
                Past events
              </h2>
              <div className="space-y-3">
                {pastEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-card/50 rounded-xl border border-border/30 px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-teal" />
                        <span>{event.date}</span>
                      </div>
                      <p className="font-medium text-primary text-sm truncate">{event.title}</p>
                    </div>
                    <span className="text-xs text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
