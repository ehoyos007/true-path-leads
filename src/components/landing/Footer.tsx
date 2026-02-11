import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logoPng from "@/assets/TrueHorizonLogoLight.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="md:col-span-2">
            <img 
              src={logoPng} 
              alt="True Horizon Financial" 
              className="h-12 md:h-14 w-auto mb-4"
              width={133}
              height={48}
              loading="lazy"
              decoding="async"
            />
            <div className="space-y-2">
              <a href="tel:1-855-417-1393" className="flex items-center gap-2 text-background/70 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" />
                1-855-417-1393
              </a>
              <a href="mailto:notifications@thfinancial.org" className="flex items-center gap-2 text-background/70 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
                notifications@thfinancial.org
              </a>
              <div className="flex items-center gap-2 text-background/70">
                <MapPin className="h-4 w-4" />
                Miami, FL
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-background/70 hover:text-accent transition-colors">Our Services</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-background/70 hover:text-accent transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#testimonials" className="text-background/70 hover:text-accent transition-colors">Customer Reviews</a>
              </li>
              <li>
                <Link to="/privacy" className="text-background/70 hover:text-accent transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-background mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors">Debt Relief</a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors">Debt Consolidation</a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors">Credit Improvement</a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors">Free Consultation</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-background/50 leading-relaxed mb-4">
            <strong>Disclaimer:</strong> True Horizon Financial is a debt resolution company. We are not a loan provider, law firm, or credit repair organization. Our services may not be suitable for all individuals, and outcomes vary based on individual circumstances. Debt resolution programs may have an impact on your credit score and may result in tax liability on forgiven debt. Please consult with a financial advisor or tax professional for advice specific to your situation.
          </p>
          <p className="text-xs text-background/50 leading-relaxed mb-4">
            Results and savings mentioned on this website are examples and may vary based on your specific debt situation, creditors, and other factors. True Horizon Financial does not guarantee any specific results.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-background/10">
            <p className="text-xs text-background/50">
              © {new Date().getFullYear()} True Horizon Financial. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/privacy" className="text-xs text-background/50 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-background/50 hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
