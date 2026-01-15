import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">TH</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-foreground leading-tight">True Horizon</h1>
              <p className="text-xs text-muted-foreground -mt-1">Financial</p>
            </div>
          </div>

          {/* Phone CTA */}
          <a href="tel:1-800-555-0123" className="flex items-center gap-2">
            <Button variant="default" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">1-800-555-0123</span>
              <span className="sm:hidden">Call Now</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
