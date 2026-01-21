import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const paymentOptions = [
  { value: "behind", label: "Yes, I'm behind on some payments", sublabel: "Don't worry - we help people in your situation every day" },
  { value: "current-struggling", label: "No, I'm current but struggling", sublabel: "Getting ahead of the problem is a smart move" },
  { value: "worried", label: "Not yet, but I'm worried I might fall behind", sublabel: "Planning ahead shows financial awareness" },
];

interface PaymentStatusStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStatusStep = ({ value, onChange, onNext, onBack }: PaymentStatusStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Are you currently behind on any payments?</h2>
        <p className="text-muted-foreground">There's no judgment here - we're here to help</p>
      </div>
      <div className="grid gap-3">
        {paymentOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              value === option.value
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="font-medium text-foreground block">{option.label}</span>
            <span className="text-sm text-muted-foreground">{option.sublabel}</span>
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
          disabled={!value}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatusStep;
