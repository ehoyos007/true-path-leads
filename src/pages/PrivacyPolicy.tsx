import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                <strong>Effective Date:</strong> January 1, 2025
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-10 text-foreground/90">
              
              {/* Section 1: Introduction */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  1. Introduction
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    True Horizon Financial ("we," "us," or "our") is committed to protecting your privacy 
                    and ensuring the security of your personal information. This Privacy Policy explains 
                    how we collect, use, disclose, and safeguard your information when you visit our 
                    website or use our services.
                  </p>
                  <p>
                    In this policy, "you" and "your" refer to you as the user of our website and services. 
                    By accessing or using our website, you consent to the collection, use, and disclosure 
                    of your information as described in this Privacy Policy.
                  </p>
                </div>
              </section>

              {/* Section 2: Information We Collect */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  2. Information We Collect
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      2.1 Personal Information
                    </h3>
                    <p className="leading-relaxed">
                      We may collect personal information that you voluntarily provide to us, including 
                      but not limited to your name, email address, phone number, and any other information 
                      you submit through our contact forms or consultation requests.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      2.2 Financial Information
                    </h3>
                    <p className="leading-relaxed">
                      When you use our debt consulting services or payment processing features, we may 
                      collect financial information such as credit card details and other sensitive data 
                      necessary to facilitate our services. This information is collected only when 
                      explicitly provided by you and is handled with the highest level of security.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      2.3 Usage Data
                    </h3>
                    <p className="leading-relaxed">
                      We automatically collect certain information when you visit our website, including 
                      your IP address, browser type, operating system, referring URLs, pages visited, 
                      and other usage data. This information helps us improve our website and services.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Use of Information */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  3. Use of Information
                </h2>
                <p className="mb-4 leading-relaxed">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To personalize your website experience and deliver content tailored to your interests</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To send you service updates, promotional materials, and other communications (you may opt out at any time)</li>
                  <li>To facilitate debt relief services, creditor negotiations, and matching you with appropriate lenders or service providers</li>
                  <li>To comply with applicable laws, regulations, and legal processes</li>
                </ul>
              </section>

              {/* Section 4: Information Sharing */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  4. Information Sharing
                </h2>
                <p className="mb-4 leading-relaxed">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Service Providers:</strong> We may share your information with third-party 
                    service providers who assist us in operating our website and providing our services. 
                    These providers are obligated to protect your data and use it only for the purposes 
                    we specify.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale 
                    of all or a portion of our assets, your information may be transferred as part of 
                    that transaction.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose your information when required 
                    by law or to protect our rights, safety, or the rights and safety of others.
                  </li>
                </ul>
              </section>

              {/* Section 5: Data Security */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  5. Data Security
                </h2>
                <p className="leading-relaxed">
                  We implement reasonable administrative, technical, and physical security measures to 
                  protect your personal information from unauthorized access, use, or disclosure. However, 
                  please be aware that no method of transmission over the Internet or electronic storage 
                  is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              {/* Section 6: Data Retention */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  6. Data Retention
                </h2>
                <p className="leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes 
                  outlined in this Privacy Policy, unless a longer retention period is required or 
                  permitted by law. When your information is no longer needed, we will securely delete 
                  or anonymize it.
                </p>
              </section>

              {/* Section 7: Your Rights */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  7. Your Rights
                </h2>
                <p className="mb-4 leading-relaxed">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Access and Correction:</strong> You may request access to the personal 
                    information we hold about you and request corrections to any inaccuracies.
                  </li>
                  <li>
                    <strong>Withdrawal of Consent:</strong> You may withdraw your consent to our 
                    processing of your personal information at any time, subject to legal or 
                    contractual restrictions.
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> You may opt out of receiving marketing communications 
                    from us by following the unsubscribe instructions in our emails or by contacting 
                    us directly.
                  </li>
                </ul>
              </section>

              {/* Section 8: Third-Party Websites */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  8. Third-Party Websites
                </h2>
                <p className="leading-relaxed">
                  Our website may contain links to third-party websites. Please be aware that we are 
                  not responsible for the privacy practices of these external sites. We encourage you 
                  to review the privacy policies of any third-party websites you visit.
                </p>
              </section>

              {/* Section 9: Contact Us */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  9. Contact Us
                </h2>
                <p className="leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, 
                  please contact us at:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium">True Horizon Financial</p>
                  <p>Email: privacy@truehorizonfinancial.com</p>
                  <p>Los Angeles, CA</p>
                </div>
              </section>

              {/* Section 10: Changes to This Policy */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="leading-relaxed">
                  We reserve the right to update or modify this Privacy Policy at any time. Any changes 
                  will be reflected by updating the "Effective Date" at the top of this page. We encourage 
                  you to review this Privacy Policy periodically to stay informed about how we are 
                  protecting your information.
                </p>
              </section>

              {/* Service Disclaimer */}
              <section className="mt-12 pt-8 border-t border-border">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Important Disclaimer
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    True Horizon Financial provides consultative services to match consumers with 
                    licensed financial lenders or debt settlement companies. True Horizon Financial 
                    is not a lender, broker, mortgage company, or attorney network. We do not take 
                    loan applications, originate, service, underwrite, or make loans. Any inquiry 
                    submitted is not a credit application with True Horizon Financial but a request 
                    to be matched with a licensed financial services professional.
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
