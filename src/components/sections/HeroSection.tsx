import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, MessageCircle, Users, Bell, Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { getNextMeetup } from "../../lib/events";

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
        <Button size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white font-medium px-8 py-6 text-base rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/25 transition-all duration-300 group">
          RSVP for Next Coworking Day
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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

const NextMeetupCard = () => {
  const nextMeetup = getNextMeetup();

  if (!nextMeetup) {
    return null;
  }

  return (
    <div className="relative bg-card border border-border/50 rounded-2xl p-6 mb-8 max-w-sm mx-auto shadow-sm animate-scale-in" style={{ animationDelay: '0.4s' }}>
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1.5 bg-brand-orange text-white text-xs font-medium px-3 py-1 rounded-full">
          <Sparkles className="h-3 w-3" />
          Next Coworking Day
        </span>
      </div>
      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-2 text-lg font-heading font-semibold text-primary mb-4">
          <Calendar className="h-5 w-5 text-brand-orange" />
          {nextMeetup.date}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
            <Clock className="h-4 w-4 text-brand-teal" />
            <span>{nextMeetup.time}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-teal font-medium bg-brand-teal/10 rounded-lg px-3 py-2">
            <span>Free</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mt-3">
          <MapPin className="h-3.5 w-3.5 text-brand-orange" />
          <span>Creative Nomad Studios, Orillia</span>
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          Bring your laptop, grab a coffee, and come co-work alongside other founders and builders. Meet people, swap ideas, or just get stuff done.
        </p>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section id="home" className="relative overflow-hidden grain-overlay">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main headline - no animation delay for LCP */}
          <h1>
            <span className="block text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-primary mb-2">
              Welcome to
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gradient">
              Startup Orillia
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-8 text-xl md:text-2xl text-primary/80 font-medium tracking-tight">
            Orillia's community of founders and builders.
            <br className="hidden sm:block" />
            <span className="text-brand-orange">Show up.</span>{' '}
            <span className="text-brand-teal">Work together.</span>{' '}
            <span className="text-primary">Ship.</span>
          </p>

          {/* Description - this is the LCP element, must be visible immediately */}
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            For people actively building startups, products, or tools — and who care about launching, learning, and getting them into the world.
          </p>

          {/* CTA Section */}
          <div id="rsvp" className="mt-12">
            <NextMeetupCard />

            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <RSVPInstructions />
            </div>

            <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <a
                href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-teal transition-colors font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                Or join our WhatsApp community directly
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
