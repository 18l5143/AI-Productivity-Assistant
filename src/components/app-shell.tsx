import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b bg-background/80 backdrop-blur px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
            <p className="mx-auto mt-10 max-w-5xl text-xs text-muted-foreground border-t pt-4">
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
