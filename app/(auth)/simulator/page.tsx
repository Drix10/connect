import { SimulatorContainer } from "@/components/simulator/SimulatorContainer";

export default function SimulatorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-carbon-green-400 mb-2">
          Trading Simulator
        </h1>
        <p className="text-gray-400">
          Practice carbon credit trading in a risk-free environment. Buy and
          sell credits to build your portfolio and understand market dynamics.
        </p>
      </div>

      <SimulatorContainer />
    </div>
  );
}
