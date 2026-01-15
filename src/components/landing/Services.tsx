import { TrendingDown, RefreshCw, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicesProps {
  onGetStarted: () => void;
}

const services = [
  {
    icon: TrendingDown,
    title: "Debt Relief & Settlement",
    description: "Negotiate with creditors to reduce your total debt. Many customers see 30-50% reduction in what they owe.",
    features: ["Reduce total debt owed", "Single monthly payment", "No upfront fees"],
  },
  {
    icon: RefreshCw,
    title: "Debt Consolidation",
    description: "Combine multiple debts into one low-interest loan. Simplify your payments and save on interest.",
    features: ["Lower interest rates", "Fixed monthly payments", "Pay off debt faster"],
  },
  {
    icon: CreditCard,
    title: "Credit Improvement",
    description: "Build a stronger credit profile while managing your debt. Get personalized advice from experts.",
    features: ["Credit monitoring", "Personalized guidance", "Build better habits"],
  },
];

const Services = ({ onGetStarted }: ServicesProps) => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Tailored solutions to fit your unique financial situation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                variant="outline"
                onClick={onGetStarted}
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Learn More
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
