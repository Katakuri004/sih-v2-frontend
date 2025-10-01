"use client";

import type React from "react";

import {
  LayoutDashboard,
  Wrench,
  View,
  BarChart3,
  Menu,
  Map,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  function NavItem({
    href,
    icon: Icon,
    children,
    isActive = false,
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
    isActive?: boolean;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={`flex items-center text-sm rounded-lg transition-all duration-200 ${
          isCollapsed
            ? `px-3 py-3 justify-center ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
              }`
            : `px-4 py-3 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
              }`
        }`}
        title={isCollapsed ? (children as string) : undefined}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="ml-3">{children}</span>}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-sidebar shadow-md border border-sidebar-border"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-sidebar-foreground" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] bg-sidebar transform transition-all duration-200 ease-in-out
                lg:translate-x-0 lg:static border-r border-sidebar-border
                ${
                  isMobileMenuOpen
                    ? "translate-x-0 w-64"
                    : "-translate-x-full lg:translate-x-0"
                }
                ${isCollapsed ? "lg:w-20" : "lg:w-64"}
            `}
      >
        <div className="h-full flex flex-col">
          <div
            className={`h-16 px-6 flex items-center justify-between border-b border-sidebar-border ${
              isCollapsed ? "px-4" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`bg-primary rounded-lg flex items-center justify-center ${
                  isCollapsed ? "w-6 h-6" : "w-8 h-8"
                }`}
              >
                <LayoutDashboard
                  className={`text-primary-foreground ${
                    isCollapsed ? "h-4 w-4" : "h-5 w-5"
                  }`}
                />
              </div>
              {!isCollapsed && (
                <span className="text-lg font-bold text-sidebar-foreground">
                  MetroMind AI
                </span>
              )}
            </div>
            <button
              onClick={toggleCollapsed}
              className={`hidden lg:flex rounded-md hover:bg-sidebar-accent transition-colors ${
                isCollapsed ? "p-1 mx-auto" : "p-1"
              }`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-2">
              <NavItem
                href="/dashboard"
                icon={LayoutDashboard}
                isActive={pathname === "/dashboard"}
              >
                Fleet Command Center
              </NavItem>
              <NavItem
                href="/metro-map"
                icon={Map}
                isActive={pathname === "/metro-map"}
              >
                Metro Map
              </NavItem>
              <NavItem
                href="/analytics"
                icon={TrendingUp}
                isActive={pathname === "/analytics"}
              >
                Crowd Analytics
              </NavItem>
              <NavItem
                href="/maintenance"
                icon={Wrench}
                isActive={pathname === "/maintenance"}
              >
                Maintenance Hub
              </NavItem>
              <NavItem
                href="/induction-review"
                icon={User}
                isActive={pathname === "/induction-review"}
              >
                Induction Review
              </NavItem>
              <NavItem
                href="/fleet-shadow"
                icon={View}
                isActive={pathname === "/fleet-shadow"}
              >
                Digital Fleet Shadow
              </NavItem>
              <NavItem
                href="/reports"
                icon={BarChart3}
                isActive={pathname === "/reports"}
              >
                ESG Reports
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
