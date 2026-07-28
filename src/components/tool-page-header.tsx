import type { LucideIcon } from "lucide-react";

export function ToolPageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <div className="gradient-surface flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-primary-foreground shadow-[var(--shadow-soft)]">
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
