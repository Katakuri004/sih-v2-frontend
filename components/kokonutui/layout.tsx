"use client";

import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkSidebarState = () => {
      const savedState = localStorage.getItem("sidebar-collapsed");
      if (savedState) {
        setIsSidebarCollapsed(JSON.parse(savedState));
      }
    };

    checkSidebarState();
    // Check periodically for changes
    const interval = setInterval(checkSidebarState, 100);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="w-full flex flex-1 flex-col transition-all duration-200">
        <header className="h-16 border-b border-border">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
