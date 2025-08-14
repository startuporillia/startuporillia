export interface Event {
  date: string;
  title: string;
  description: string;
  time: string;
  location: string;
  cost: string;
}

export const upcomingEvents: Event[] = [
  {
    date: "Tuesday, August 20",
    title: "Startup Orillia Coworking Day",
    description: "Join us for coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios",
    cost: "Free! (Sponsored by Creative Nomad Studios)"
  }
];

export const pastEvents: Event[] = [
  {
    date: "Thursday, July 31",
    title: "Startup Orillia Coworking Day",
    description: "Join us for coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios",
    cost: "Free! (Sponsored by Creative Nomad Studios)"
  },
  {
    date: "Tuesday, July 15",
    title: "Startup Orillia Coworking Day",
    description: "Join us for coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios",
    cost: "Free! (Sponsored by Creative Nomad Studios)"
  },
  {
    date: "Thursday, June 5",
    title: "Startup Orillia Coworking Day",
    description: "A great day of coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios, 23 Mississaga Street West Orillia, ON L3V 3A5",
    cost: "Free! (Sponsored by Creative Nomad Studios)"
  },
  {
    date: "Wednesday, June 26",
    title: "Startup Orillia Coworking Day",
    description: "Another fantastic session of coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios, 23 Mississaga Street West Orillia, ON L3V 3A5",
    cost: "Free! (Sponsored by Creative Nomad Studios)"
  }
];

export const getNextMeetup = (): Event | null => {
  return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
}; 