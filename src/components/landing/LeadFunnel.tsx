import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DebtSlider from "./DebtSlider";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email required").max(255),
  phone: z.string().min(10, "Valid phone required").max(20),
});

type ContactFormData = z.infer<typeof contactSchema>;

const debtTypeOptions = [
  "Credit Cards",
  "Personal Loans",
  "Medical Bills",
  "Collections",
  "Lines of Credit",
  "Business Loans",
];

interface LeadFunnelProps {
  initialDebtAmount: number;
  onClose: () => void;
}

const LeadFunnel = ({ initialDebtAmount, onClose }: LeadFunnelProps) => {
  const [step, setStep] = useState(1);
  const [debtAmount, setDebtAmount] = useState(initialDebtAmount);
  const [selectedDebtTypes, setSelectedDebtTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const toggleDebtType = (type: string) => {
    setSelectedDebtTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        debt_amount: debtAmount,
        debt_types: selectedDebtTypes,
      });

      if (error) throw error;
      setStep(4);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or call us.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-t-2xl overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-6 md:p-8">
          {step < 4 && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground mb-4 text-sm">
              ← Back to site
            </button>
          )}

          {/* Step 1: Debt Amount */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">How much debt do you have?</h2>
                <p className="text-muted-foreground">Adjust the slider to your approximate total</p>
              </div>
              <DebtSlider value={debtAmount} onChange={setDebtAmount} />
              <Button onClick={() => setStep(2)} className="w-full bg-accent hover:bg-accent/90" size="lg">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Debt Types */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">What types of debt?</h2>
                <p className="text-muted-foreground">Select all that apply</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {debtTypeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleDebtType(type)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedDebtTypes.includes(type)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium text-foreground">{type}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-accent hover:bg-accent/90" disabled={selectedDebtTypes.length === 0}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Almost there!</h2>
                  <p className="text-muted-foreground">Enter your info for your free quote</p>
                </div>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Smith" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="john@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get My Quote"}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Step 4: Thank You */}
          {step === 4 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-success" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
                <p className="text-muted-foreground">A specialist will contact you within 24 hours.</p>
              </div>
              <Button onClick={onClose} variant="outline" className="w-full">Return to Site</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadFunnel;
