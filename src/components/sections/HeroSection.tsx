import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getNextMeetup } from "../../lib/events";
import AddToCalendarButton from "@/components/AddToCalendarButton";

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
          Next Meetup
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
          <div className="flex items-center gap-2 text-brand-teal font-medium bg-brand-teal/10 rounded-lg px-3 py-2 justify-center">
            <span>Free</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mt-3">
          <MapPin className="h-3.5 w-3.5 text-brand-orange" />
          <span>Creative Nomad Studios, Orillia</span>
        </div>
        {nextMeetup.startDate && nextMeetup.endDate && (
          <div className="mt-4 flex justify-center">
            <AddToCalendarButton
              event={{
                title: nextMeetup.title,
                description: nextMeetup.description,
                location: nextMeetup.location,
                start: nextMeetup.startDate,
                end: nextMeetup.endDate,
                url: typeof window !== "undefined" ? `${window.location.origin}/meetup` : undefined,
              }}
              filename={`${nextMeetup.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`}
            />
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-border/40">
          <Link
            to="/meetup"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-teal hover:text-brand-teal-light transition-colors group"
          >
            New here? What to expect at a meetup
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section id="home" className="relative overflow-hidden grain-overlay">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative container mx-auto px-4 pt-12 md:pt-16 lg:pt-20 pb-20 md:pb-28 lg:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="!leading-[1.25]">
            <span className="block text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-primary mb-1 pb-1">
              Welcome to
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gradient pb-3">
              Startup Orillia
            </span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-primary/80 font-medium tracking-tight">
            Orillia's working community of founders and builders.{' '}
            <br className="hidden sm:block" />
            <span className="text-brand-orange">Show up.</span>{' '}
            <span className="text-brand-teal">Work together.</span>{' '}
            <span className="text-primary">Ship.</span>
          </p>

          <p className="mt-5 text-sm text-muted-foreground/80 font-medium tracking-wide">
            Monthly meetups · Practitioner-led workshops · Active builders
          </p>

          <div id="rsvp" className="mt-12">
            <NextMeetupCard />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange-light text-white font-medium px-8 py-6 text-base rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/25 transition-all duration-300 group w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Join the WhatsApp Group
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-border bg-card hover:bg-secondary/80 text-primary font-medium px-8 py-6 text-base rounded-xl group w-full sm:w-auto"
                asChild
              >
                <Link to="/events">
                  View Events
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
