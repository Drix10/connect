import { MRVChatInterface } from "@/components/ai-mrv/MRVChatInterface";

export default function AIMRVPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-carbon-green-400 mb-2">
          AI MRV Analysis
        </h1>
        <p className="text-gray-400">
          Analyze carbon projects using our multi-agent AI system. Enter a
          project description or Registry ID to receive a comprehensive quality
          assessment.
        </p>
      </div>

      <MRVChatInterface />
    </div>
  );
}
