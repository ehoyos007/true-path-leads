import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Terms and Conditions
              </h1>
              <p className="text-muted-foreground">
                <strong>Effective Date:</strong> February 11, 2026
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
                    Welcome to True Horizon Financial LLC ("Company," "we," "us," or "our"). These
                    Terms and Conditions ("Terms") govern your access to and use of our website,
                    services, and any related content. By accessing or using our website, you agree
                    to be bound by these Terms. If you do not agree with any part of these Terms,
                    you must not use our website or services.
                  </p>
                  <p>
                    True Horizon Financial LLC is located in Miami, FL. These Terms constitute a
                    legally binding agreement between you and the Company.
                  </p>
                </div>
              </section>

              {/* Section 2: Eligibility */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  2. Eligibility
                </h2>
                <p className="leading-relaxed">
                  You must be at least 18 years of age to use our website and services. By using
                  our website, you represent and warrant that you are at least 18 years old and
                  have the legal capacity to enter into these Terms. If you are under 18 years of
                  age, you are not permitted to use our services.
                </p>
              </section>

              {/* Section 3: Description of Services */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  3. Description of Services
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    True Horizon Financial LLC provides consultative services and may refer
                    consumers to independent, licensed third-party financial service providers
                    when appropriate.
                  </p>
                  <p>
                    <strong>
                      True Horizon Financial LLC is NOT a debt relief provider, lender, broker,
                      mortgage company, debt settlement company, debt negotiation company, debt
                      management company, law firm, or credit repair organization.
                    </strong>{" "}
                    We do not provide debt settlement, debt negotiation, or debt management
                    services directly. Any information you submit through our website is not a
                    credit application with True Horizon Financial LLC, but a request to be
                    connected with a licensed professional.
                  </p>
                </div>
              </section>

              {/* Section 4: No Guarantees */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  4. No Guarantees
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    Our services may not be suitable for everyone. Results, including but not
                    limited to potential savings, debt reduction, improved credit, or approval
                    for any financial product, are <strong>not guaranteed</strong>. Outcomes vary
                    based on individual circumstances, creditor participation, and the services
                    provided by third-party providers.
                  </p>
                  <p>
                    We make no representations or warranties regarding the results you may
                    achieve through the use of our services or the services of any third-party
                    provider to whom we may refer you.
                  </p>
                </div>
              </section>

              {/* Section 5: TCPA / SMS Consent */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  5. TCPA / SMS Consent Disclosure
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    By submitting a form on our website and opting in to receive SMS
                    communications, you expressly consent to receive calls and text messages
                    from True Horizon Financial LLC, its affiliates, and/or its service providers
                    at the phone number you provided. This consent applies to calls and messages
                    made using an automatic telephone dialing system or prerecorded voice.
                  </p>
                  <p>
                    <strong>Message frequency varies.</strong> Message and data rates may apply.
                    You may opt out of receiving text messages at any time by replying{" "}
                    <strong>STOP</strong> to any message. For help, reply{" "}
                    <strong>HELP</strong>. Your consent to receive SMS communications is not a
                    condition of purchasing any goods or services.
                  </p>
                </div>
              </section>

              {/* Section 6: User Responsibilities */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  6. User Responsibilities
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>By using our services, you agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Provide accurate, current, and complete information when submitting any
                      forms or requests through our website
                    </li>
                    <li>
                      Understand and acknowledge that your information may be shared with
                      third-party service providers for the purpose of connecting you with
                      appropriate financial services
                    </li>
                    <li>
                      Use our website and services only for lawful purposes and in accordance
                      with these Terms
                    </li>
                    <li>
                      Not engage in any activity that could harm, disable, or impair the
                      functionality of our website
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 7: Third-Party Services */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  7. Third-Party Services
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    True Horizon Financial LLC may refer you to independent, licensed third-party
                    financial service providers. These providers operate independently and are not
                    employees, agents, or representatives of True Horizon Financial LLC.
                  </p>
                  <p>
                    We are not responsible for the services, terms, conditions, privacy practices,
                    or outcomes of any third-party provider. Your interactions with third-party
                    providers are governed by their own terms and policies, and you should review
                    them carefully before engaging their services.
                  </p>
                </div>
              </section>

              {/* Section 8: Limitation of Liability */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  8. Limitation of Liability
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    To the fullest extent permitted by applicable law, True Horizon Financial LLC,
                    its officers, directors, employees, and agents shall not be liable for any
                    indirect, incidental, special, consequential, or punitive damages arising out
                    of or relating to your use of our website or services, including but not
                    limited to loss of profits, data, or other intangible losses.
                  </p>
                  <p>
                    Our total liability to you for any claims arising from your use of our
                    services shall not exceed the amount you paid to us, if any, during the
                    twelve (12) months preceding the claim.
                  </p>
                </div>
              </section>

              {/* Section 9: Arbitration */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  9. Dispute Resolution & Arbitration
                </h2>
                <div className="space-y-4 leading-relaxed">
                  <p>
                    Any dispute, claim, or controversy arising out of or relating to these Terms
                    or your use of our services shall be resolved through{" "}
                    <strong>binding individual arbitration</strong> in accordance with the rules
                    of the American Arbitration Association (AAA). Arbitration shall take place in
                    Miami-Dade County, Florida.
                  </p>
                  <p>
                    <strong>
                      You agree to waive any right to participate in a class action lawsuit or
                      class-wide arbitration.
                    </strong>{" "}
                    All disputes must be brought in the parties' individual capacity, and not as
                    a plaintiff or class member in any purported class or representative
                    proceeding.
                  </p>
                </div>
              </section>

              {/* Section 10: Changes to Terms */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  10. Changes to These Terms
                </h2>
                <p className="leading-relaxed">
                  We reserve the right to update or modify these Terms at any time without prior
                  notice. Any changes will be reflected by updating the "Effective Date" at the
                  top of this page. Your continued use of our website and services after any
                  changes constitutes your acceptance of the revised Terms. We encourage you to
                  review these Terms periodically.
                </p>
              </section>

              {/* Section 11: Contact Us */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  11. Contact Us
                </h2>
                <p className="leading-relaxed mb-4">
                  If you have any questions about these Terms and Conditions, please contact us
                  at:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium">True Horizon Financial LLC</p>
                  <p>Email: notifications@thfinancial.org</p>
                  <p>Miami, FL</p>
                </div>
              </section>

              {/* Service Disclaimer */}
              <section className="mt-12 pt-8 border-t border-border">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Important Disclaimer
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    True Horizon Financial LLC provides consultative services to match consumers
                    with licensed financial lenders or debt settlement companies. True Horizon
                    Financial LLC is not a lender, broker, mortgage company, or attorney network.
                    We do not take loan applications, originate, service, underwrite, or make
                    loans. Any inquiry submitted is not a credit application with True Horizon
                    Financial LLC but a request to be matched with a licensed financial services
                    professional.
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

export default TermsOfService;
