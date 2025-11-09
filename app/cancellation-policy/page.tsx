"use client"

import { Container } from "@/components/ui/container"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import { RiCloseLine, RiTimeLine, RiCheckLine, RiAlertLine } from "react-icons/ri"

export default function CancellationPolicyPage() {
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
              <RiCloseLine className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-wider">Cancellation Policy</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              CANCELLATION POLICY
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              You can cancel your VoiceCraft subscription at any time. No questions asked, no hassle.
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
            {/* How to Cancel */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiCloseLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">1. How to Cancel</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Cancel Through Dashboard</h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-black">1.</span>
                      <span>Log in to your VoiceCraft account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-black">2.</span>
                      <span>Navigate to Settings → Subscription</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-black">3.</span>
                      <span>Click "Cancel Subscription"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-black">4.</span>
                      <span>Confirm cancellation when prompted</span>
                    </li>
                  </ol>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Cancel Via Email</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Alternatively, send an email to{" "}
                    <a href="mailto:support@voicecraft.ai" className="font-bold underline hover:no-underline">
                      support@voicecraft.ai
                    </a>{" "}
                    with:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      Your account email address
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      Subject line: "Cancel Subscription"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      We'll process your cancellation within 24 hours
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What Happens */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiTimeLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">2. What Happens After Cancellation</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Immediate Effects</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <RiCheckLine className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>Your subscription is marked for cancellation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <RiCheckLine className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>You will not be charged again</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <RiCheckLine className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span>You receive a cancellation confirmation email</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Access Retention</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <span className="font-bold">You keep full access</span> to all features until the end of your current billing period.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    For example: If you cancel on January 15th and your billing period ends on January 31st, you have access until January 31st at 11:59 PM.
                  </p>
                </div>

                <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                  <h3 className="text-lg font-bold uppercase mb-3 text-yellow-400">After Billing Period Ends</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Your account downgrades to Free tier</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Pro features are disabled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Character limits reset to Free tier limits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Voice clones remain accessible (up to Free tier limit)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Historical generated audio is deleted after 30 days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Specific Scenarios */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiAlertLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">3. Cancellation Scenarios</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Free Trial Cancellation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cancel anytime during your 14-day free trial without being charged. No payment information is required to cancel a trial.
                  </p>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Monthly Subscription</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cancel anytime. You keep access until the end of your current month. No refund for unused portion of the month (see Refund Policy for exceptions).
                  </p>
                </div>

                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Annual Subscription</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cancel anytime. You keep access until the end of your annual term. No refund for unused months (see Refund Policy for eligible circumstances).
                  </p>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Enterprise Plans</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Enterprise customers should refer to their specific contract terms. Contact your account manager or email enterprise@voicecraft.ai for cancellation procedures.
                  </p>
                </div>
              </div>
            </div>

            {/* Reactivation */}
            <div>
              <div className="p-8 bg-yellow-400 border-4 border-black brutalist-shadow">
                <h2 className="text-2xl font-bold uppercase mb-4">REACTIVATING YOUR SUBSCRIPTION</h2>
                <p className="text-gray-900 leading-relaxed mb-4">
                  Changed your mind? You can reactivate your subscription at any time before your billing period ends by visiting Settings → Subscription → Reactivate.
                </p>
                <p className="text-gray-900 leading-relaxed">
                  After your billing period ends, you can start a new subscription at any time. Your voice clones and account data are retained for 90 days after cancellation.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div>
              <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                <h2 className="text-2xl font-bold uppercase mb-4 text-yellow-400">
                  DATA RETENTION AFTER CANCELLATION
                </h2>
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    <span className="font-bold text-yellow-400">Account Data:</span> Retained for 90 days, then deleted if subscription not renewed
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-bold text-yellow-400">Voice Clones:</span> Retained for 90 days, accessible if you resubscribe
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-bold text-yellow-400">Generated Audio:</span> Automatically deleted 30 days after cancellation
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-bold text-yellow-400">Billing History:</span> Retained for 7 years for legal/tax compliance
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="p-8 bg-white border-4 border-black brutalist-shadow text-center">
                <h2 className="text-2xl font-bold uppercase mb-4">NEED HELP?</h2>
                <p className="text-gray-700 mb-6">
                  Before canceling, let us know if there's anything we can do to improve your experience.
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
