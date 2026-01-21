import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DebtSlider from "../DebtSlider";

interface DebtAmountStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
}

const DebtAmountStep = ({ value, onChange, onNext }: DebtAmountStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">How much debt do you have?</h2>
        <p className="text-muted-foreground">Adjust the slider to your approximate total</p>
      </div>
      <DebtSlider value={value} onChange={onChange} />
      <Button onClick={onNext} className="w-full bg-accent hover:bg-accent/90" size="lg">
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default DebtAmountStep;
