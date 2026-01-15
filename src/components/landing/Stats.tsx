import { Users, DollarSign, Star, Shield } from "lucide-react";

const stats = [
  { icon: Users, value: "50,000+", label: "Customers Helped" },
  { icon: DollarSign, value: "$500M+", label: "Debt Resolved" },
  { icon: Star, value: "4.9/5", label: "Customer Rating" },
  { icon: Shield, value: "A+", label: "BBB Rating" },
];

const Stats = () => {
  return (
    <section className="hero-gradient section-padding">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
