
import { MapPin, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const MeetupInfoSection = () => {
  return (
    <section id="meetups" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Join Our Weekly Meetups!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Every week, Startup Orillia hosts an informal hangout for anyone passionate about building, creating, and innovating in our city. Expect coffee, snacks, good conversation, and a chance to build real connections. It's the perfect place to connect, share, and get inspired.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CalendarDays className="h-6 w-6 text-brand-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary">When?</h3>
                  <p className="text-muted-foreground">Every Thursday Evening</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-brand-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary">Time?</h3>
                  <p className="text-muted-foreground">6:00 PM - 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-brand-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary">Where?</h3>
                  <p className="text-muted-foreground">Creative Nomad Studios, 23 Mississaga St W, Orillia, ON</p>
                </div>
              </div>
            </div>
            <Button size="lg" className="bg-brand-teal hover:bg-brand-teal/90 text-white" asChild>
              <a href="https://www.google.com/maps/search/?api=1&query=Creative+Nomad+Studios+Orillia" target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
            </Button>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29sbGFib3JhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" 
              alt="People collaborating at a meetup" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
              style={{ maxHeight: '450px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetupInfoSection;
