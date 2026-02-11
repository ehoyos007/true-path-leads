import { Lock, Award, BadgeCheck } from "lucide-react";

const badges = [
  { icon: Lock, label: "Privacy Protected", description: "Your data is never sold" },
  { icon: Award, label: "BBB Accredited", description: "A+ Rating since 2015" },
  { icon: BadgeCheck, label: "IAPDA Certified", description: "Industry certified" },
];

const TrustBadges = () => {
  return (
    <section className="py-12 bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <badge.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{badge.label}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
