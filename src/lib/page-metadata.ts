export const SITE_URL = "https://www.startuporillia.ca";
export const SHARE_IMAGE = `${SITE_URL}/images/banner-text.jpg`;
export type PageMetadata = { path: string; title: string; description: string };

export function getPageMetadata(
  skills: Array<{ slug: string; title: string; summary: string }>,
  workshops: Array<{ slug: string; title: string; tagline: string }>,
): PageMetadata[] {
  const pages: PageMetadata[] = [
    { path: "/", title: "Startup Orillia", description: "Meet local founders, business owners and curious people learning and building together. Free monthly meetups, workshops and community events in Orillia." },
    { path: "/skills", title: "AI Skills for Local Business | Startup Orillia", description: "Practical AI playbooks for marketing, networking and everyday business tasks. Connect your AI to local business information, or use the skills on their own." },
    { path: "/meetup", title: "Free Monthly Meetups | Startup Orillia", description: "Meet local business owners and builders at Startup Orillia’s free monthly meetups. Bring your questions, share ideas and get help from the community." },
    { path: "/events", title: "Events | Startup Orillia", description: "Find upcoming Startup Orillia meetups, workshops and community events. Meet people, learn something useful and see what is happening locally." },
    { path: "/workshops", title: "Workshops | Startup Orillia", description: "Hands-on workshops in AI, building, business and everyday operations. Explore topics, upcoming sessions and ways to learn with Startup Orillia." },
    { path: "/community", title: "Our Community | Startup Orillia", description: "Meet the people building, sharing ideas and helping one another in the Startup Orillia community." },
    { path: "/experts", title: "Expert Network | Startup Orillia", description: "Local experts who help businesses build and grow. Startup Orillia connects businesses with experienced professionals in growth, AI, automation, CRM, software, product and operations." },
    { path: "/contact", title: "Contact | Startup Orillia", description: "Get in touch with Startup Orillia. Ask a question, share an idea, propose an event or find out how to get involved." },
    { path: "/startups", title: "Local Projects and Startups | Startup Orillia", description: "Discover projects and startups from the Startup Orillia community, and meet the people turning ideas into something real." },
  ];
  return [...pages,
    ...skills.map((skill) => ({ path: `/skills/${skill.slug}`, title: `${skill.title} | Startup Orillia AI Skills`, description: skill.summary })),
    ...workshops.map((workshop) => ({ path: `/workshops/${workshop.slug}`, title: `${workshop.title} | Startup Orillia`, description: workshop.tagline })),
  ];
}
