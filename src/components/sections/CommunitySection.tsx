import { MessageCircle, Users, Calendar, Linkedin } from "lucide-react";

const CommunitySection = () => {
  const bullets = [
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Monthly meetup",
      detail: "Last Tuesday of every month at Creative Nomad Studios.",
    },
    {
      icon: <MessageCircle className="h-4 w-4" />,
      label: "WhatsApp group",
      detail: "Live conversation between operators, founders, and freelancers actively building.",
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "In-person by default",
      detail: "Real rooms, real introductions. Online has its place, but the work happens face-to-face.",
    },
  ];

  return (
    <section id="community" className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Community */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-teal uppercase tracking-wider mb-3">
                <Users className="h-3.5 w-3.5" />
                Community
              </span>
              <h2 className="text-primary mb-5">
                Founders. Operators. Builders.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                A working community of people shipping real things in Orillia. Monthly meetups, half-day workshops, and a working WhatsApp group for getting unstuck.
              </p>

              <div className="space-y-4">
                {bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-teal/10 text-brand-teal flex items-center justify-center mt-0.5">
                      {b.icon}
                    </div>
                    <div>
                      <p className="font-medium text-primary text-sm">{b.label}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-sm font-medium bg-brand-teal text-white hover:bg-brand-teal-light px-5 py-3 rounded-xl transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Join the WhatsApp Group
              </a>
            </div>

            {/* Bio */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden border border-border/50 bg-secondary">
                  <img
                    src="/dave.jpg"
                    alt="Dave Caplan"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="font-heading font-semibold text-primary text-lg">Dave Caplan</p>
                  <p className="text-sm text-muted-foreground">Founder, Startup Orillia</p>
                  <a
                    href="https://www.linkedin.com/in/davecap/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-brand-teal hover:text-brand-teal-light transition-colors mt-1.5"
                  >
                    <Linkedin className="h-3 w-3" />
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Builder, CTO, and founder. Currently CTO of <a href="https://twos.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-2 hover:text-brand-teal hover:underline transition-colors">Twos</a>, building at the intersection of AI and human conversation.
                </p>
                <p>
                  I've spent over two decades writing code, shipping products, and scaling teams across five companies (with three acquisitions along the way). These days I'm most curious about AI, agentic workflows, tiny startups, and the kinds of communities that help ambitious people learn and build faster together.
                </p>
                <p>
                  Startup Orillia started after I noticed how many interesting people were quietly building things locally, and how few ways there were for them to find each other. The goal is simple: more surface area for collaboration, learning, and momentum in Orillia.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-border/50 flex flex-wrap gap-2">
                {["Founder", "CTO", "Builder", "AI", "Community"].map((t) => (
                  <span key={t} className="text-xs text-muted-foreground/80 bg-secondary/60 px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
