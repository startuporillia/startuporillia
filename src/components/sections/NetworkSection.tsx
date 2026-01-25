import { Linkedin } from "lucide-react";

interface Member {
  name: string;
  role: string;
  image?: string;
  linkedin?: string;
}

const NetworkSection = () => {
  const members: Member[] = [
    {
      name: "Dave",
      role: "Founder",
      linkedin: "https://linkedin.com/in/",
    },
    {
      name: "Jordan",
      role: "Builder",
      linkedin: "https://linkedin.com/in/",
    },
  ];

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on name
  const getColor = (name: string) => {
    const colors = [
      "bg-brand-orange/80",
      "bg-brand-teal/80",
      "bg-amber-500/80",
      "bg-emerald-500/80",
      "bg-blue-500/80",
      "bg-purple-500/80",
      "bg-rose-500/80",
      "bg-cyan-500/80",
    ];
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-primary mb-4">Meet the Network</h2>
          <p className="text-lg text-muted-foreground">
            The founders and builders who show up and ship together.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {members.map((member, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border/50 hover:border-brand-orange/30 hover:shadow-md transition-all duration-300"
            >
              {/* Avatar */}
              <div className="relative mb-3">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-medium text-lg ${getColor(
                      member.name
                    )}`}
                  >
                    {getInitials(member.name)}
                  </div>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0A66C2] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-white" />
                  </a>
                )}
              </div>

              {/* Info */}
              <h3 className="font-medium text-primary text-sm mb-0.5">
                {member.name}
              </h3>
              <span className="text-xs text-muted-foreground">{member.role}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Want to join? Come to a coworking session and introduce yourself.
        </p>
      </div>
    </section>
  );
};

export default NetworkSection;
