import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThankYouStepProps {
  onClose: () => void;
}

const ThankYouStep = ({ onClose }: ThankYouStepProps) => {
  return (
    <div className="text-center py-8 space-y-6">
      <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
        <Check className="h-8 w-8 text-success" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
        <p className="text-muted-foreground">A debt specialist will contact you within 24 hours with your personalized savings estimate.</p>
      </div>
      <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <p>What happens next:</p>
        <ol className="text-left mt-2 space-y-1">
          <li>1. We analyze your debt situation</li>
          <li>2. Our specialist prepares your options</li>
          <li>3. You receive a no-obligation quote</li>
        </ol>
      </div>
      <Button onClick={onClose} variant="outline" className="w-full">Return to Site</Button>
    </div>
  );
};

export default ThankYouStep;
