import { ArrowLeft, Check, Code2, Database, Download, ExternalLink, GitPullRequest, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import SkillsNotice from "@/components/skills/SkillsNotice";
import McpUrlBox from "@/components/skills/McpUrlBox";

const MCP_URL = "https://startuporillia.ca/mcp";
const platforms = [
  { name: "Claude", status: "Direct skill upload", body: <>Download a skill ZIP. In Claude, enable code execution/file creation if required, open <strong>Customize → Skills</strong>, choose <strong>+ Create skill → Upload a skill</strong>, and upload the ZIP. Workspace controls can affect availability.</>, link: "https://support.claude.com/en/articles/12512180-use-skills-in-claude" },
  { name: "ChatGPT / OpenAI", status: "API and plugin workflows", body: <>OpenAI's Skills API accepts a skill ZIP or directory for agent environments. For ChatGPT, use a workspace plugin or supported skill workflow available to your account; product access can differ. The Startup Orillia MCP can be added as a custom app in ChatGPT developer mode by providing the endpoint.</>, link: "https://developers.openai.com/api/reference/python/resources/skills/methods/create" },
  { name: "Microsoft Copilot", status: "Copilot Studio or VS Code", body: <>Copilot Studio agents can import a <code>SKILL.md</code> or ZIP. GitHub Copilot in VS Code discovers skill folders from locations such as <code>.github/skills/</code> or <code>.agents/skills/</code>; copy the unzipped skill directory there.</>, link: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-overview" },
];

const ConnectPage = () => <div className="min-h-screen bg-background">
  <section className="border-b bg-gradient-to-b from-brand-cream to-background"><div className="container px-4 py-12 md:py-16"><div className="max-w-5xl mx-auto"><Link to="/skills" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"><ArrowLeft className="h-4 w-4" /> AI Skills</Link><div className="max-w-3xl"><p className="text-xs uppercase tracking-wider text-brand-orange font-medium mb-3">Connect</p><h1 className="mb-5">Use a skill. Add local context.</h1><p className="text-lg text-muted-foreground leading-relaxed">Skills provide the practical playbook. The optional Startup Orillia MCP gives compatible AI tools read-only access to a monthly snapshot of publicly available Orillia &amp; District Chamber business information.</p></div></div></div></section>

  <section className="container px-4 py-14 md:py-20"><div className="max-w-5xl mx-auto">
    <div className="flex items-center gap-3 mb-7"><Download className="h-6 w-6 text-brand-orange" /><h2 className="text-2xl md:text-3xl">Use a skill</h2></div>
    <p className="text-muted-foreground max-w-3xl mb-8">Support is not identical across products. Download a ZIP from any skill page, then use the instructions for your tool and account.</p>
    <div className="grid lg:grid-cols-3 gap-4">{platforms.map((platform) => <article key={platform.name} className="rounded-2xl border bg-card p-6 flex flex-col"><div className="mb-5"><h3 className="font-heading text-xl font-semibold mb-2">{platform.name}</h3><Badge variant="secondary">{platform.status}</Badge></div><p className="text-sm text-muted-foreground leading-relaxed flex-1">{platform.body}</p><a href={platform.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brand-orange font-medium mt-5">Official instructions <ExternalLink className="h-3.5 w-3.5" /></a></article>)}</div>
  </div></section>

  <section className="border-y bg-secondary/20"><div className="container px-4 py-14 md:py-20"><div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
    <div><div className="flex items-center gap-3 mb-6"><Database className="h-6 w-6 text-brand-teal" /><h2 className="text-2xl md:text-3xl">Connect local business data</h2></div><p className="text-muted-foreground leading-relaxed mb-5">Add this public Streamable HTTP endpoint to a compatible MCP client. It is stateless, read-only, and searches a cached snapshot.</p><McpUrlBox url={MCP_URL} /><div className="mt-5 flex items-start gap-3 text-sm text-muted-foreground"><ShieldCheck className="h-5 w-5 text-brand-teal shrink-0" /><p>No authentication is required in v1. Clients may warn you before connecting to a third-party MCP server; review the endpoint and its read-only tools before enabling it.</p></div></div>
    <div className="rounded-2xl border bg-card p-6 md:p-8"><h3 className="font-heading text-xl font-semibold mb-5">Try these prompts</h3><div className="space-y-3">{["Find Chamber businesses that could help me organize a grand opening.","I own a gym. Find complementary Chamber members I could create referral partnerships with.","Help me create a holiday campaign using two relevant local partners.","Who locally could help my company with IT support, signage and bookkeeping?"].map((prompt) => <div key={prompt} className="flex gap-3 text-sm"><Check className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" /><span>“{prompt}”</span></div>)}</div></div>
  </div></div></section>

  <section id="contribute" className="container px-4 py-14 md:py-20 scroll-mt-24"><div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10">
    <div><div className="flex items-center gap-3 mb-6"><GitPullRequest className="h-6 w-6 text-brand-orange" /><h2 className="text-2xl md:text-3xl">Contribute a skill</h2></div><p className="text-muted-foreground leading-relaxed mb-5">Git is the publishing workflow. Propose a skill folder with a valid <code>SKILL.md</code> and catalog metadata through the Startup Orillia repository.</p><a href="https://github.com/startuporillia/startuporillia" target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2"><Code2 className="h-4 w-4" /> Open the repository</a></div>
    <div className="rounded-2xl border bg-card p-6 md:p-8"><h3 className="font-heading text-xl font-semibold mb-4">Contribution standard</h3><ul className="space-y-3 text-sm text-muted-foreground">{["Teach reusable expertise that remains useful regardless of who contributed it.","Gather only essential context and define a measurable outcome.","Use Chamber data when available, but work correctly without it.","Never invent businesses; separate sourced facts from generated ideas.","End with concrete next actions and make promotional bias visible.","Do not disguise advertising as instruction."].map((item) => <li key={item} className="flex gap-3"><Check className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />{item}</li>)}</ul></div>
  </div></section>
  <section className="container px-4 pb-14"><div className="max-w-5xl mx-auto"><SkillsNotice /></div></section>
</div>;

export default ConnectPage;
