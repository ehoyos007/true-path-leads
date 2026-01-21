import { ArrowLeft, ArrowRight, Briefcase, Clock, Building, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const employmentOptions = [
  { value: "full-time", label: "Employed Full-Time", icon: Briefcase },
  { value: "part-time", label: "Employed Part-Time", icon: Clock },
  { value: "self-employed", label: "Self-Employed", icon: Building },
  { value: "retired", label: "Retired", icon: Home },
  { value: "unemployed", label: "Not Currently Employed", icon: Search },
];

interface EmploymentStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const EmploymentStep = ({ value, onChange, onNext, onBack }: EmploymentStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What is your employment status?</h2>
        <p className="text-muted-foreground">This helps us understand your situation</p>
      </div>
      <div className="grid gap-3">
        {employmentOptions.map((option) => {
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

export default EmploymentStep;
