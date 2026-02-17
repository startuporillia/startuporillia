import { MapPin, CalendarDays, Clock, Coffee, Users, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MeetupInfoSection = () => {
  const details = [
    {
      icon: <CalendarDays className="h-5 w-5" />,
      label: "When",
      value: "Last Tuesday of every month",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Time",
      value: "9:00 AM - 1:00 PM",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Where",
      value: "Creative Nomad Studios",
      subtext: "23 Mississaga St W, Orillia",
    },
  ];

  return (
    <section id="meetups" className="section-padding bg-background relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-primary mb-6">Monthly Coworking Days</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Every month, we gather to work on our projects together. Bring your laptop, your current problem, or just show up. The value comes from consistency—being around others who are actively building.
            </p>

            {/* Details grid */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {details.map((detail, index) => (
                <div
                  key={index}
                  className="bg-secondary/50 rounded-xl p-4 border border-border/30"
                >
                  <div className="flex items-center gap-2 text-brand-orange mb-2">
                    {detail.icon}
                    <span className="text-sm font-medium text-muted-foreground">{detail.label}</span>
                  </div>
                  <p className="font-medium text-primary">{detail.value}</p>
                  {detail.subtext && (
                    <p className="text-sm text-muted-foreground mt-0.5">{detail.subtext}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Perks */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full text-sm font-medium">
                <Coffee className="h-4 w-4" />
                Free Coffee & Snacks
              </span>
              <span className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-full text-sm font-medium">
                <Users className="h-4 w-4" />
                All Builders Welcome
              </span>
            </div>

            <Button
              size="lg"
              className="bg-brand-teal hover:bg-brand-teal-light text-white font-medium rounded-xl group"
              asChild
            >
              <a
                href="https://www.google.com/maps/search/?api=1&query=Creative+Nomad+Studios+Orillia"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-brand-orange/10 to-brand-teal/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/30">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29sbGFib3JhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                alt="People collaborating at a coworking session"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetupInfoSection;
