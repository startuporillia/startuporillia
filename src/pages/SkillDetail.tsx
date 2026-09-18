import { ArrowLeft, Bot, CheckCircle2, Database, Download, FileText, Users } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { strToU8, zipSync } from "fflate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SkillsNotice from "@/components/skills/SkillsNotice";
import { getSkill } from "@/lib/skills";

const SkillDetailPage = () => {
  const { slug } = useParams();
  const skill = getSkill(slug);
  if (!skill) return <Navigate to="/skills" replace />;

  const download = () => {
    const meta = JSON.stringify({ category: skill.category, version: skill.version, status: skill.status, author: skill.author, contributors: skill.contributors, tags: skill.tags, usesChamberData: skill.usesChamberData, title: skill.title, summary: skill.summary, exampleQuestions: skill.exampleQuestions, expectedOutput: skill.expectedOutput }, null, 2);
    const zipped = zipSync({ [`${skill.slug}/SKILL.md`]: strToU8(skill.raw), [`${skill.slug}/skill.meta.json`]: strToU8(`${meta}\n`) }, { level: 9 });
    const url = URL.createObjectURL(new Blob([zipped], { type: "application/zip" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${skill.slug}.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <div className="min-h-screen bg-background">
    <section className="border-b bg-gradient-to-b from-brand-cream to-background">
      <div className="container px-4 py-12 md:py-16"><div className="max-w-5xl mx-auto">
        <Link to="/skills" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"><ArrowLeft className="h-4 w-4" /> All skills</Link>
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
          <div><div className="flex flex-wrap gap-2 mb-5"><Badge className="capitalize bg-brand-orange hover:bg-brand-orange">{skill.category}</Badge><Badge variant="outline">{skill.status} · v{skill.version}</Badge>{skill.usesChamberData && <Badge variant="outline" className="text-brand-teal border-brand-teal/30"><Database className="h-3.5 w-3.5 mr-1" /> Local context</Badge>}</div><h1 className="mb-5">{skill.title}</h1><p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">{skill.description}</p></div>
          <Button onClick={download} size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white"><Download className="h-4 w-4" /> Download skill</Button>
        </div>
      </div></div>
    </section>
    <div className="container px-4 py-12 md:py-16"><div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_280px] gap-10">
      <main className="space-y-10">
        <section><div className="flex items-center gap-3 mb-4"><Bot className="h-5 w-5 text-brand-orange" /><h2 className="text-2xl">What it does</h2></div><p className="text-muted-foreground leading-relaxed">{skill.summary}</p></section>
        <section><div className="flex items-center gap-3 mb-4"><Users className="h-5 w-5 text-brand-teal" /><h2 className="text-2xl">Try asking</h2></div><div className="space-y-3">{skill.exampleQuestions.map((question) => <div key={question} className="rounded-xl border bg-card px-5 py-4 text-sm">“{question}”</div>)}</div></section>
        <section><div className="flex items-center gap-3 mb-4"><CheckCircle2 className="h-5 w-5 text-brand-orange" /><h2 className="text-2xl">Expected output</h2></div><p className="text-muted-foreground leading-relaxed">{skill.expectedOutput}</p></section>
        <section><div className="flex items-center justify-between gap-4 mb-4"><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-brand-teal" /><h2 className="text-2xl">Raw SKILL.md</h2></div><button onClick={() => navigator.clipboard.writeText(skill.raw)} className="text-sm text-brand-orange hover:underline">Copy</button></div><pre className="rounded-2xl border bg-primary text-primary-foreground p-5 overflow-x-auto text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{skill.raw}</pre></section>
        <SkillsNotice />
      </main>
      <aside className="space-y-5">
        <div className="rounded-2xl border bg-card p-6 sticky top-24"><h3 className="font-heading font-semibold text-lg mb-4">Skill details</h3><dl className="space-y-4 text-sm"><div><dt className="text-muted-foreground">Author</dt><dd className="font-medium mt-1">{skill.author}</dd></div><div><dt className="text-muted-foreground">Contributors</dt><dd className="font-medium mt-1">{skill.contributors.length ? skill.contributors.join(", ") : "No additional contributors yet"}</dd></div><div><dt className="text-muted-foreground">Version</dt><dd className="font-medium mt-1">{skill.version}</dd></div><div><dt className="text-muted-foreground">Local data</dt><dd className="font-medium mt-1">{skill.usesChamberData ? "Optional local context" : "Not required"}</dd></div></dl><hr className="my-5" /><Link to="/skills/connect" className="text-sm text-brand-orange font-medium hover:underline">Platform setup instructions →</Link></div>
      </aside>
    </div></div>
  </div>;
};

export default SkillDetailPage;
