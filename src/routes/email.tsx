import { useServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Trash2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { ToolPageHeader } from "@/components/tool-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkAssist AI" },
      {
        name: "description",
        content: "Generate professional emails in your chosen tone from a few key points.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft polished emails with AI in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

const SYSTEM_PROMPT = `You are a professional email writing assistant. Write a clear, well-structured email based ONLY on the information the user provides.

STRICT RULES:
- Do NOT invent facts, names, dates, numbers, links, or details the user did not provide.
- If a subject, recipient, or sender name is not provided, use a neutral placeholder like [Recipient Name] or [Your Name].
- Match the requested tone exactly (Formal, Friendly, or Persuasive).
- Keep it concise and appropriate for professional use.
- Format the output as a ready-to-send email with:
  Subject: <subject line>
  <blank line>
  <email body with greeting, body paragraphs, and sign-off>
- Do not include commentary, options, or explanations — only the email itself.`;

function EmailPage() {
  const call = useServerFn(generateAI);
  const [topic, setTopic] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const buildUserPrompt = () =>
    `Tone: ${tone}\n\nWhat the email is about:\n${topic.trim()}\n\nKey points to include:\n${points.trim()}`;

  const generate = async () => {
    if (!topic.trim() || !points.trim()) {
      toast.error("Please fill in both fields before generating.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await call({ data: { system: SYSTEM_PROMPT, user: buildUserPrompt() } });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Email copied to clipboard.");
  };

  const clear = () => {
    setTopic("");
    setPoints("");
    setOutput("");
  };

  return (
    <AppShell title="Smart Email Generator">
      <ToolPageHeader icon={Mail} title="Smart Email Generator" description="Give a topic, some key points, and a tone. Get a ready-to-send email." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">What is the email about?</Label>
              <Input
                id="topic"
                placeholder="e.g. Following up on last week's proposal"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={300}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                placeholder="- Recap the main proposal points&#10;- Ask for feedback by Friday&#10;- Offer to schedule a call"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                rows={8}
                maxLength={2000}
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button className="gradient-surface rounded-xl border-0 text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[var(--shadow-lift)]" onClick={generate} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate email"}
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={clear} disabled={loading}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Generated email</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copy} disabled={!output}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={generate} disabled={loading || !topic.trim()}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your generated email will appear here. You can edit it before copying."
              rows={20}
              className="rounded-xl bg-background/60 font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

