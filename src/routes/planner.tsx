import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, RefreshCw, Loader2, CalendarClock, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generateAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkAssist AI" },
      {
        name: "description",
        content:
          "Prioritize your tasks into a realistic daily or weekly schedule based on your deadlines and working hours.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Turn your task list into a realistic AI-prioritized schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

const SYSTEM_PROMPT = `You are an expert productivity planner. Build a realistic, prioritized schedule from the user's tasks, deadlines, and available working hours.

STRICT RULES:
- Use ONLY the tasks, deadlines, and working hours provided. Do NOT invent tasks, meetings, breaks, or details the user didn't include.
- Prioritize by deadline urgency and reasonable effort.
- Respect the requested schedule type (Daily or Weekly).
- Fit tasks within the available working hours; if there isn't enough time, say so at the end under "Notes".
- Do not add commentary beyond the schedule and notes.

Format the output EXACTLY like this, using Markdown:

## <Daily or Weekly> Schedule

### <Day label, e.g. "Monday" for Weekly, or "Today" for Daily>
- <time range> — <task> (deadline: <deadline if given, else "—">)
- ...

(Repeat per day for a Weekly schedule.)

## Priority Rationale
- <short bullet explaining ordering>

## Notes
- <capacity warnings, unscheduled tasks, or "All tasks fit within available hours.">`;

function PlannerPage() {
  const call = useServerFn(generateAI);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("");
  const [scheduleType, setScheduleType] = useState<"Daily" | "Weekly">("Daily");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!tasks.trim() || !hours.trim()) {
      toast.error("Please add tasks and available working hours.");
      return;
    }
    setLoading(true);
    try {
      const user = `Schedule type: ${scheduleType}\n\nAvailable working hours:\n${hours.trim()}\n\nTasks (with deadlines if known):\n${tasks.trim()}`;
      const { content } = await call({ data: { system: SYSTEM_PROMPT, user } });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to build schedule.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Schedule copied to clipboard.");
  };

  return (
    <AppShell title="AI Task Planner">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CalendarClock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Task Planner</h2>
          <p className="text-sm text-muted-foreground">
            List your tasks, deadlines, and hours — get a realistic prioritized schedule.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card border-0 shadow-none">
          <CardHeader>
            <CardTitle>Your plan inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks &amp; deadlines</Label>
              <Textarea
                id="tasks"
                placeholder={"- Finish Q3 report — due Friday (est. 4h)\n- Prepare client deck — due Wed 5pm (est. 3h)\n- Reply to product feedback emails (est. 1h)"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={8}
                maxLength={5000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Available working hours</Label>
              <Input
                id="hours"
                placeholder="e.g. Mon-Fri 9am–1pm and 2pm–5pm"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                maxLength={300}
              />
            </div>
            <div className="space-y-2">
              <Label>Schedule type</Label>
              <RadioGroup
                value={scheduleType}
                onValueChange={(v) => setScheduleType(v as "Daily" | "Weekly")}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Daily" id="daily" />
                  <Label htmlFor="daily" className="font-normal">Daily</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Weekly" id="weekly" />
                  <Label htmlFor="weekly" className="font-normal">Weekly</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button className="gradient-surface rounded-xl border-0 text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[var(--shadow-lift)]" onClick={generate} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Build schedule"}
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setTasks("");
                  setHours("");
                  setOutput("");
                }}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Your schedule</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copy} disabled={!output}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={generate}
                disabled={loading || !tasks.trim() || !hours.trim()}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your schedule will appear here. You can edit it before copying."
              rows={22}
              className="rounded-xl bg-background/60 font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
