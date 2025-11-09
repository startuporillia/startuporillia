import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Startups We've Launched
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the innovative companies that have grown from our community.
            Each of these startups represents the entrepreneurial spirit of Orillia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {startups.map((startup) => (
            <Card
              key={startup.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 bg-muted/30 flex items-center justify-center p-8 overflow-hidden">
                <img
                  src={startup.image}
                  alt={startup.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {startup.name}
                  <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardTitle>
                <CardDescription>{startup.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={startup.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaunchedStartups;
