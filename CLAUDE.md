# Startup Orillia Website

React + Vite + TypeScript SPA deployed to GitHub Pages.

## Stack

- **Build**: Vite
- **UI**: React 18, Tailwind CSS, shadcn/ui (Radix primitives)
- **Routing**: React Router DOM
- **Date logic**: date-fns
- **Deploy**: `npm run deploy` (gh-pages)

## Events / Meetup System

### How it works

Recurring coworking days are **auto-generated** in `src/lib/events.ts`. The function `generateUpcomingCoworkingDays(3)` computes the last Tuesday of each month using date-fns and always produces the next 3 upcoming events from today's date. No manual editing is needed for the regular monthly schedule.

- `upcomingEvents` — auto-generated, always current
- `pastEvents` — static array of historical events (pre-recurring schedule)
- `getNextMeetup()` — returns the first upcoming event, used by the hero card

### Key files

- `src/lib/events.ts` — event data, generation logic, and `Event` interface
- `src/components/sections/EventsSection.tsx` — upcoming + past event display, RSVP dialog
- `src/components/sections/HeroSection.tsx` — hero with next meetup card
- `src/components/sections/MeetupInfoSection.tsx` — general meetup info ("Last Tuesday of every month")

### Adding a one-off special event

To add a non-recurring event (e.g., Pitch Day), add it directly to the `upcomingEvents` array in `events.ts` alongside the generated ones:

```ts
export const upcomingEvents: Event[] = [
  // One-off event
  {
    date: "Saturday, March 15",
    title: "Startup Orillia Pitch Day",
    description: "...",
    time: "6:00 PM - 9:00 PM EST",
    location: "Creative Nomad Studios",
    cost: "Free!",
  },
  // Regular recurring meetups
  ...generateUpcomingCoworkingDays(3),
];
```

Move it to `pastEvents` once it's over, or remove it.

### Changing the recurring schedule

To change the day or frequency, edit the `generateUpcomingCoworkingDays` function and the `getLastTuesday` helper in `src/lib/events.ts`. The timezone label logic (`getTimezoneLabel`) assumes Eastern Time with Mar-Oct = EDT, Nov-Feb = EST.

## Build & Deploy

```sh
npm run dev      # local dev server
npm run build    # production build to dist/
npm run deploy   # build + deploy to GitHub Pages
```
