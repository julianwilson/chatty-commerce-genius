import { MetricCard } from "@/components/MetricCard";
import { MetricTooltip } from "@/components/MetricTooltip";

export const ExperimentMetrics = () => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <MetricCard
        title={<MetricTooltip metric="Revenue Per View">Revenue Per View</MetricTooltip>}
        percentage={21}
        currentValue={1.03}
        previousValue={0.83}
        format="currency"
      />
      <MetricCard
        title={<MetricTooltip metric="Incremental Revenue">Incremental Revenue</MetricTooltip>}
        percentage={23.4}
        currentValue={45000}
        previousValue={36000}
        format="currency"
      />
    </div>
  );
};