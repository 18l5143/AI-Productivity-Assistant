import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, RefreshCw, Loader2, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { ToolPageHeader } from "@/components/tool-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkAssist AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a structured summary with decisions, action items, and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Structured recaps from your raw meeting notes.",
      },
    ],
  }),
  component: NotesPage,
});

const SYSTEM_PROMPT = `You are an expert meeting notes summarizer. Read the raw meeting notes provided by the user and produce a clear, structured summary.

STRICT RULES:
- Do NOT invent facts, names, dates, numbers, or details that are not in the notes.
- If a section has no information in the notes, write "None mentioned." for that section.
- Do not add opinions, recommendations, or commentary beyond what the notes say.

Format the output EXACTLY like this, using Markdown headings:

## Summary
<2-4 sentence overview>

## Key Discussion Points
- <point>
- <point>

## Decisions
- <decision>

## Action Items
- <owner (if mentioned)>: <action>

## Deadlines
- <deadline or date>: <what is due>`;

function NotesPage() {
  const call = useServerFn(generateAI);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await call({
        data: { system: SYSTEM_PROMPT, user: `Meeting notes:\n\n${notes.trim()}` },
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize notes.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Summary copied to clipboard.");
  };

  return (
    <AppShell title="Meeting Notes Summarizer">
      <ToolPageHeader icon={FileText} title="Meeting Notes Summarizer" description="Paste raw notes and get a structured summary with decisions, action items, and deadlines." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card border-0 shadow-none">
          <CardHeader>
            <CardTitle>Raw meeting notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Paste your notes</Label>
              <Textarea
                id="notes"
                placeholder="Paste raw meeting notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={16}
                maxLength={20000}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="gradient-surface rounded-xl border-0 text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[var(--shadow-lift)]" onClick={generate} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Summarize"}
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setNotes("");
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
            <CardTitle>Structured summary</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copy} disabled={!output}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={generate} disabled={loading || !notes.trim()}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your structured summary will appear here. You can edit it before copying."
              rows={20}
              className="rounded-xl bg-background/60 font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
