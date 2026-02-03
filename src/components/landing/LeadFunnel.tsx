import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FunnelProgress from "./funnel/FunnelProgress";
import DebtAmountStep from "./funnel/DebtAmountStep";
import DebtTypesStep from "./funnel/DebtTypesStep";
import EmploymentStep from "./funnel/EmploymentStep";
import PaymentStatusStep from "./funnel/PaymentStatusStep";
import GoalsStep from "./funnel/GoalsStep";
import ContactStep, { type ContactFormData } from "./funnel/ContactStep";
import ThankYouStep from "./funnel/ThankYouStep";

interface LeadFunnelProps {
  initialDebtAmount: number;
  onClose: () => void;
}

const TOTAL_STEPS = 7;

const LeadFunnel = ({ initialDebtAmount, onClose }: LeadFunnelProps) => {
  const [step, setStep] = useState(1);
  const [debtAmount, setDebtAmount] = useState(initialDebtAmount);
  const [selectedDebtTypes, setSelectedDebtTypes] = useState<string[]>([]);
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [behindOnPayments, setBehindOnPayments] = useState("");
  const [timelineGoal, setTimelineGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // All lead creation and CRM sync happens in the edge function
      // This ensures proper rate limiting and validation server-side
      const { data: result, error } = await supabase.functions.invoke('sync-to-crm', {
        body: {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          debtAmount,
          debtTypes: selectedDebtTypes,
          employmentStatus,
          behindOnPayments,
          timelineGoal,
          smsOptIn: true,
        }
      });

      if (error) {
        console.error('Lead submission failed:', error);
        throw new Error(error.message || 'Submission failed');
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Submission failed');
      }

      // Show success
      setStep(7);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again or call us.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
        <FunnelProgress step={step} totalSteps={TOTAL_STEPS} />

        <div className="p-6 md:p-8">
          {step < TOTAL_STEPS && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground mb-4 text-sm">
              ← Back to site
            </button>
          )}

          {step === 1 && (
            <DebtAmountStep
              value={debtAmount}
              onChange={setDebtAmount}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <DebtTypesStep
              value={selectedDebtTypes}
              onChange={setSelectedDebtTypes}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <EmploymentStep
              value={employmentStatus}
              onChange={setEmploymentStatus}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <PaymentStatusStep
              value={behindOnPayments}
              onChange={setBehindOnPayments}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
            />
          )}

          {step === 5 && (
            <GoalsStep
              value={timelineGoal}
              onChange={setTimelineGoal}
              onNext={() => setStep(6)}
              onBack={() => setStep(4)}
            />
          )}

          {step === 6 && (
            <ContactStep
              onSubmit={handleSubmit}
              onBack={() => setStep(5)}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 7 && <ThankYouStep onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default LeadFunnel;
