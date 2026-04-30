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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Verify Credit",
    href: "/verify",
    icon: Search,
  },
  {
    name: "Learn",
    href: "/learn",
    icon: BookOpen,
  },
  {
    name: "Onboarding",
    href: "/onboarding",
    icon: UserPlus,
  },
  {
    name: "AI MRV",
    href: "/ai-mrv",
    icon: Bot,
  },
  {
    name: "Simulator",
    href: "/simulator",
    icon: TrendingUp,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0 md:w-16" : "w-64",
          isMobile && isCollapsed && "w-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-carbon-green flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CT</span>
                </div>
                <span className="font-semibold text-foreground">
                  Carbon Trade X
                </span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                isCollapsed && "mx-auto",
              )}
            >
              {isCollapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-carbon-green text-white hover:bg-carbon-green/90"
                          : "text-muted-foreground",
                        isCollapsed && "justify-center",
                      )}
                      onClick={() => {
                        if (isMobile) {
                          setIsCollapsed(true);
                        }
                      }}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground text-center">
                <p>Demo Mode</p>
                <p className="mt-1">Data stored locally</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for main content */}
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      />
    </>
  );
}
