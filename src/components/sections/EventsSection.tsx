import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, ArrowRight, MapPin, Clock, CheckCircle, MessageCircle, Users, Bell } from "lucide-react";
import { useState } from "react";
import { upcomingEvents, pastEvents } from "../../lib/events";

const RSVPInstructions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      icon: <MessageCircle className="h-5 w-5 text-brand-teal" />,
      title: "Join the WhatsApp Group",
      description: "Click the link below to join our community WhatsApp group where we coordinate all our events."
    },
    {
      icon: <Users className="h-5 w-5 text-brand-orange" />,
      title: "Introduce Yourself",
      description: "Once you're in the group, introduce yourself to the community. Tell us about your interests, projects, or what brings you to Startup Orillia."
    },
    {
      icon: <Bell className="h-5 w-5 text-primary" />,
      title: "RSVP for Meetups",
      description: "When meetups are announced in the group, simply reply with a message letting us know you're coming!"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-brand-orange hover:bg-brand-orange-light text-white font-medium group">
          RSVP for this event
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-semibold text-primary">How to Join Us</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Follow these simple steps to join our community and RSVP for upcoming events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                {step.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-primary mb-1">{step.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-border/50">
            <Button
              className="w-full bg-brand-teal hover:bg-brand-teal-light text-white font-medium py-5"
              asChild
            >
              <a
                href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Join WhatsApp Group
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EventsSection = () => {
  return (
    <section id="events" className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Upcoming Events Section */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-primary mb-4">Upcoming Events</h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with our coworking days and special events.
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-6 mb-20">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Event header */}
              <div className="bg-brand-orange/5 border-b border-border/30 px-6 py-4">
                <div className="flex items-center gap-2 text-brand-orange font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
              </div>

              {/* Event content */}
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                  {event.title}
                </h3>
                <p className="text-muted-foreground mb-6">{event.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-brand-teal" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-brand-teal font-medium">
                    <span className="w-2 h-2 bg-brand-teal rounded-full" />
                    {event.cost}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-6 bg-secondary/50 rounded-lg px-4 py-3">
                  <MapPin className="h-4 w-4 text-brand-orange mt-0.5 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>

                <RSVPInstructions />
              </div>
            </div>
          ))}
        </div>

        {/* Past Events Section */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-primary mb-4">Past Events</h2>
          <p className="text-lg text-muted-foreground">
            A look back at our previous coworking days.
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          {pastEvents.map((event, index) => (
            <div
              key={index}
              className="bg-card/50 rounded-xl border border-border/30 px-6 py-4 opacity-70"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <CheckCircle className="h-4 w-4 text-brand-teal" />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="font-medium text-primary">{event.title}</h3>
                </div>
                <span className="text-xs text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full font-medium">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
