"use client";

import { ReactNode } from "react";
import { Bell, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-4 border-b border-border bg-card px-4 md:px-6 sticky top-0 z-30">
            <SidebarTrigger className="text-foreground" />
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari apa saja..."
                  className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="flex-1 md:flex-none" />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-foreground">Admin</span>
                <span className="text-xs text-muted-foreground">admin@bakuloli.id</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-[var(--gradient-hero)] flex items-center justify-center text-secondary-foreground font-bold text-sm">
                AD
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
