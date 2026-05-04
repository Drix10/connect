"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Package,
  Activity,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { portfolioStats } from "@/lib/demo-data/portfolio";
import { transactionStats } from "@/lib/demo-data/transactions";

export default function DashboardPage() {
  const { user } = useAuth();

  const profitPercentage = portfolioStats.profitPercentage;
  const isProfit = profitPercentage >= 0;

  const stats = [
    {
      title: "Portfolio Value",
      value: `₹${(portfolioStats.totalValue / 10000000).toFixed(2)}Cr`,
      change: `${isProfit ? "+" : ""}${profitPercentage.toFixed(1)}%`,
      isPositive: isProfit,
      icon: DollarSign,
    },
    {
      title: "Credits Owned",
      value: portfolioStats.totalCredits.toLocaleString(),
      change: "5 projects",
      isPositive: true,
      icon: Package,
    },
    {
      title: "Avg. Quality Score",
      value: `${portfolioStats.averageQualityScore}%`,
      change: "High",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Total Volume",
      value: `₹${(transactionStats.totalValue / 10000000).toFixed(1)}Cr`,
      change: `${transactionStats.totalTransactions} transactions`,
      isPositive: true,
      icon: Activity,
    },
  ];

  const recentActivity = [
    {
      type: "buy",
      project: "Rimba Raya REDD+ Project",
      amount: "1,000 credits",
      value: "₹8.5L",
      date: "1 day ago",
    },
    {
      type: "sell",
      project: "Bhadla Solar Park Phase II",
      amount: "500 credits",
      value: "₹4.0L",
      date: "3 days ago",
    },
    {
      type: "buy",
      project: "Jaisalmer Wind Power",
      amount: "2,500 credits",
      value: "₹19.5L",
      date: "1 week ago",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        <div className="relative z-10 space-y-10 pb-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary blink"></span>
              <span>Live Dashboard</span>
            </div>
            <h1 className="heading-display text-5xl md:text-6xl text-white mb-3 leading-tight">
              Welcome back,
              <br />
              <span className="text-primary">{user?.name || "User"}</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Here&apos;s your portfolio overview
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="border-border hover:border-primary/50 transition-all hover-lift bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-7">
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <stat.icon
                          className="h-6 w-6 text-primary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <Badge
                        variant={stat.isPositive ? "default" : "destructive"}
                        className="font-medium text-xs px-3 py-1"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                        {stat.title}
                      </p>
                      <p className="heading-display text-3xl text-white">
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardHeader className="border-b border-border px-8 py-6">
                <CardTitle className="heading-display text-2xl text-white flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity
                      className="h-5 w-5 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between px-8 py-6 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`p-3 rounded-xl ${
                            activity.type === "buy"
                              ? "bg-success/10"
                              : "bg-destructive/10"
                          }`}
                        >
                          {activity.type === "buy" ? (
                            <ArrowDownRight
                              className="h-5 w-5 text-success"
                              strokeWidth={2}
                            />
                          ) : (
                            <ArrowUpRight
                              className="h-5 w-5 text-destructive"
                              strokeWidth={2}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white capitalize text-base mb-1">
                            {activity.type}: {activity.project}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.amount}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="heading-display text-white text-lg mb-1">
                          {activity.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
