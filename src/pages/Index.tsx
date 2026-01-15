import { useState } from "react";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import DebtTypes from "@/components/landing/DebtTypes";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import Services from "@/components/landing/Services";
import TrustBadges from "@/components/landing/TrustBadges";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import LeadFunnel from "@/components/landing/LeadFunnel";

const Index = () => {
  const [showFunnel, setShowFunnel] = useState(false);
  const [debtAmount, setDebtAmount] = useState(25000);

  const handleGetStarted = () => setShowFunnel(true);
  const handleCloseFunnel = () => setShowFunnel(false);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero onGetStarted={handleGetStarted} debtAmount={debtAmount} setDebtAmount={setDebtAmount} />
      <TrustBadges />
      <DebtTypes />
      <HowItWorks />
      <Stats />
      <Services onGetStarted={handleGetStarted} />
      <Testimonials />
      <FinalCTA onGetStarted={handleGetStarted} />
      <Footer />
      
      {showFunnel && <LeadFunnel initialDebtAmount={debtAmount} onClose={handleCloseFunnel} />}
    </main>
  );
};

export default Index;
