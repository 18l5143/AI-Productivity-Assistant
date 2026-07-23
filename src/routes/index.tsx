import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarClock, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    accent: "from-blue-500/10 to-blue-500/0",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw meeting notes into a structured recap with action items.",
    icon: FileText,
    to: "/notes" as const,
    accent: "from-emerald-500/10 to-emerald-500/0",
  },
  {
    title: "AI Task Planner",
    description: "Prioritize your tasks into a realistic daily or weekly schedule.",
    icon: CalendarClock,
    to: "/planner" as const,
    accent: "from-violet-500/10 to-violet-500/0",
  },
];

function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <section className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          AI Workplace Productivity Assistant
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Do more of your best work.
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick a tool below to get started. Your work stays in this session — nothing is saved.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group">
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden">
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.accent}`}
              />
              <CardHeader className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <tool.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button variant="ghost" size="sm" className="px-0 text-primary">
                  Open
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
