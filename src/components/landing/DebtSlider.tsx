import { Slider } from "@/components/ui/slider";

interface DebtSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const DebtSlider = ({ value, onChange }: DebtSliderProps) => {
  const formatValue = (val: number) => {
    if (val >= 100000) return "$100,000+";
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Debt Amount</span>
        <span className="text-2xl font-bold text-primary">{formatValue(value)}</span>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={5000}
        max={100000}
        step={1000}
        className="py-4"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>$5,000</span>
        <span>$100,000+</span>
      </div>
    </div>
  );
};

export default DebtSlider;
