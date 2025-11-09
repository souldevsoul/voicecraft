"use client"

import { Container } from "@/components/ui/container"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import { RiSecurePaymentLine, RiMoneyDollarCircleLine, RiShieldCheckLine, RiAlertLine } from "react-icons/ri"
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from "react-icons/si"

export default function PaymentPolicyPage() {
  const lastUpdated = "November 8, 2025"

  return (
    <main className="min-h-screen bg-white">
      <Header
        logoText="VoiceCraft"
        navLinks={[
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
          { label: "Demo", href: "/demo" },
        ]}
        ctaButton={{
          text: "Get Started",
          href: "/signup",
        }}
      />

      <section className="py-20 border-b-8 border-black">
        <Container maxWidth="xl">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-black mb-8">
              <RiSecurePaymentLine className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-wider">Payment Policy</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              PAYMENT POLICY
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Secure, transparent, and compliant payment processing. Understand how payments work on VoiceCraft.
            </p>
            <p className="text-sm font-bold uppercase text-gray-900">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container maxWidth="xl">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Payment Methods */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiSecurePaymentLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">1. Accepted Payment Methods</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-4">Credit & Debit Cards</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-3 border-2 border-black flex items-center justify-center">
                      <SiVisa className="w-16 h-12 text-[#1A1F71]" />
                    </div>
                    <div className="bg-white p-3 border-2 border-black flex items-center justify-center">
                      <SiMastercard className="w-16 h-12" />
                    </div>
                    <div className="bg-white p-3 border-2 border-black flex items-center justify-center">
                      <SiApplepay className="w-16 h-12 text-black" />
                    </div>
                    <div className="bg-white p-3 border-2 border-black flex items-center justify-center">
                      <SiGooglepay className="w-16 h-12" />
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We accept all major credit and debit cards: Visa, Mastercard, American Express, and Discover. We also support digital wallets including Apple Pay and Google Pay for fast and secure checkout.
                  </p>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Payment Processor</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All payments are processed securely through Stripe, a PCI DSS Level 1 compliant payment processor. VoiceCraft does not store your complete credit card information on our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Billing */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiMoneyDollarCircleLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">2. Billing & Charges</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Subscription Billing</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><span className="font-bold">Monthly plans:</span> Charged on the same day each month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><span className="font-bold">Annual plans:</span> Charged once per year on subscription anniversary</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><span className="font-bold">Billing in advance:</span> All plans are billed at the beginning of the period</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><span className="font-bold">Automatic renewal:</span> Subscriptions auto-renew until cancelled</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Currency & Pricing</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <span className="font-bold">Primary Currency:</span> United States Dollar (USD)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    All prices are displayed in USD. If your bank or card is in a different currency, your financial institution will convert the charge at their current exchange rate.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold">Note:</span> Your bank may charge currency conversion fees. These fees are set by your bank, not by VoiceCraft.
                  </p>
                </div>

                <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                  <h3 className="text-lg font-bold uppercase mb-3 text-yellow-400">No Minimum or Maximum Transaction Amounts</h3>
                  <p className="leading-relaxed">
                    In compliance with Visa and Mastercard regulations, we do not impose minimum or maximum transaction amounts for card payments. All subscription tiers are available regardless of payment amount.
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiShieldCheckLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">3. Payment Security</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">PCI DSS Compliance</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>PCI DSS Level 1 certified payment processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>256-bit SSL/TLS encryption for all transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Tokenized card storage (we never store complete card numbers)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>3D Secure authentication for supported cards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Fraud detection and prevention systems</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">What We Store</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    For your convenience, we store:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Last 4 digits of your card</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Card expiration date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Card brand (Visa, Mastercard, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Billing address</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    <span className="font-bold">We do NOT store:</span> Complete card numbers or CVV/CVC security codes
                  </p>
                </div>
              </div>
            </div>

            {/* Failed Payments */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiAlertLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">4. Failed Payments & Retries</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Automatic Retry</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    If a payment fails, we will automatically retry up to 3 times over 7 days:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>1st retry: 3 days after initial failure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>2nd retry: 5 days after initial failure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>3rd retry: 7 days after initial failure</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Account Suspension</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If all retry attempts fail, your subscription will be suspended. You can reactivate by updating your payment method. No data is deleted during suspension.
                  </p>
                </div>

                <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                  <h3 className="text-lg font-bold uppercase mb-3 text-yellow-400">Email Notifications</h3>
                  <p className="leading-relaxed">
                    We will email you immediately when a payment fails and before each retry attempt. Please update your payment information promptly to avoid service interruption.
                  </p>
                </div>
              </div>
            </div>

            {/* Taxes */}
            <div>
              <div className="p-8 bg-yellow-400 border-4 border-black brutalist-shadow">
                <h2 className="text-2xl font-bold uppercase mb-4">TAXES & VAT</h2>
                <p className="text-gray-900 leading-relaxed mb-4">
                  <span className="font-bold">Prices are exclusive of taxes.</span> Depending on your location, applicable taxes (VAT, GST, sales tax) may be added to your invoice.
                </p>
                <p className="text-gray-900 leading-relaxed mb-4">
                  Tax rates are determined by your billing address and local regulations. If you are a business in the EU with a valid VAT number, you may be eligible for reverse charge mechanism.
                </p>
                <p className="text-gray-900 leading-relaxed">
                  For questions about taxes, contact: <a href="mailto:billing@voicecraft.ai" className="underline hover:no-underline font-bold">billing@voicecraft.ai</a>
                </p>
              </div>
            </div>

            {/* Disputes */}
            <div>
              <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                <h2 className="text-2xl font-bold uppercase mb-4 text-yellow-400">
                  PAYMENT DISPUTES & CHARGEBACKS
                </h2>
                <p className="leading-relaxed mb-4">
                  <span className="font-bold">Contact us first:</span> If you see an unexpected charge, please contact us at support@voicecraft.ai before initiating a chargeback. We can often resolve issues quickly.
                </p>
                <p className="leading-relaxed mb-4">
                  <span className="font-bold">Right to dispute:</span> In accordance with Visa and Mastercard regulations, you have the right to dispute transactions with your card issuer.
                </p>
                <p className="leading-relaxed">
                  <span className="font-bold">Chargeback consequences:</span> Accounts with chargebacks may be suspended pending investigation. Fraudulent chargebacks may result in permanent account termination.
                </p>
              </div>
            </div>

            {/* Invoice */}
            <div>
              <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                <h2 className="text-2xl font-bold uppercase mb-4">INVOICES & RECEIPTS</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Automatic email receipts for all charges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Download invoices from your account dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Invoices include: company info, transaction details, tax information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Historical invoices retained for 7 years</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="p-8 bg-yellow-50 border-4 border-black text-center">
                <h2 className="text-2xl font-bold uppercase mb-4">PAYMENT QUESTIONS?</h2>
                <p className="text-gray-700 mb-6">
                  Contact our billing team for payment-related inquiries
                </p>
                <div className="space-y-2">
                  <p>
                    <span className="font-bold">Email:</span>{" "}
                    <a href="mailto:billing@voicecraft.ai" className="underline hover:no-underline">
                      billing@voicecraft.ai
                    </a>
                  </p>
                  <p>
                    <span className="font-bold">Support:</span>{" "}
                    <a href="mailto:support@voicecraft.ai" className="underline hover:no-underline">
                      support@voicecraft.ai
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
