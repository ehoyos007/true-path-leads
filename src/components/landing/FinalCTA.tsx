import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  onGetStarted: () => void;
}

const FinalCTA = ({ onGetStarted }: FinalCTAProps) => {
  return (
    <section className="section-padding hero-gradient">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Take Control of Your Debt?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
            Get your free, no-obligation consultation today. See how much you could save in just 2 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 gap-2"
            >
              Get My Free Quote
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <a href="tel:1-855-417-1393">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-lg px-8 py-6 gap-2 w-full sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                1-855-417-1393
              </Button>
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm">No credit impact to check your options</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
