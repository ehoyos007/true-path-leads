import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email required").max(255),
  phone: z.string().min(10, "Valid phone required").max(20),
  smsOptIn: z.boolean().refine((val) => val === true, {
    message: "You must agree to receive text messages to continue",
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactStepProps {
  onSubmit: (data: ContactFormData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const ContactStep = ({ onSubmit, onBack, isSubmitting }: ContactStepProps) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", smsOptIn: false },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Almost there!</h2>
          <p className="text-muted-foreground">Where should we send your free savings estimate?</p>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">No credit impact to see your options</span>
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

        <FormField
          control={form.control}
          name="smsOptIn"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-xs text-muted-foreground font-normal leading-relaxed cursor-pointer">
                  I agree to receive text messages from True Horizon Financial LLC regarding my financial consultation. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time. View our{" "}
                  <Link to="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>
                  .
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get My Free Quote"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactStep;
