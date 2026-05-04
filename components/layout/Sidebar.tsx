"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  UserPlus,
  Bot,
  TrendingUp,
  User,
  PanelLeft,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Verify Credit", href: "/verify", icon: Search },
  { name: "Simulator", href: "/simulator", icon: TrendingUp },
  { name: "AI MRV", href: "/ai-mrv", icon: Bot },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Onboarding", href: "/onboarding", icon: UserPlus },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen glass border-r border-border/40 transition-all duration-300 ease-in-out relative z-20",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      <div className="flex items-center h-20 px-6 border-b border-border/40">
        <Link
          href="/"
          className="flex items-center space-x-3 overflow-hidden group"
        >
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Leaf className="h-6 w-6 text-primary" strokeWidth={1.5} />
          </div>
          {!isCollapsed && (
            <span className="heading-display text-xl text-white whitespace-nowrap">
              Carbon Trade X
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                    "hover:bg-primary/5",
                    isActive
                      ? "bg-primary/10 text-white border-l-2 border-primary"
                      : "text-muted-foreground hover:text-white",
                    isCollapsed && "justify-center",
                  )}
                >
                  <item.icon
                    className="h-5 w-5 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border/40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-muted-foreground hover:text-foreground hover:bg-primary/5"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              !isCollapsed && "rotate-180",
            )}
            strokeWidth={1.5}
          />
        </Button>
      </div>
    </aside>
  );
}
