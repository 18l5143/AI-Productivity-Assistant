import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, FileText, CalendarClock, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Smart Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Notes Summarizer", url: "/notes", icon: FileText },
  { title: "AI Task Planner", url: "/planner", icon: CalendarClock },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="gradient-surface flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-[var(--shadow-soft)]">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-semibold leading-tight tracking-tight">
              WorkAssist AI
            </span>
            <span className="text-xs leading-tight text-muted-foreground">Productivity suite</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.7rem] font-semibold uppercase tracking-wider">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive =
                  item.url === "/" ? currentPath === "/" : currentPath.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="rounded-xl transition-all duration-300 hover:translate-x-0.5 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:shadow-[var(--shadow-soft)]"
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
