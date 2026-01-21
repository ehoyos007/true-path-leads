import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const debtTypeOptions = [
  "Credit Cards",
  "Personal Loans",
  "Medical Bills",
  "Collections",
  "Lines of Credit",
  "Business Loans",
];

interface DebtTypesStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const DebtTypesStep = ({ value, onChange, onNext, onBack }: DebtTypesStepProps) => {
  const toggleDebtType = (type: string) => {
    onChange(
      value.includes(type) ? value.filter((t) => t !== type) : [...value, type]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What types of debt do you have?</h2>
        <p className="text-muted-foreground">Select all that apply</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {debtTypeOptions.map((type) => (
          <button
            key={type}
            onClick={() => toggleDebtType(type)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              value.includes(type)
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="font-medium text-foreground">{type}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={onNext} 
          className="flex-1 bg-accent hover:bg-accent/90" 
          disabled={value.length === 0}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DebtTypesStep;
