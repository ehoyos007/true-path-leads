import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/TrueHorizonLogoNew.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <img 
            src={logo} 
            alt="True Horizon Financial" 
            className="h-10 md:h-12 w-auto"
            width={111}
            height={40}
            fetchPriority="high"
          />

          {/* Phone CTA */}
          <a href="tel:1-855-417-1393" className="flex items-center gap-2">
            <Button variant="default" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">1-855-417-1393</span>
              <span className="sm:hidden">Call Now</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
