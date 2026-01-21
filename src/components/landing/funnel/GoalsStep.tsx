import { ArrowLeft, ArrowRight, Zap, TrendingDown, PhoneOff, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const goalOptions = [
  { value: "fast", label: "Get out of debt as fast as possible", icon: Zap },
  { value: "lower-payments", label: "Lower my monthly payments", icon: TrendingDown },
  { value: "stop-calls", label: "Stop collection calls", icon: PhoneOff },
  { value: "avoid-bankruptcy", label: "Avoid bankruptcy", icon: Shield },
  { value: "improve-credit", label: "Improve my credit score", icon: TrendingUp },
];

interface GoalsStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const GoalsStep = ({ value, onChange, onNext, onBack }: GoalsStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What's your goal for resolving your debt?</h2>
        <p className="text-muted-foreground">Select what matters most to you</p>
      </div>
      <div className="grid gap-3">
        {goalOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                value === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">{option.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={onNext} 
          className="flex-1 bg-accent hover:bg-accent/90" 
          disabled={!value}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GoalsStep;
