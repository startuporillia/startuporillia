
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react"; // Removed Users icon

const upcomingEvents = [
  {
    date: "Every Thursday",
    title: "Weekly Startup Social",
    description: "Our regular informal hangout (typically 9 AM - 1 PM). Connect, share, and unwind with fellow innovators over coffee and snacks.", // Updated description
    type: "Social Meetup",
    location: "Creative Nomad Studios"
  },
  {
    date: "July 15, 2025",
    title: "Workshop: Pitch Perfect",
    description: "Learn how to craft and deliver a compelling pitch for your startup idea.",
    type: "Workshop",
    location: "Online via Zoom"
  },
  {
    date: "August 5, 2025",
    title: "Guest Speaker: SaaS Success Stories",
    description: "Hear from a successful SaaS founder about their journey and key learnings.",
    type: "Speaker Session",
    location: "Creative Nomad Studios"
  },
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-brand-orange" /> {event.date}
                </div>
                <CardTitle className="text-xl font-semibold text-primary">{event.title}</CardTitle>
                <CardDescription className="text-brand-teal font-medium">{event.type}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{event.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="outline" className="w-full group" asChild>
                  <a href="#rsvp">
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
