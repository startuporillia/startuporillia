import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
  Wrench,
  Users,
  Handshake,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddToCalendarButton from "@/components/AddToCalendarButton";
import { upcomingEvents, pastEvents, EVENT_TYPE_LABEL, type Event, type EventType } from "../lib/events";
import { workshops as workshopsCatalog, workshopAsEvent } from "../lib/workshops";
import { LUMA_CALENDAR_URL, WHATSAPP_GROUP_URL } from "../lib/links";

const typeStyles: Record<EventType, string> = {
  coworking: "bg-brand-teal/10 text-brand-teal",
  workshop: "bg-brand-orange/10 text-brand-orange",
  community: "bg-primary/10 text-primary",
  partner: "bg-purple-500/10 text-purple-700",
};

interface SectionTheme {
  /** Tailwind text/ring color class fragment, e.g. "brand-orange" */
  accent: "brand-orange" | "brand-teal" | "purple-500";
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>;
}

const EventCard = ({ event }: { event: Event }) => {
  const hasRsvpLink = !!event.rsvpUrl;

  return (
    <article className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-secondary/30 border-b border-border/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeStyles[event.type]} whitespace-nowrap`}>
          {EVENT_TYPE_LABEL[event.type]}
        </span>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground min-w-0">
          <Calendar className="h-4 w-4 text-brand-orange flex-shrink-0" />
          <span className="truncate">{event.date}</span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
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
        <p className="text-muted-foreground mb-5 leading-relaxed text-sm sm:text-base">{event.description}</p>

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

        <div className="pt-4 border-t border-border/40">
          <p className="text-xs text-brand-teal font-medium mb-3 break-words">{event.cost}</p>
          <div className="flex flex-wrap items-center gap-2">
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
                <a href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F" target="_blank" rel="noopener noreferrer">
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
                  url: typeof window !== "undefined" ? `${window.location.origin}/events` : undefined,
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

const accentClasses: Record<
  SectionTheme["accent"],
  { text: string; bg: string; bgSoft: string; border: string; hoverBgSoft: string }
> = {
  "brand-orange": {
    text: "text-brand-orange",
    bg: "bg-brand-orange",
    bgSoft: "bg-brand-orange/10",
    border: "border-brand-orange/20",
    hoverBgSoft: "hover:bg-brand-orange/10",
  },
  "brand-teal": {
    text: "text-brand-teal",
    bg: "bg-brand-teal",
    bgSoft: "bg-brand-teal/10",
    border: "border-brand-teal/20",
    hoverBgSoft: "hover:bg-brand-teal/10",
  },
  "purple-500": {
    text: "text-purple-700",
    bg: "bg-purple-500",
    bgSoft: "bg-purple-500/10",
    border: "border-purple-500/20",
    hoverBgSoft: "hover:bg-purple-500/10",
  },
};

const TypedSection = ({
  label,
  description,
  events,
  emptyMessage,
  theme,
  cta,
}: {
  label: string;
  description: string;
  events: Event[];
  emptyMessage?: string;
  theme: SectionTheme;
  cta?: { label: string; to: string };
}) => {
  if (events.length === 0 && !emptyMessage) return null;

  const Icon = theme.icon;
  const c = accentClasses[theme.accent];
  const countLabel = events.length > 0 ? `${events.length} upcoming` : "Coming soon";

  return (
    <section className={`relative rounded-2xl sm:rounded-3xl border ${c.border} ${c.bgSoft} p-4 sm:p-6 md:p-8 mb-8`}>
      <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-border/40">
        <div className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${c.bg} text-white flex items-center justify-center shadow-sm`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className={`text-lg sm:text-xl md:text-2xl font-heading font-semibold ${c.text} break-words`}>
              {label}
            </h2>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-card border border-border/60 ${c.text} whitespace-nowrap`}>
              {countLabel}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-5">
          {events.map((event, idx) => (
            <EventCard key={idx} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      )}

      {cta && (
        <div className="mt-6 flex justify-center">
          <Button
            asChild
            size="sm"
            variant="outline"
            className={`bg-card ${c.text} ${c.border} ${c.hoverBgSoft} group`}
          >
            <Link to={cta.to}>
              {cta.label}
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
};

const EventsPage = () => {
  const upcoming = upcomingEvents;
  // Workshops live in their own catalog (src/lib/workshops.ts). Pull scheduled
  // + sold-out entries and adapt them to the Event shape so they render here.
  const scheduledWorkshops = workshopsCatalog
    .filter((w) => w.status === "scheduled" || w.status === "sold-out")
    .map(workshopAsEvent);
  // Combine adapter output with any workshop-typed entries in events.ts (if ever added).
  const workshops = [...scheduledWorkshops, ...upcoming.filter((e) => e.type === "workshop")];
  const community = upcoming.filter((e) => e.type === "coworking" || e.type === "community");
  const partners = upcoming.filter((e) => e.type === "partner");

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              Events
            </span>
            <h1 className="text-primary mb-5">
              Workshops, meetups, and partner events.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Coworking days, workshops, demos, and partner events. All in-person, all in Orillia.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <TypedSection
            label="Community Events"
            description="Coworking days and meetups organized by Startup Orillia."
            events={community}
            theme={{ accent: "brand-teal", icon: Users }}
            cta={{ label: "Suggest a community event", to: "/contact?topic=general" }}
          />

          <TypedSection
            label="Workshops"
            description="Practitioner-led intensives in AI, building, founder craft, and modern operations. Wednesday mornings."
            events={workshops}
            emptyMessage="Next workshops are being scheduled. Browse the full catalog to get notified."
            theme={{ accent: "brand-orange", icon: Wrench }}
            cta={{ label: "Browse the workshop catalog", to: "/workshops" }}
          />

          <TypedSection
            label="Partner Events"
            description="Community-aligned events independently led by members of the Startup Orillia network."
            events={partners}
            emptyMessage="Nothing scheduled right now. Running something the community would love? Submit it below."
            theme={{ accent: "purple-500", icon: Handshake }}
            cta={{ label: "Submit a partner event", to: "/contact?topic=partner" }}
          />

          <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 text-center mt-4">
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
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
