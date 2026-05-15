import { Users, Linkedin, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { profiles } from "@/lib/profiles";
import { TRACK_SHORT_LABEL, type WorkshopTrack } from "@/lib/workshops";
import { WHATSAPP_GROUP_URL } from "@/lib/links";

const trackChipClass: Record<WorkshopTrack, string> = {
  ai: "bg-brand-orange/10 text-brand-orange",
  founder: "bg-brand-teal/10 text-brand-teal",
  build: "bg-primary/10 text-primary",
  ops: "bg-purple-500/10 text-purple-700",
};

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-3xl -translate-y-1/3" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-teal uppercase tracking-wider mb-4">
              <Users className="h-3.5 w-3.5" />
              Community
            </span>
            <h1 className="text-primary mb-5">
              The people behind the work.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Senior practitioners, founders, and operators in the Startup Orillia community.
              Some lead workshops. Some are quietly building. All are worth knowing.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-brand-teal hover:bg-brand-teal-light text-white">
                <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Join the WhatsApp Group
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border bg-card">
                <Link to="/contact?topic=general">
                  <Mail className="mr-2 h-4 w-4" />
                  Get featured
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Profiles */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-2">
              Community members
            </h2>
            <p className="text-muted-foreground">
              {profiles.length} {profiles.length === 1 ? "person" : "people"} listed. More joining as the community grows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((p) => (
              <article
                key={p.slug}
                className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col hover:border-brand-teal/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden border border-border/50 bg-secondary">
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-primary text-lg leading-tight truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      {p.title}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-5">
                  {p.bio}
                </p>

                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs text-muted-foreground/80 bg-secondary/60 px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {p.teaches && p.teaches.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1.5 mb-4 pt-3 border-t border-border/40">
                    <span className="text-xs font-medium text-primary/70 uppercase tracking-wide mr-1">
                      Teaches
                    </span>
                    {p.teaches.map((t) => (
                      <span
                        key={t}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${trackChipClass[t]}`}
                      >
                        {TRACK_SHORT_LABEL[t]}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs">
                  {p.linkedin && (
                    <a
                      href={p.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-teal hover:text-brand-teal-light transition-colors"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      LinkedIn
                    </a>
                  )}
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Website
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Empty-state nudge */}
          <div className="mt-12 bg-card border border-dashed border-border rounded-2xl p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Want to be on this page? Lead a workshop, ship something interesting, or just say hi.
            </p>
            <Button asChild variant="outline" className="border-brand-teal/40 text-brand-teal hover:bg-brand-teal/5">
              <Link to="/contact?topic=general">
                <Mail className="mr-1.5 h-4 w-4" />
                Get in touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
