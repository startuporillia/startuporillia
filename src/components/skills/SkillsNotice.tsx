import { Info } from "lucide-react";

const SkillsNotice = () => (
  <div className="rounded-2xl border border-brand-teal/20 bg-brand-teal/5 p-5 flex gap-3 text-sm leading-relaxed text-muted-foreground">
    <Info className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
    <p>
      Local business information comes from publicly available Orillia &amp; District Chamber of Commerce listings. Visit the <a href="https://business.orillia.com/list" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-primary">official directory</a> for the latest details.
    </p>
  </div>
);

export default SkillsNotice;
