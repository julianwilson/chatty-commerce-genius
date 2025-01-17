interface MoneyDisplayProps {
  value: number;
  showPrefix?: boolean;
  className?: string;
}

export const MoneyDisplay = ({ value, showPrefix = true, className = "" }: MoneyDisplayProps) => {
  const formattedValue = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <span className={className}>
      {showPrefix && "$"}{formattedValue}
    </span>
  );
};