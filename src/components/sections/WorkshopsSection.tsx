import { ArrowRight, Wrench, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const WorkshopsSection = () => {
  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "5-15 people",
      description: "Small groups, real conversation. Not lectures.",
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      title: "Real-world useful",
      description: "1-3 hour sessions designed around something you can apply that week.",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Led by people in the room",
      description: "Run by community members who actually use this stuff in their work.",
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
                Small-group sessions led by people in the community.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                Workshops on AI tools, workflows, productivity, growth, product, operations, and modern ways of working. Designed around real-world usefulness, not theory. Startup Orillia organizes and promotes them so the lead can focus on the room.
              </p>
              <Link
                to="/workshops"
                className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-3 rounded-xl transition-colors group"
              >
                View Workshops
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
