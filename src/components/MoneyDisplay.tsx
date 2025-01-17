interface MoneyDisplayProps {
  value: number;
  format?: "money" | "percentage" | "decimal" | "number";
  className?: string;
  showPrefix?: boolean;
}

export const MoneyDisplay = ({ value, format = "money", className = "", showPrefix = true }: MoneyDisplayProps) => {
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "money":
        return `$${value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "decimal":
        return value.toFixed(2);
      case "number":
        return value.toLocaleString('en-US');
      default:
        return value.toString();
    }
  };

  return (
    <span className={className}>
      {formatValue(value, format)}
    </span>
  );
};