import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, MapPin, Clock } from "lucide-react";

const upcomingEvents = [
  {
    date: "Thursday, June 5",
    title: "Startup Orillia Coworking Day",
    description: "Come join us on Thursday June 5th for coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios, 23 Mississaga Street West Orillia, ON L3V 3A5"
  }
];

const EventsSection = () => {
  return (
    <section id="events" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Upcoming Events</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest meetups, workshops, and special events.
          </p>
        </div>
        <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
          {upcomingEvents.map((event, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-brand-orange" /> {event.date}
                </div>
                <CardTitle className="text-xl font-semibold text-primary">{event.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-brand-orange mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{event.time}</p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-orange mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="outline" className="w-full group" asChild>
                  <a href="https://www.eventbrite.ca/e/startup-orillia-coworking-day-tickets-1380899961959?utm-campaign=social&utm-content=attendeeshare&utm-medium=discovery&utm-term=listing&utm-source=cp&aff=ebdsshcopyurl" target="_blank" rel="noopener noreferrer">
                    Learn More & RSVP <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
