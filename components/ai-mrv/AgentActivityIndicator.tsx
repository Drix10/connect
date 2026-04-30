"use client";

import { motion } from "framer-motion";
import { Search, Shield, CheckCircle, FileText } from "lucide-react";
import { AgentType } from "@/lib/ai-mrv/orchestrator";

interface AgentActivityIndicatorProps {
  activeAgent: AgentType | null;
}

const agentConfig = {
  researcher: {
    name: "Researcher Agent",
    icon: Search,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  verifier: {
    name: "Verifier Agent",
    icon: Shield,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
  compliance: {
    name: "Compliance Checker",
    icon: CheckCircle,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
  },
  report: {
    name: "Report Generator",
    icon: FileText,
    color: "text-carbon-green-400",
    bgColor: "bg-carbon-green-500/20",
  },
};

export function AgentActivityIndicator({
  activeAgent,
}: AgentActivityIndicatorProps) {
  if (!activeAgent) return null;

  const config = agentConfig[activeAgent];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 p-4 rounded-lg border border-gray-800 bg-gray-900/50"
    >
      <div className={`${config.bgColor} p-2 rounded-lg`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </motion.div>
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-200">{config.name}</p>
        <p className="text-xs text-gray-500">Processing...</p>
      </div>

      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${config.bgColor}`}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
