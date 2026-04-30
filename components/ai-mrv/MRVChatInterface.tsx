"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AgentActivityIndicator } from "./AgentActivityIndicator";
import { QualityReportCard } from "./QualityReportCard";
import {
  runMRVAnalysis,
  AgentType,
  AgentUpdate,
  MRVAnalysisResult,
} from "@/lib/ai-mrv/orchestrator";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  type: "user" | "agent" | "report";
  agent?: AgentType;
  content: string;
  timestamp: Date;
}

// Maximum number of messages to keep in memory to prevent memory leaks
const MAX_MESSAGES = 100;

export function MRVChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<MRVAnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isAnalyzing) return;

    // Validate input length
    if (input.trim().length > 500) {
      toast.error("Input is too long. Please limit to 500 characters.");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const updated = [...prev, userMessage];
      // Prevent memory leak by limiting message history
      return updated.length > MAX_MESSAGES
        ? updated.slice(updated.length - MAX_MESSAGES)
        : updated;
    });
    setInput("");
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await runMRVAnalysis(
        userMessage.content,
        (update: AgentUpdate) => {
          setActiveAgent(update.agent);

          // Add agent message to chat
          const agentMessage: ChatMessage = {
            id: `${Date.now()}-${update.agent}`,
            type: "agent",
            agent: update.agent,
            content: update.message,
            timestamp: new Date(),
          };

          setMessages((prev) => {
            const updated = [...prev, agentMessage];
            // Prevent memory leak by limiting message history
            return updated.length > MAX_MESSAGES
              ? updated.slice(updated.length - MAX_MESSAGES)
              : updated;
          });
        },
      );

      setAnalysisResult(result);
      setActiveAgent(null);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setAnalysisResult(null);
    toast.success("Chat history cleared");
  }, []);

  return (
    <div className="space-y-6">
      {/* Chat Messages */}
      <Card className="min-h-[400px] max-h-[600px] overflow-y-auto">
        <CardContent className="p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[350px] text-center">
              <div className="w-16 h-16 rounded-full bg-carbon-green-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-carbon-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                AI MRV Multi-Agent System
              </h3>
              <p className="text-gray-400 max-w-md">
                Enter a carbon project Registry ID (e.g., VCS-1234) or describe
                your project to receive a comprehensive quality assessment from
                our AI agents.
              </p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === "user"
                      ? "bg-carbon-green-600 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {message.agent && (
                    <p className="text-xs opacity-70 mb-1">
                      {message.agent.charAt(0).toUpperCase() +
                        message.agent.slice(1)}{" "}
                      Agent
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-50 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Active Agent Indicator */}
          {isAnalyzing && activeAgent && (
            <AgentActivityIndicator activeAgent={activeAgent} />
          )}
        </CardContent>
      </Card>

      {/* Quality Report */}
      {analysisResult && (
        <QualityReportCard report={analysisResult.finalReport} />
      )}

      {/* Input Form */}
      <div className="space-y-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Registry ID (e.g., VCS-1234) or describe your project..."
            disabled={isAnalyzing}
            className="flex-1"
            maxLength={500}
          />
          <Button type="submit" disabled={isAnalyzing || !input.trim()}>
            {isAnalyzing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
          {messages.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearChat}
              disabled={isAnalyzing}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </form>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{input.length}/500 characters</span>
          {messages.length > 0 && (
            <span>
              {messages.length}/{MAX_MESSAGES} messages
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
