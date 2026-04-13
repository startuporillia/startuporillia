import { Users, Lightbulb, Zap, HeartHandshake } from "lucide-react";

const MissionSection = () => {
  const features = [
    {
      icon: <Users className="h-7 w-7" />,
      title: "Show Up & Work Together",
      description: "A consistent time and place to work on your thing alongside other builders. The proximity keeps you accountable.",
      color: "brand-teal",
    },
    {
      icon: <Lightbulb className="h-7 w-7" />,
      title: "Learn & Grow",
      description: "Get unstuck through peer support. Share what's working, ask for help, and learn from others who get what you're building.",
      color: "brand-orange",
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Connect & Collaborate",
      description: "Meet other founders, find collaborators, and tap into Orillia's growing builder ecosystem.",
      color: "primary",
    },
  ];

  return (
    <section id="mission" className="section-padding bg-secondary/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-primary mb-6">Why We Exist</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Building outside a major tech hub can be isolating. Startup Orillia creates a consistent place to show up, work alongside other builders, and actually make progress — together.
          </p>
          <p className="mt-4 text-sm text-muted-foreground/70 font-medium">
            New projects, collaborations, and startups are already emerging from the community.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-5 py-2.5 rounded-full text-sm font-medium">
            <HeartHandshake className="h-4 w-4" />
            <span>
              Generously sponsored by{' '}
              <a
                href="https://creativenomad.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-brand-teal-light transition-colors"
              >
                Creative Nomad Studios
              </a>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-lg hover:border-brand-orange/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 ${
                feature.color === 'brand-teal' ? 'bg-brand-teal/10 text-brand-teal' :
                feature.color === 'brand-orange' ? 'bg-brand-orange/10 text-brand-orange' :
                'bg-primary/10 text-primary'
              } transition-transform group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
