"use client"

import { Container } from "@/components/ui/container"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import { RiRefundLine, RiTimeLine, RiCheckLine, RiMailLine } from "react-icons/ri"

export default function RefundPolicyPage() {
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

      {/* Hero */}
      <section className="py-20 border-b-8 border-black">
        <Container maxWidth="xl">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-black mb-8">
              <RiRefundLine className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-wider">Refund Policy</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              REFUND & RETURN POLICY
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Our commitment to customer satisfaction. Understand our refund and return policy for VoiceCraft services.
            </p>
            <p className="text-sm font-bold uppercase text-gray-900">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </Container>
      </section>

      {/* Policy Content */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* General Policy */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiRefundLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">1. General Refund Policy</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Digital Service</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    VoiceCraft is a digital service platform. Once voice generation or voice cloning services are rendered, they cannot be "returned" in the traditional sense as they are immediately consumed digital services.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    However, we stand behind the quality of our service and offer refunds under specific circumstances outlined below.
                  </p>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">14-Day Free Trial</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All Pro plan subscriptions include a 14-day free trial. You can cancel at any time during this trial period without being charged. No refund is necessary as no payment has been processed.
                  </p>
                </div>
              </div>
            </div>

            {/* Eligible Refunds */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiCheckLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">2. Eligible for Refund</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Technical Issues</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    You are eligible for a full refund if:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      Our service was unavailable for more than 24 consecutive hours
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      You experienced repeated technical errors preventing service usage
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      Voice generation consistently failed to produce output
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      We were unable to resolve technical issues within 48 hours of your support request
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Billing Errors</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    You are eligible for a refund if:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      You were charged incorrectly due to our billing system error
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      You were double-charged for the same subscription period
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      You were charged after cancellation was processed
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">First-Time Subscription</h3>
                  <p className="text-gray-700 leading-relaxed">
                    For first-time paid subscribers who are not satisfied with the service, you may request a refund within 7 days of your first charge. This one-time courtesy refund is available once per customer.
                  </p>
                </div>
              </div>
            </div>

            {/* Not Eligible */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiTimeLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">3. Not Eligible for Refund</h2>
              </div>

              <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                <h3 className="text-lg font-bold uppercase mb-4 text-yellow-400">The Following Are NOT Eligible:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Change of mind after using the service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Dissatisfaction with AI-generated voice quality (subjective opinion)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Already used character credits (partial refunds not available)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Cancellation after the refund eligibility period has passed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Violation of our Terms of Service resulting in account termination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>Third-party API costs incurred (we pass through costs from Replicate)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Refund Process */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiMailLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">4. How to Request a Refund</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Step 1: Contact Support</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Email our support team at{" "}
                    <a href="mailto:support@voicecraft.ai" className="font-bold underline hover:no-underline">
                      support@voicecraft.ai
                    </a>{" "}
                    with the subject line "Refund Request"
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Include: Your account email, reason for refund request, order/transaction ID, and any supporting documentation (screenshots, error messages, etc.)
                  </p>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Step 2: Review Process</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our team will review your request within 2-3 business days. We may contact you for additional information or to attempt to resolve any technical issues.
                  </p>
                </div>

                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Step 3: Decision & Processing</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    If approved, refunds are processed within 5-7 business days. Refunds are issued to the original payment method.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold">Note:</span> Depending on your bank or card issuer, it may take an additional 3-5 business days for the refund to appear in your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Cancellation */}
            <div>
              <div className="p-8 bg-yellow-400 border-4 border-black brutalist-shadow">
                <h2 className="text-2xl font-bold uppercase mb-4">CANCELLATION VS. REFUND</h2>
                <p className="text-gray-900 leading-relaxed mb-4">
                  <span className="font-bold">Cancellation:</span> You can cancel your subscription at any time through your account settings. You will retain access until the end of your current billing period, but no refund will be issued for the remaining time.
                </p>
                <p className="text-gray-900 leading-relaxed">
                  <span className="font-bold">Refund:</span> A refund returns money already paid and is only available under the eligible circumstances outlined above.
                </p>
              </div>
            </div>

            {/* Enterprise */}
            <div>
              <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                <h2 className="text-2xl font-bold uppercase mb-4 text-yellow-400">
                  ENTERPRISE CUSTOMERS
                </h2>
                <p className="text-white leading-relaxed">
                  Enterprise customers with custom contracts should refer to their specific Service Level Agreement (SLA) for refund terms. Enterprise refund policies may differ from standard plans.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="p-8 bg-white border-4 border-black brutalist-shadow text-center">
                <h2 className="text-2xl font-bold uppercase mb-4">QUESTIONS?</h2>
                <p className="text-gray-700 mb-6">
                  If you have questions about our refund policy, please contact us:
                </p>
                <div className="space-y-2">
                  <p>
                    <span className="font-bold">Email:</span>{" "}
                    <a href="mailto:support@voicecraft.ai" className="underline hover:no-underline">
                      support@voicecraft.ai
                    </a>
                  </p>
                  <p>
                    <span className="font-bold">Phone:</span>{" "}
                    <a href="tel:+14155551234" className="underline hover:no-underline">
                      +1 (415) 555-1234
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
