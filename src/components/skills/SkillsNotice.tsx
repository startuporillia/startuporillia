import { Info } from "lucide-react";

const SkillsNotice = () => (
  <div className="rounded-2xl border border-brand-teal/20 bg-brand-teal/5 p-5 flex gap-3 text-sm leading-relaxed text-muted-foreground">
    <Info className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
    <p>
      Startup Orillia MCP uses periodically refreshed, publicly available Orillia &amp; District Chamber of Commerce data. For the most accurate and up-to-date business and event information, visit the <a href="https://business.orillia.com/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-primary">official Chamber website</a>. Chamber membership is not an endorsement or quality rating.
    </p>
  </div>
);

export default SkillsNotice;
