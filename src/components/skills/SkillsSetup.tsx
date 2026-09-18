import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import McpUrlBox from "./McpUrlBox";
import CopyPrompt from "./CopyPrompt";

const starterPrompt = "Use Startup Orillia to find and read the right skill for this: I run a bakery in Orillia and January weekday sales are slow. Help me compare three campaign ideas, using relevant local businesses where useful.";

const platforms = [
  {
    id: "claude", name: "Claude", note: "Custom connectors are available on supported paid plans. Team and Enterprise owners may need to add the connection first.",
    steps: ["Open Customize → Connectors. Choose +, then Add custom connector.", "Name it Startup Orillia and paste the connection address below. Add the connector; our service does not require a login or API key.", "Start a conversation and enable Startup Orillia in the connectors menu. Try the prompt below."],
    url: "https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp",
  },
  {
    id: "chatgpt", name: "ChatGPT", note: "Requires access to custom MCP connections and developer mode. Your account or workspace administrator may restrict these options.",
    steps: ["Open Settings → Security and login and enable Developer mode.", "Open ChatGPT Plugins, select +, and name the connection Startup Orillia. Under Connection, enter the address below and create the connection. Review the available tools; no login to our service is needed.", "Start a new conversation and add Startup Orillia from the tools menu. Try the prompt below."],
    url: "https://developers.openai.com/plugins/deploy/connect-chatgpt",
  },
  {
    id: "copilot", name: "Microsoft Copilot", note: "This setup uses Copilot Studio, which lets your team create its own AI assistant. It is not a setting in everyday Copilot chat. Ask the person who manages your Microsoft tools to help.",
    steps: ["In Copilot Studio, ask your administrator to set up a custom MCP connection using the address below (choose Streamable HTTP if asked; no login required).", "On the agent’s Tools page, choose Add a tool → Model Context Protocol and select the configured connection. Add and configure it, leaving the tools for finding skills and searching local information switched on.", "Test the prompt below in the agent, then publish or share the agent with your team when ready."],
    url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-components-to-agent",
  },
];

export default function SkillsSetup() {
  return <section id="setup" className="container px-4 pb-10 md:pb-16 scroll-mt-24">
    <div className="max-w-5xl mx-auto rounded-2xl border bg-card p-6 md:p-8">
      <p className="text-xs uppercase tracking-wider text-brand-orange font-medium mb-3">Get started</p>
      <h2 className="text-2xl md:text-3xl mb-4">Connect once. Find the right skill as you go.</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">The recommended starting point, if your AI tool supports it, is the Startup Orillia MCP. It lets your AI browse our skill library, read a playbook for your task, and look up local businesses and events—without downloading each skill yourself.</p>
      <details className="mb-6 rounded-lg border p-4">
        <summary className="cursor-pointer font-heading text-lg font-semibold">What is MCP?</summary>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">MCP stands for Model Context Protocol. Think of it as a connection between your AI assistant and an information service. Our connection supplies playbooks and local information; your AI uses them to help you plan and create. It can only read information: it cannot send emails, register for events or change business records. You review the results and decide what happens next.</p>
      </details>
      <p className="font-medium mb-3">Choose your AI tool</p>
      <Tabs defaultValue="claude">
        <TabsList aria-label="AI tool setup" className="h-auto flex flex-wrap justify-start gap-1">
          {platforms.map((platform) => <TabsTrigger key={platform.id} value={platform.id}>{platform.name}</TabsTrigger>)}
        </TabsList>
        {platforms.map((platform) => <TabsContent key={platform.id} value={platform.id} className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">{platform.note}</p>
          <div className="space-y-6">
            <div><h3 className="font-medium mb-3">1. Copy the connection address</h3><McpUrlBox url="https://startuporillia.ca/mcp" /></div>
            <div><h3 className="font-medium mb-3">2. Add the connection</h3><div className="space-y-3 text-sm leading-relaxed">{platform.steps.slice(0, 2).map((step) => <p key={step}>{step.replace("address below", "address above")}</p>)}</div></div>
            <div><h3 className="font-medium mb-3">3. Try a question</h3><p className="text-sm leading-relaxed mb-3">{platform.steps[2]}</p><blockquote className="rounded-lg bg-secondary p-4 text-sm leading-relaxed mb-3">{starterPrompt}</blockquote><CopyPrompt text={starterPrompt} /><p className="text-sm text-muted-foreground mt-3">Then try: “Build idea #2. Give me the offer, draft messages, a 30-day plan and a way to measure results.” If your AI has not used the connection, ask it to list Startup Orillia’s skills and read the right one first.</p></div>
          </div>
          <a href={platform.url} target="_blank" rel="noreferrer" className="inline-block text-sm text-brand-orange underline mt-4">Official {platform.name} setup guide</a>
        </TabsContent>)}
      </Tabs>
      <p className="text-sm text-muted-foreground mt-5">The connection reads playbooks when needed; it does not install them permanently in your AI tool. Local business information currently comes from a saved copy, updated regularly, of publicly available <a href="https://business.orillia.com/" target="_blank" rel="noreferrer" className="underline">Orillia &amp; District Chamber of Commerce information</a>. Check original listings for current details.</p>
      <details className="border-t mt-6 pt-5"><summary className="cursor-pointer font-medium">No connection option? Use a skill without MCP</summary><div className="text-sm text-muted-foreground space-y-3 mt-4"><p>Open a skill in the catalog, copy its full instructions, and paste them into your AI conversation with your business problem. Ask your AI to follow the playbook. Without a local-data connection, provide any business or event links you want it to use.</p><p>You can also download individual skill ZIPs, or the whole collection below. In Claude’s supported Skills workflow, use Customize → Skills → + Create skill → Upload a skill. The collection ZIP contains separate folders; it is not a universal one-click installer.</p><p>For people using AI coding tools: this command installs the collection from our GitHub project.</p><pre className="overflow-x-auto bg-secondary rounded-lg p-3">npx skills add startuporillia/startuporillia --skill '*'</pre><a href="https://github.com/vercel-labs/skills" className="underline" target="_blank" rel="noreferrer">Skills CLI instructions</a></div></details>
    </div>
  </section>;
}
