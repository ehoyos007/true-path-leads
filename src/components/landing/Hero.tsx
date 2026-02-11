import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import DebtSlider from "./DebtSlider";

interface HeroProps {
  onGetStarted: () => void;
  debtAmount: number;
  setDebtAmount: (amount: number) => void;
}

const Hero = ({ onGetStarted, debtAmount, setDebtAmount }: HeroProps) => {
  const estimatedSavings = Math.round(debtAmount * 0.35);
  const monthlyPayment = Math.round((debtAmount - estimatedSavings) / 48);

  return (
    <section className="hero-gradient pt-24 md:pt-32 pb-16 md:pb-24 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground font-medium">Trusted by 50,000+ Customers</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
              Take Control of Your <span className="text-accent">Financial Future</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-xl mx-auto lg:mx-0">
              Get help with debt relief, consolidation, and credit improvement. See how much you could save today — no credit impact to check.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Quick 2-min Process</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">A+ BBB Rating</span>
              </div>
            </div>
          </div>

          {/* Right content - Interactive form card */}
          <div className="glass-card rounded-2xl p-6 md:p-8 max-w-md mx-auto lg:mx-0 lg:ml-auto w-full">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              See How Much You Could Save
            </h2>
            <p className="text-muted-foreground mb-6">
              Adjust the slider to your total debt amount
            </p>

            <DebtSlider value={debtAmount} onChange={setDebtAmount} />

            {/* Savings display */}
            <div className="bg-success/10 border border-success/20 rounded-xl p-4 my-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground text-sm">Estimated Savings</span>
                <span className="text-success font-bold text-2xl">${estimatedSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">New Monthly Payment</span>
                <span className="text-foreground font-semibold text-lg">${monthlyPayment.toLocaleString()}/mo</span>
              </div>
            </div>

            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6 gap-2"
            >
              Get My Free Quote
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              ✓ No credit impact to see your options
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
