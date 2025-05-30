import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

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
          <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white group" asChild>
            <a href="https://www.eventbrite.ca/e/startup-orillia-coworking-day-tickets-1380899961959?utm-campaign=social&utm-content=attendeeshare&utm-medium=discovery&utm-term=listing&utm-source=cp&aff=ebdsshcopyurl" target="_blank" rel="noopener noreferrer">
              RSVP for Our Next Meetup <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
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
