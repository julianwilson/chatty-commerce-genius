import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExperimentMetricsGraphs } from "@/components/experiment/ExperimentMetricsGraphs";
import { ExperimentSummary } from "@/components/experiment/ExperimentSummary";
import { ExperimentTable } from "@/components/experiment/ExperimentTable";

export default function ExperimentAnalytics() {
  const [selectedExperiment, setSelectedExperiment] = useState<string>("");
  const [experiments, setExperiments] = useState([
    { id: "1", name: "Price Testing - Spring Collection" },
    { id: "2", name: "Shipping Test - Free Shipping" },
    { id: "3", name: "Image Test - Product Photos" },
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Experiment Analytics</h1>
        <Select
          value={selectedExperiment}
          onValueChange={setSelectedExperiment}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select an experiment" />
          </SelectTrigger>
          <SelectContent>
            {experiments.map((experiment) => (
              <SelectItem key={experiment.id} value={experiment.id}>
                {experiment.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedExperiment && (
        <div className="space-y-6">
          <ExperimentSummary />
          <ExperimentMetricsGraphs />
          <ExperimentTable />
        </div>
      )}
    </div>
  );
}
