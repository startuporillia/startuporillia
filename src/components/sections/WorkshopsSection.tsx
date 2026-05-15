import { ArrowRight, Wrench, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const WorkshopsSection = () => {
  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Small rooms",
      description: "Capped at 10. Hands on the work, not heads in slides.",
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      title: "Tangible outputs",
      description: "Three-hour intensives that end with a working artifact you take home.",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Practitioner-led",
      description: "Taught by senior operators running this work every day, not lecturers.",
    },
  ];

  return (
    <section id="workshops" className="section-padding bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-3">
                <Wrench className="h-3.5 w-3.5" />
                Workshops
              </span>
              <h2 className="text-primary mb-5">
                Practitioner-led intensives in Orillia.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                Half-day workshops in AI, building, founder craft, and modern operations.
                Wednesday mornings at Creative Nomad Studios. Small rooms, real outcomes.
              </p>
              <Link
                to="/workshops"
                className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-3 rounded-xl transition-colors group"
              >
                See the catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 bg-card border border-border/50 rounded-2xl p-5"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopsSection;
