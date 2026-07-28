import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarClock, ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroArt from "@/assets/ai-hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkAssist AI" },
      {
        name: "description",
        content:
          "AI Workplace Productivity Assistant with a Smart Email Generator, Meeting Notes Summarizer, and AI Task Planner.",
      },
      { property: "og:title", content: "Dashboard — WorkAssist AI" },
      {
        property: "og:description",
        content: "Draft emails, summarize meetings, and plan your day with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft professional emails in the right tone from a few key points.",
    icon: Mail,
    to: "/email" as const,
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw meeting notes into a structured recap with action items.",
    icon: FileText,
    to: "/notes" as const,
  },
  {
    title: "AI Task Planner",
    description: "Prioritize your tasks into a realistic daily or weekly schedule.",
    icon: CalendarClock,
    to: "/planner" as const,
  },
];

const highlights = [
  { icon: Zap, label: "Instant drafts", detail: "Results in seconds" },
  { icon: ShieldCheck, label: "No invented facts", detail: "Grounded in your input" },
  { icon: Sparkles, label: "Fully editable", detail: "Refine before you send" },
];

function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <section className="glass-card relative mb-10 overflow-hidden px-6 py-10 md:px-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-soft)]" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Workplace Productivity Assistant
            </div>
            <h2 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
              Do more of your <span className="gradient-text">best work.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              A premium AI workspace for writing, summarizing, and planning. Pick a tool to get
              started — your work stays in this session and is never saved.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="gradient-surface rounded-xl border-0 text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[var(--shadow-lift)]"
              >
                <Link to="/email">
                  Start writing
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl bg-background/60 backdrop-blur transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link to="/planner">Plan my day</Link>
              </Button>
            </div>
          </div>
          <img
            src={heroArt}
            alt="Abstract 3D illustration of glass panels, gradient ribbons and an AI neural network"
            width={1200}
            height={912}
            className="mx-auto w-full max-w-md drop-shadow-xl"
          />
        </div>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.label} className="glass-card flex items-center gap-3 px-4 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gradient-soft)] text-primary">
              <h.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{h.label}</p>
              <p className="text-xs text-muted-foreground">{h.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group">
            <Card className="glass-card hover-lift relative h-full overflow-hidden border-0 shadow-none">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 bg-[var(--gradient-soft)] group-hover:opacity-100" />
              <CardHeader className="relative">
                <div className="gradient-surface flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:scale-105">
                  <tool.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-4 text-lg">{tool.title}</CardTitle>
                <CardDescription className="leading-relaxed">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <span className="inline-flex items-center text-sm font-semibold text-primary">
                  Open
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
