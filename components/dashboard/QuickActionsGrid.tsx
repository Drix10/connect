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
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30",
  },
  {
    title: "Learn",
    description: "Explore carbon credit quality criteria and standards",
    icon: BookOpen,
    href: "/learn",
    color: "from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-500/30",
  },
  {
    title: "AI MRV",
    description: "Analyze projects with AI-powered quality assessment",
    icon: Bot,
    href: "/ai-mrv",
    color: "from-pink-500/20 to-pink-600/20",
    borderColor: "border-pink-500/30",
  },
  {
    title: "Simulator",
    description: "Practice trading in a realistic market environment",
    icon: TrendingUp,
    href: "/simulator",
    color: "from-primary/20 to-secondary/20",
    borderColor: "border-primary/30",
  },
];

export function QuickActionsGrid() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <Card
                className={`bg-gradient-to-br ${action.color} border ${action.borderColor} hover:scale-105 transition-transform cursor-pointer h-full`}
              >
                <CardContent className="p-6">
                  <action.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
