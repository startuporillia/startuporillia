import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, ArrowRight, MapPin, Clock, CheckCircle, MessageCircle, Users, Bell, DollarSign } from "lucide-react";
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
        <Button variant="outline" className="w-full group">
          Learn More & RSVP <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">How to RSVP for Our Meetups</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Follow these simple steps to join our community and RSVP for upcoming events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {step.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary mb-1">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t">
            <Button 
              className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white" 
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
    <section id="events" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Upcoming Events Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Upcoming Events</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest meetups, workshops, and special events.
          </p>
        </div>
        <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto mb-16">
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
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground font-medium text-green-600">{event.cost}</p>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <RSVPInstructions />
              </div>
            </Card>
          ))}
        </div>

        {/* Past Events Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Past Events</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relive the memories from our previous meetups and events.
          </p>
        </div>
        <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
          {pastEvents.map((event, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up opacity-75" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {event.date}
                </div>
                <CardTitle className="text-xl font-semibold text-primary">{event.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{event.time}</p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground font-medium text-green-600">{event.cost}</p>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Event Completed
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
