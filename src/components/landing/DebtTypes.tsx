import { CreditCard, Building2, Stethoscope, Briefcase, Landmark, Receipt } from "lucide-react";

const debtTypes = [
  { icon: CreditCard, label: "Credit Cards", description: "High-interest credit card debt" },
  { icon: Receipt, label: "Collections", description: "Accounts in collections" },
  { icon: Building2, label: "Personal Loans", description: "Unsecured personal loans" },
  { icon: Stethoscope, label: "Medical Bills", description: "Outstanding medical debt" },
  { icon: Landmark, label: "Lines of Credit", description: "Home equity and credit lines" },
  { icon: Briefcase, label: "Business Loans", description: "Small business debt" },
];

const DebtTypes = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Types of Debt We Help With
          </h2>
          <p className="text-lg text-muted-foreground">
            Our programs can help consolidate and reduce various types of unsecured debt
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {debtTypes.map((debt) => (
            <div
              key={debt.label}
              className="bg-background border border-border rounded-xl p-6 text-center hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <debt.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{debt.label}</h3>
              <p className="text-sm text-muted-foreground">{debt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DebtTypes;
