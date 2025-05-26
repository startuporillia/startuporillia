
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Lightbulb, Zap, HeartHandshake } from "lucide-react"; // Added HeartHandshake for charity

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
      icon: <Zap className="h-10 w-10 text-primary" />, // Kept original icon, consider if a more community one fits better overall
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
            Startup Orillia is dedicated to fostering a supportive and dynamic environment where anyone building something in Orillia—startups, side hustles, freelancers, and indie creators—can thrive. We believe in giving back: all proceeds from our events are donated to <a href="https://www.sharingplaceorillia.ca/" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline font-semibold">The Sharing Place Food Centre</a>.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
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
