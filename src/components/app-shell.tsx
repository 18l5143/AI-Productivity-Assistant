import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="app-canvas min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-3 border-b border-border/60 bg-background/60 backdrop-blur-xl px-4 md:px-6 sticky top-0 z-10">
            <SidebarTrigger className="rounded-xl" />
            <h1 className="text-sm font-semibold tracking-tight text-foreground">{title}</h1>
          </header>
          <main className="flex-1 px-4 py-8 md:px-10 md:py-10">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
            <p className="mx-auto mt-12 max-w-6xl rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              AI-generated content may contain errors or inaccuracies. Please review and verify
              AI-generated content before using it in professional situations.
            </p>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
