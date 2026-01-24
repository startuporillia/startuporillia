import { ExternalLink, ArrowUpRight } from "lucide-react";

const LaunchedStartups = () => {
  const startups = [
    {
      id: 4,
      name: "Pics Direct",
      description: "Text Photos. Get Prints. It's That Easy.",
      url: "https://pics.direct",
      image: "/Startup Logos/4.png",
    },
    {
      id: 3,
      name: "CompHub",
      description: "Automate compensation benchmarking for HR teams.",
      url: "http://comphub.ca",
      image: "/Startup Logos/3.png",
    },
    {
      id: 1,
      name: "INVSBL",
      description: "AI powered follow-up assistant for Real Estate Agents",
      url: "https://goinvsbl.com",
      image: "/Startup Logos/1.png",
    },
    {
      id: 2,
      name: "PropertyBrush AI",
      description: "AI powered photo editing software for Real Estate Agents",
      url: "https://propertybrushai.com",
      image: "/Startup Logos/2.png",
    },
    {
      id: 5,
      name: "Daily Rabbi",
      description: "Ancient Teachings, Modern Clarity",
      url: "https://dailyrabbi.com",
      image: "/Startup Logos/5.png",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-primary mb-4">
            Startups We've Launched
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the innovative companies that have grown from our community.
            Each of these startups represents the entrepreneurial spirit of Orillia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <a
              key={startup.id}
              href={startup.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Logo container with white background */}
              <div className="h-44 bg-white flex items-center justify-center p-8 border-b border-border/30">
                <img
                  src={startup.image}
                  alt={startup.name}
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg font-heading font-semibold text-primary group-hover:text-brand-orange transition-colors">
                    {startup.name}
                  </h3>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-orange transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {startup.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaunchedStartups;
