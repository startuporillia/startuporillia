import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LogoSliderSection = () => {
  const logos = [
    { id: 1, src: "/Startup Logos/1.png", alt: "INVSBL", url: "https://goinvsbl.com" },
    { id: 2, src: "/Startup Logos/2.png", alt: "PropertyBrush AI", url: "https://propertybrushai.com" },
    { id: 3, src: "/Startup Logos/3.png", alt: "CompHub", url: "http://comphub.ca" },
    { id: 4, src: "/Startup Logos/4.png", alt: "Pics Direct", url: "https://pics.direct" },
    { id: 5, src: "/Startup Logos/5.png", alt: "Daily Rabbi", url: "https://dailyrabbi.com" },
  ];

  return (
    <section className="py-16 md:py-20 bg-card border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              Things people are building
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary mb-2">
              Real projects from the community
            </h2>
            <p className="text-muted-foreground">
              Startups, tools, and side projects shipped by people in the room.
            </p>
          </div>
          <Link
            to="/startups"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-orange hover:text-brand-orange-light transition-colors group whitespace-nowrap"
          >
            View all projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <InfiniteSlider
          gap={32}
          duration={35}
          durationOnHover={60}
          className="py-4"
        >
          {logos.map((logo) => (
            <a
              key={logo.id}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-20 w-44 bg-white rounded-xl border border-border/40 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all duration-300 p-4 group"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </a>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
};

export default LogoSliderSection;
