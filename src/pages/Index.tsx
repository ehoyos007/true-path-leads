import { useState, lazy, Suspense } from "react";

// Critical above-the-fold components - load immediately
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TrustBadges from "@/components/landing/TrustBadges";

// Below-the-fold sections - lazy loaded
const DebtTypes = lazy(() => import("@/components/landing/DebtTypes"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const Stats = lazy(() => import("@/components/landing/Stats"));
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const Services = lazy(() => import("@/components/landing/Services"));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA"));
const Footer = lazy(() => import("@/components/landing/Footer"));

// Modal - only loads when user clicks CTA
const LeadFunnel = lazy(() => import("@/components/landing/LeadFunnel"));

// Minimal section placeholder to prevent layout shift
const SectionFallback = () => <div className="min-h-[200px]" />;

const Index = () => {
  const [showFunnel, setShowFunnel] = useState(false);
  const [debtAmount, setDebtAmount] = useState(25000);

  const handleGetStarted = () => setShowFunnel(true);
  const handleCloseFunnel = () => setShowFunnel(false);

  return (
    <main className="min-h-screen">
      {/* Critical above-the-fold content */}
      <Header />
      <Hero onGetStarted={handleGetStarted} debtAmount={debtAmount} setDebtAmount={setDebtAmount} />
      <TrustBadges />
      
      {/* Below-the-fold content - lazy loaded */}
      <Suspense fallback={<SectionFallback />}>
        <DebtTypes />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Services onGetStarted={handleGetStarted} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FinalCTA onGetStarted={handleGetStarted} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
      
      {/* Modal - only rendered when needed */}
      {showFunnel && (
        <Suspense fallback={null}>
          <LeadFunnel initialDebtAmount={debtAmount} onClose={handleCloseFunnel} />
        </Suspense>
      )}
    </main>
  );
};

export default Index;
