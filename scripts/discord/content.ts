/**
 * Message copy for the Startup Orillia Discord server.
 *
 * Voice notes (derived from startuporillia.ca — see src/components/sections/*):
 *   - Short declarative fragments. "Show up. Work together. Ship."
 *   - Define by contrast: "You leave with the work, not a notebook."
 *   - Concrete over abstract. No hype words, no exclamation marks, no emoji in body copy.
 *   - Low-ceremony and permission-granting: "No need to sign up — just show up."
 *
 * Channel mentions are templated because IDs only exist after the channels do.
 */

/** Channel-name → snowflake, filled in at apply time. */
export type ChannelIds = Record<string, string>;

const SITE_URL = "https://startuporillia.ca";
const LUMA_URL = "https://lu.ma/startuporillia";
const YOUTUBE_URL = "https://www.youtube.com/@startuporillia";
const WHATSAPP_URL = "https://chat.whatsapp.com/LndY1VnetIrE8IgBUtbU9F";
const VENUE = "Creative Nomad Studios, 23 Mississaga St W";

function mention(ids: ChannelIds, name: string): string {
  const id = ids[name];
  return id ? `<#${id}>` : `#${name}`;
}

export interface PinnedMessage {
  /** Channel name the message belongs in. */
  channel: string;
  body: (ids: ChannelIds) => string;
}

/**
 * Re-runs locate a prior starter message by (channel, author = this bot) among
 * the channel's pins. Discord has no HTML comments, so an invisible marker
 * would render as literal text — authorship is the reliable signal instead.
 */
export const PINNED_MESSAGES: PinnedMessage[] = [
  {
    channel: "welcome",
    body: (ids) => `## Startup Orillia

Orillia's working community of founders and builders.
**Show up. Work together. Ship.**

This server is where the work continues between meetups.

**Who this is for**
Anyone building something — founders, freelancers, developers, designers, makers, students, and the curious. You don't need a startup, funding, or a title. You need something you're working on, or the honest intent to start.

**Where things go**
${mention(ids, "introductions")} — who you are and what you're building
${mention(ids, "building")} — the heart of it. Progress, demos, launches, questions, things that broke
${mention(ids, "general")} — everything else
${mention(ids, "events")} — meetups, workshops, coworking, recordings

**The in-person part**
Coworking Day runs the last Tuesday of every month, 9:00 AM – 1:00 PM, at ${VENUE}. Free. No need to sign up — just show up.

**About the WhatsApp group**
It's still there, and it's still where quick day-to-day chat happens: [join it here](${WHATSAPP_URL}). This server is where the work gets shown — demos, progress, and getting unstuck between meetups. Use whichever fits what you're doing.

**House rules**
Be generous. Be constructive. Critique the idea, not the person.
Share what you're working on, including the parts that aren't working.
No spam. No unsolicited mass DMs.
Respect confidentiality when someone shares something sensitive.
**No sales pitches. That's the one hard rule.**

Organizers will moderate anything that undermines the room.

${SITE_URL}`,
  },
  {
    channel: "introductions",
    body: () => `## Start here

Four lines is plenty.

**Name**
**What you're building**
**One thing you can help with**
**One thing you're looking for**

Specific beats abstract. "Building a scheduling tool for trades, stuck on pricing" gets you further than "interested in tech."

If you're not building anything yet, say so. "Curious, poking at an idea" is a real answer — the curious are explicitly welcome here.

Read a few intros before you post. Reply to someone whose work you find interesting. That's how this starts working.`,
  },
  {
    channel: "building",
    body: () => `## This is the heart of the server

Post what you're actually doing:

- progress and screenshots
- launches and demos
- something you shipped this week
- a problem you're stuck on
- what you learned from a customer interview
- an AI workflow that saved you hours
- an experiment that failed, and why

Concrete beats abstract. Show the thing.

The best posts answer: *"Here's something I did recently that made me think — everyone else should know about this."*

**If you're stuck**, say what you already tried. You'll get better help.
**If you're sharing a win**, say what was hard about it. That's the useful part.

Use a thread to go deep on a reply so the channel stays readable.`,
  },
  {
    channel: "events",
    body: (ids) => `## What's on

**Coworking Day — last Tuesday of every month**
9:00 AM – 1:00 PM · ${VENUE} · Free
Coffee, coworking, and conversation. Bring your laptop and ship something.
No need to sign up — just show up.

Check the **Events** tab at the top of the server for the next date.

**Mini talks**
Five to ten minutes on something you actually did. Practical and recent. Show examples, demos, before/after — specific beats abstract.
No sales pitches. That's the one hard rule.
Want the mic? Post in this channel before the meetup so we know who's speaking.

**Workshops**
Practitioner-led half-day intensives taught by senior operators. You leave with the work, not a notebook.
Nothing on the calendar right now — new dates get posted here.

**After a meetup**, keep the conversation going in this channel. Post what you saw, what you're stealing, what you want next time.

Full calendar: ${LUMA_URL}
Recorded talks: ${YOUTUBE_URL}
Everything else: ${SITE_URL}

Voice rooms are under **LIVE** — ${mention(ids, "general")} if you want someone to hop in.`,
  },
];

/** Server description shown on the discovery/invite surface (max 300 chars). */
export const GUILD_DESCRIPTION =
  "Orillia's working community of founders and builders. Show up. Work together. Ship.";

/** Welcome screen shown to people opening the invite. */
export const WELCOME_SCREEN_DESCRIPTION =
  "For people building interesting things in Orillia. Introduce yourself, share what you're working on, and come to the next meetup.";

export const WELCOME_SCREEN_CHANNELS: { channel: string; description: string; emoji: string }[] = [
  { channel: "welcome", description: "What this is and how it works", emoji: "👋" },
  { channel: "introductions", description: "Tell us what you're building", emoji: "🙋" },
  { channel: "building", description: "Progress, demos, and getting unstuck", emoji: "🔨" },
  { channel: "events", description: "Meetups, workshops, coworking", emoji: "📅" },
];

/** Channel topics (the short line under the channel name). */
export const CHANNEL_TOPICS: Record<string, string> = {
  welcome:
    "What Startup Orillia is, who it's for, and how this server works. Read-only.",
  introductions:
    "Name · what you're building · one thing you can help with · one thing you're looking for.",
  general: "Everything that doesn't belong elsewhere.",
  building:
    "Progress, screenshots, launches, demos, questions, customer interviews, AI workflows. Concrete beats abstract.",
  events:
    "Meetups, workshops, coworking days, mini talks, recordings. Conversation continues here after each meetup.",
  organizers: "Private channel for organizers. Also receives Discord's moderation notices.",
};
