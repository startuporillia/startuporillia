import { MessageSquare, Zap, Users, ArrowRight } from "lucide-react";

const CommunityBuzzSection = () => {
  const recentTopics = [
    {
      emoji: "🤖",
      topic: "AI tools & workflows",
      detail: "From $40 to $600+/mo — what's actually worth it",
    },
    {
      emoji: "🔧",
      topic: "Multi-agent systems",
      detail: "Claude Code, parallel agents, real-world setups",
    },
    {
      emoji: "🎨",
      topic: "Projects in progress",
      detail: "SMB tools, AI media, internal systems",
    },
    {
      emoji: "🎓",
      topic: "Practical AI adoption",
      detail: "How people are actually using this in their work",
    },
  ];

  const stats = [
    { value: "30+", label: "Active builders" },
    { value: "Monthly", label: "Coworking sessions" },
    { value: "5", label: "Startups launched" },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/20 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-orange/10">
              <MessageSquare className="h-5 w-5 text-brand-orange" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-semibold text-primary">
                What People Are Building
              </h2>
              <p className="text-sm text-muted-foreground">
                Projects in progress and conversations from the community
              </p>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {recentTopics.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-brand-orange/20 transition-colors"
              >
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <div className="min-w-0">
                  <h3 className="font-medium text-primary text-sm mb-0.5">
                    {item.topic}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats + CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-border/50">
            {/* Stats */}
            <div className="flex items-center gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-heading font-semibold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-teal hover:text-brand-teal-light transition-colors group"
            >
              <Users className="h-4 w-4" />
              Join the conversation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityBuzzSection;
