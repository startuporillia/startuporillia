import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { upcomingEvents, EVENT_TYPE_LABEL, type Event, type EventType } from "../../lib/events";
import { workshops as workshopsCatalog, workshopAsEvent, currentStatus } from "../../lib/workshops";

const typeStyles: Record<EventType, string> = {
  coworking: "bg-brand-teal/10 text-brand-teal",
  workshop: "bg-brand-orange/10 text-brand-orange",
  community: "bg-primary/10 text-primary",
  partner: "bg-purple-500/10 text-purple-700",
};

/**
 * Homepage "What's on the calendar" section.
 *
 * The Hero already features the next coworking day, so this section leads with
 * scheduled workshops + community/partner events. When none are on the calendar
 * — the meetups-only stretches — it falls back to the coworking days and swaps
 * the copy to match, rather than promising workshops that aren't scheduled.
 */
const WhatsHappeningSection = () => {
  const scheduledWorkshops: Event[] = workshopsCatalog
    .filter((w) => currentStatus(w) === "scheduled")
    .map(workshopAsEvent);
  const nonCoworking = upcomingEvents.filter((e) => e.type !== "coworking");

  const byDate = (a: Event, b: Event) => a.startDate!.getTime() - b.startDate!.getTime();
  const featured = [...scheduledWorkshops, ...nonCoworking]
    .filter((e) => e.startDate)
    .sort(byDate)
    .slice(0, 3);

  const meetupsOnly = featured.length === 0;
  const events = meetupsOnly
    ? [...upcomingEvents].filter((e) => e.startDate).sort(byDate).slice(0, 3)
    : featured;

  const heading = meetupsOnly ? "Upcoming meetups" : "Upcoming workshops and events";
  const blurb = meetupsOnly
    ? "Our monthly coworking day — last Tuesday of every month at Creative Nomad Studios. Free, in-person, open to anyone building something."
    : "Practitioner-led workshops, partner events, and community sessions. All in-person, all in Orillia.";

  return (
    <section id="happening" className="section-padding bg-background relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                What's on the calendar
              </span>
              <h2 className="text-primary mb-3">{heading}</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl">
                {blurb}
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-teal hover:text-brand-teal-light transition-colors group whitespace-nowrap"
            >
              See all events
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {events.map((event, idx) => (
              <Link
                key={idx}
                to={event.detailUrl ?? "/events"}
                className="group bg-card rounded-2xl border border-border/50 p-6 hover:border-brand-orange/30 hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeStyles[event.type]}`}>
                    {EVENT_TYPE_LABEL[event.type]}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-primary text-lg mb-2 group-hover:text-brand-orange transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-grow">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-brand-orange flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-brand-teal flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsHappeningSection;
