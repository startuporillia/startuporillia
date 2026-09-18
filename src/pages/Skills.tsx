import { useMemo, useState } from "react";
import { ArrowRight, Bot, ClipboardCheck, Search, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { categories, skills } from "@/lib/skills";
import SkillsNotice from "@/components/skills/SkillsNotice";
import SkillsSetup from "@/components/skills/SkillsSetup";
import LocalDataExample, { EndToEndExample } from "@/components/skills/LocalDataExample";
import { downloadSkills } from "@/lib/skill-download";
import CopyPrompt from "@/components/skills/CopyPrompt";

const SkillsPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => skills.filter((skill) => {
    const haystack = `${skill.title} ${skill.summary} ${skill.tags.join(" ")}`.toLowerCase();
    return (category === "all" || skill.category === category) && haystack.includes(query.trim().toLowerCase());
  }), [category, query]);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-background to-background" />
        <div className="absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-brand-teal/5 blur-3xl" />
        <div className="relative container px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-orange uppercase tracking-wider mb-4"><Sparkles className="h-3.5 w-3.5" /> Startup Orillia AI Skills</span>
            <h1 className="text-primary mb-5">AI skills built for local business</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">Practical, reusable AI playbooks from Startup Orillia. Use them with the AI tools you already have.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <a href="#setup" className="btn-primary inline-flex items-center gap-2">Get started <ArrowRight className="h-4 w-4" /></a>
              <a href="#catalog" className="inline-flex items-center px-6 py-3 rounded-lg border bg-card hover:bg-secondary transition-colors font-medium">Browse the catalog</a>
            </div>
          </div>
        </div>
      </section>

      <LocalDataExample />

      <section className="container px-4 py-10 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-brand-teal font-medium mb-3">How it works</p>
            <h2 className="text-2xl md:text-3xl">Playbooks plus local context</h2>
            <p className="text-muted-foreground leading-relaxed mt-4 max-w-3xl">A skill is a reusable set of instructions that helps your AI work through a business task. Think of it as a practical playbook: it guides the questions to ask, the options to consider and the work to produce—not just a one-line prompt.</p>
            <p className="text-muted-foreground leading-relaxed mt-3 max-w-3xl">Use one to turn a slow-sales problem into a campaign, prepare talking points and follow-ups for a networking event, compare suppliers, or plan a small AI experiment. You can refine the result in conversation: “Choose the second idea,” “Draft the outreach,” or “Make this fit a $300 budget.”</p>
          </div>
          <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
            {[
              { icon: Users, eyebrow: "Your business problem", text: "“I’m opening a second location.”" },
              { icon: Bot, eyebrow: "Skill + local information", text: "Local Supplier Finder + real business listings" },
              { icon: ClipboardCheck, eyebrow: "Your action plan", text: "A shortlist of local suppliers, questions to ask and a next-step checklist" },
            ].map((item, index) => <div key={item.eyebrow} className="rounded-2xl border bg-card p-4 md:p-6">
              <item.icon className={`h-6 w-6 mb-3 md:mb-5 ${index === 1 ? "text-brand-orange" : "text-brand-teal"}`} />
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{item.eyebrow}</p>
              <p className="font-heading text-lg font-semibold leading-snug">{item.text}</p>
            </div>).flatMap((item, index, array) => index < array.length - 1 ? [item, <ArrowRight key={`arrow-${index}`} className="hidden md:block self-center h-5 w-5 text-muted-foreground" />] : [item])}
          </div>
          <EndToEndExample />
        </div>
      </section>

      <SkillsSetup />

      <section className="container px-4 pb-10 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl mb-3">Start with a real business problem</h2>
          <p className="text-muted-foreground mb-7">Tell your AI what you need help with. A skill guides the work; optional local context can make the results more useful.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { slug: "local-marketing-campaign", prompt: "I run a bakery. January weekdays are slow. Help me increase sales.", output: "Compare three campaign ideas, then turn your choice into draft messages, promotional wording and a 30-day plan.", followup: "Build idea #2. Who locally could help me run it?" },
              { slug: "networking-event-prep", prompt: "I'm going to a networking event. Help me prepare.", output: "Set a purpose, prepare a short introduction and conversation openers, and leave with a follow-up plan.", followup: "Give me a checklist I can keep on my phone." },
              { slug: "ai-opportunity-audit", prompt: "We spend too much time on admin. Where could AI help?", output: "Choose one task to test with AI. Set a time-saving goal and decide who will check the work.", followup: "Build a one-week test for the best option." },
            ].map((example) => <article key={example.slug} className="rounded-2xl border bg-card p-4 md:p-6 flex flex-col"><h3 className="font-heading text-lg font-semibold mb-3">“{example.prompt}”</h3><p className="text-sm text-muted-foreground leading-relaxed mb-3">{example.output}</p><p className="text-sm mb-4"><span className="text-muted-foreground">Then ask: </span>“{example.followup}”</p><div className="mt-auto flex flex-wrap items-center gap-3"><CopyPrompt text={`Use Startup Orillia to find and read the right skill for this: ${example.prompt}`} /><Link to={`/skills/${example.slug}`} className="text-sm font-medium text-brand-orange hover:underline">Explore this skill →</Link></div></article>)}
          </div>
        </div>
      </section>

      <section id="catalog" className="container px-4 pb-12 md:pb-20 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
            <div><p className="text-xs uppercase tracking-wider text-brand-orange font-medium mb-3">Open catalog</p><h2 className="text-2xl md:text-3xl">Practical skills you can take with you</h2></div>
            <p className="text-sm text-muted-foreground max-w-md">Made by Startup Orillia. Every skill works on its own and can use local information when available.</p>
          </div>
          <div className="grid md:grid-cols-[1fr_auto] gap-3 mb-5">
            <label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills by task" className="pl-10 bg-card" /><span className="sr-only">Search skills</span></label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["all", ...categories].map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`px-3.5 py-2 rounded-lg border text-sm capitalize whitespace-nowrap transition-colors ${category === item ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-secondary"}`}>{item === "ai" ? "AI" : item}</button>)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-5">{filtered.length} {filtered.length === 1 ? "skill" : "skills"}</p>
          <p className="text-sm text-muted-foreground mb-5">These skills are being tested and improved. Review the results before acting.</p>
          <div className="mb-6 flex flex-wrap items-center gap-3"><button onClick={() => downloadSkills(skills, "startup-orillia-ai-skills.zip")} className="rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary">Download all skills</button><p className="text-sm text-muted-foreground">For manual installation. No download needed when you <a href="#setup" className="text-brand-orange underline">connect your AI tool</a>.</p></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((skill) => <Link to={`/skills/${skill.slug}`} key={skill.slug} className="group rounded-2xl border bg-card p-6 hover:border-brand-orange/30 hover:-translate-y-1 transition-all">
              <div className="mb-4"><Badge variant="secondary" className="capitalize">{skill.category === "ai" ? "AI" : skill.category}</Badge></div>
              <h3 className="font-heading font-semibold text-xl mb-2 group-hover:text-brand-orange transition-colors">{skill.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{skill.summary}</p>
            </Link>)}
          </div>
          {!filtered.length && <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No skills match that search.</div>}
        </div>
      </section>

      <section className="container px-4" aria-labelledby="meetup-invitation">
        <div className="max-w-5xl mx-auto rounded-2xl border border-brand-teal/20 bg-brand-teal/5 p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-brand-teal font-medium mb-3">Free monthly meetups</p>
            <h2 id="meetup-invitation" className="text-2xl md:text-3xl mb-4">You don’t have to figure it out alone</h2>
            <p className="text-muted-foreground leading-relaxed">Bring your questions to a Startup Orillia meetup. Meet local business owners, share what you’re trying and get help from the community. Whether you’re just starting with AI or have something to share, you’re welcome. No technical experience needed.</p>
          </div>
          <Link to="/meetup" className="btn-primary inline-flex items-center justify-center gap-2 shrink-0 self-start md:self-center">Find the next meetup <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
      </section>
      <section className="container px-4 py-10"><div className="max-w-5xl mx-auto"><SkillsNotice /></div></section>
    </div>
  );
};

export default SkillsPage;
