"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 glass">
      <div className="flex h-20 items-center justify-end px-6 md:px-8">
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center space-x-3 hover:opacity-90 transition-all group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all" />
                  <div className="relative w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:border-primary/50 transition-all">
                    <User className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {user.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 mr-2" strokeWidth={1.5} />
                Logout
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="sm:hidden text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="font-semibold">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
