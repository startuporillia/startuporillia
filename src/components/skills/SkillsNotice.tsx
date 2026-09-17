import { Info } from "lucide-react";

const SkillsNotice = () => (
  <div className="rounded-2xl border border-brand-teal/20 bg-brand-teal/5 p-5 flex gap-3 text-sm leading-relaxed text-muted-foreground">
    <Info className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
    <p>
      Chamber membership is not an endorsement or quality rating. Business and event information is based on a periodically refreshed snapshot of publicly available Orillia &amp; District Chamber of Commerce information. Visit the original Chamber listing for the latest official information.
    </p>
  </div>
);

export default SkillsNotice;
