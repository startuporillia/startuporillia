import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, MessageCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_GROUP_URL } from "@/lib/links";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found —", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-3xl translate-y-1/3" />

      <div className="relative container mx-auto px-4 min-h-screen flex items-center justify-center py-20">
        <div className="max-w-xl text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            404
          </span>
          <h1 className="text-primary mb-5">
            This page hasn't shipped yet.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
            The URL you followed doesn't lead anywhere. The rest of the site is in good shape — try one of these.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border bg-card">
              <Link to="/workshops">
                <Wrench className="mr-2 h-4 w-4" />
                See workshops
              </Link>
            </Button>
          </div>

          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-brand-teal hover:text-brand-teal-light transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Or join the WhatsApp group
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
