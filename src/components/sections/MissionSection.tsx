import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Lightbulb, Zap, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MissionSection = () => {
  const features = [
    {
      icon: <Users className="h-10 w-10 text-brand-teal" />,
      title: "Connect & Collaborate",
      description: "Meet like-minded individuals, share ideas, and find collaborators for your next big project.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-brand-orange" />,
      title: "Learn & Grow",
      description: "Gain insights from guest speakers, participate in workshops, and grow your skills.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Support Local Innovation",
      description: "Be part of a movement that champions local talent and drives Orillia's entrepreneurial ecosystem.",
    },
  ];

  return (
    <section id="mission" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Mission: Empowering Orillia's Innovators</h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Startup Orillia is dedicated to fostering a supportive and dynamic environment where anyone building something in Orillia—startups, side hustles, freelancers, and indie creators—can thrive. We collect donations for <a href="https://sharingplaceorillia.org/" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline font-semibold">The Sharing Place Food Centre</a>, and we're excited to announce that all coworking events for the 2025 summer season are generously sponsored by <a href="https://creativenomad.ca/" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline font-semibold">Creative Nomad Studios</a>!
          </p>
          <div className="mt-6 flex justify-center animate-fade-in-up" style={{ animationDelay: `0.2s` }}>
            <Badge variant="outline" className="text-base flex items-center gap-2 py-2 px-4 border-brand-teal text-brand-teal hover:bg-brand-teal/10">
              <HeartHandshake className="h-5 w-5" /> Free attendance for 2025 summer season!
            </Badge>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 3)}s` }}> {/* Adjusted animation delay */}
              <CardHeader>
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold text-primary">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
