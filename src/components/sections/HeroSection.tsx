import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, MessageCircle, Users, Bell, Calendar, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { getNextMeetup } from "@/lib/events";

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
        <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white group">
          RSVP for Our Next Meetup <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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

const NextMeetupCard = () => {
  const nextMeetup = getNextMeetup();
  
  if (!nextMeetup) {
    return null;
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-brand-orange/20 rounded-lg p-4 mb-6 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-primary mb-1">Next Meetup</h3>
        <div className="flex items-center justify-center text-sm text-brand-orange font-medium mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          {nextMeetup.date}
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 text-brand-orange" />
          <span>{nextMeetup.time}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-brand-orange mt-0.5 flex-shrink-0" />
          <span className="text-xs">{nextMeetup.location}</span>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-primary/5 via-background to-secondary/20 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Welcome to <span className="font-handcrafted bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-teal">Startup Orillia</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          A vibrant, grassroots community for Orillia's entrepreneurs, tech professionals, innovators, and small business dreamers. Let's build something amazing, together.
        </p>
        <div id="rsvp" className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <NextMeetupCard />
          <RSVPInstructions />
          <p className="text-xs text-muted-foreground mt-3">
            Meetups every month at Creative Nomad Studios!
          </p>
          <div className="mt-4">
            <a 
              href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-sm text-brand-teal hover:text-brand-teal/80 font-medium"
            >
              <MessageCircle className="h-5 w-5" />
              Join our WhatsApp Group
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
