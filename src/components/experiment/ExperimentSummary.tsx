export const ExperimentSummary = () => {
  return (
    <div className="bg-muted/50 rounded-lg p-4 mb-6">
      <h2 className="font-semibold mb-2">AI Summary</h2>
      <p className="text-sm text-muted-foreground">
        The experiment revealed several standout winners, with Test A's 10% price reduction showing exceptional performance on the Lavender Dreams collection, achieving a <span className="text-[#1D9BF0]">28%</span> increase in conversion rate. The Rose Petals fragrance test variation also demonstrated strong results with a <span className="text-[#1D9BF0]">15%</span> uplift in average order value. However, Test B's 10% price increase notably underperformed, particularly on seasonal items, showing a <span className="text-black">-20%</span> decrease in units sold. Overall, the winning variations contributed to a <span className="text-[#1D9BF0]">15.8%</span> improvement in performance metrics and generated an additional $45,000 in incremental revenue. Recommended action: Roll out the successful price optimizations across similar product categories while avoiding aggressive price increases on seasonal items.
      </p>
    </div>
  );
};