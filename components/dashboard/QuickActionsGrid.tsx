"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, Bot, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Verify Credit",
    description: "Search and verify carbon credits from major registries",
    icon: Search,
    href: "/verify",
    gradient: "from-blue-500/20 via-blue-600/20 to-cyan-500/20",
    borderColor: "border-blue-500/40",
    iconBg: "from-blue-500/30 to-cyan-500/30",
  },
  {
    title: "Learn",
    description: "Explore carbon credit quality criteria and standards",
    icon: BookOpen,
    href: "/learn",
    gradient: "from-purple-500/20 via-purple-600/20 to-pink-500/20",
    borderColor: "border-purple-500/40",
    iconBg: "from-purple-500/30 to-pink-500/30",
  },
  {
    title: "AI MRV",
    description: "Analyze projects with AI-powered quality assessment",
    icon: Bot,
    href: "/ai-mrv",
    gradient: "from-pink-500/20 via-pink-600/20 to-rose-500/20",
    borderColor: "border-pink-500/40",
    iconBg: "from-pink-500/30 to-rose-500/30",
  },
  {
    title: "Simulator",
    description: "Practice trading in a realistic market environment",
    icon: TrendingUp,
    href: "/simulator",
    gradient: "from-primary/20 via-accent/20 to-primary/20",
    borderColor: "border-primary/40",
    iconBg: "from-primary/30 to-accent/30",
  },
];

export function QuickActionsGrid() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
        Quick Actions
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${action.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
            <Link href={action.href}>
              <Card
                className={`relative glass border-2 ${action.borderColor} hover:border-primary transition-all duration-300 cursor-pointer h-full overflow-hidden group-hover:scale-105 group-hover:shadow-2xl`}
              >
                <CardContent className="p-6">
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${action.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {action.description}
                  </p>
                </CardContent>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
