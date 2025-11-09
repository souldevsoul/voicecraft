"use client"

import { Container } from "@/components/ui/container"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import { RiTruckLine, RiTimeLine, RiGlobalLine, RiCheckLine } from "react-icons/ri"

export default function DeliveryPolicyPage() {
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
              <RiTruckLine className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-wider">Delivery Policy</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              DELIVERY POLICY
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              VoiceCraft is a digital service platform. Understand how we deliver our services to you.
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
            {/* Digital Service */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiTruckLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">1. Nature of Service</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Digital Service Delivery</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    VoiceCraft is a 100% digital service platform. We do not ship physical goods. All services are delivered electronically via our web application and API.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    There are no shipping addresses, tracking numbers, or physical delivery logistics involved with our service.
                  </p>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">What Gets Delivered</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Instant access to VoiceCraft web application</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>AI voice generation and synthesis services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Voice cloning capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Generated audio files (downloadable MP3/WAV)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>API access for programmatic usage (Pro and Enterprise plans)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Delivery Timing */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiTimeLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">2. Delivery Timeframes</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Account Access</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <span className="font-bold">Delivery Time:</span> Instant
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    After successful payment processing, your account is immediately upgraded to the selected plan tier. Access is granted within seconds of payment confirmation.
                  </p>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Voice Generation</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><span className="font-bold">Standard voice generation:</span> 5-30 seconds depending on text length</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><span className="font-bold">Voice cloning:</span> 2-5 minutes for initial model training</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span><span className="font-bold">Batch processing:</span> Varies based on queue length and content volume</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Confirmation & Receipts</h3>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold">Email confirmation:</span> Sent immediately upon successful payment and service activation. Receipts include transaction details, plan information, and next billing date.
                  </p>
                </div>
              </div>
            </div>

            {/* Geographic Availability */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiGlobalLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">3. Geographic Availability</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Global Service</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    VoiceCraft services are available worldwide. You can access our platform from anywhere with an internet connection.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-bold">Requirements:</span> Internet connection, modern web browser (Chrome, Firefox, Safari, Edge), valid payment method.
                  </p>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Regional Restrictions</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Our services may not be available in regions where:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>International sanctions prohibit service delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Local laws restrict AI-generated content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Payment processing is unavailable</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Contact <a href="mailto:support@voicecraft.ai" className="font-bold underline hover:no-underline">support@voicecraft.ai</a> to verify service availability in your region.
                  </p>
                </div>
              </div>
            </div>

            {/* Service Interruptions */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center">
                  <RiCheckLine className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold uppercase">4. Service Availability & Uptime</h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                  <h3 className="text-lg font-bold uppercase mb-3">Uptime Commitment</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <span className="font-bold">Target Uptime:</span> 99.9% monthly uptime
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We strive to maintain continuous service availability. Scheduled maintenance is announced in advance via email and status page.
                  </p>
                </div>

                <div className="p-6 bg-yellow-50 border-4 border-black">
                  <h3 className="text-lg font-bold uppercase mb-3">Planned Maintenance</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Scheduled during low-traffic periods (typically 2-4 AM PST)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>48-hour advance notice via email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-black font-bold">•</span>
                      <span>Real-time status updates at status.voicecraft.ai</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                  <h3 className="text-lg font-bold uppercase mb-3 text-yellow-400">Unplanned Outages</h3>
                  <p className="leading-relaxed mb-3">
                    In rare cases of unplanned service interruption:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Immediate notification via status page and email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Transparent ETAs for service restoration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Post-incident reports for major outages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span>Potential service credits for extended downtime (see Refund Policy)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enterprise Delivery */}
            <div>
              <div className="p-8 bg-yellow-400 border-4 border-black brutalist-shadow">
                <h2 className="text-2xl font-bold uppercase mb-4">ENTERPRISE CUSTOMERS</h2>
                <p className="text-gray-900 leading-relaxed mb-4">
                  <span className="font-bold">Custom Delivery Options:</span> Enterprise customers may have custom service delivery terms including:
                </p>
                <ul className="space-y-2 text-gray-900">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Dedicated API endpoints with guaranteed response times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Priority queue processing for batch jobs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Custom SLA with uptime guarantees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>White-label delivery options</span>
                  </li>
                </ul>
                <p className="text-gray-900 leading-relaxed mt-4">
                  Contact: <a href="mailto:enterprise@voicecraft.ai" className="underline hover:no-underline font-bold">enterprise@voicecraft.ai</a>
                </p>
              </div>
            </div>

            {/* Failed Delivery */}
            <div>
              <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                <h2 className="text-2xl font-bold uppercase mb-4 text-yellow-400">
                  IF SERVICE DELIVERY FAILS
                </h2>
                <p className="leading-relaxed mb-4">
                  If you experience issues accessing our service after payment:
                </p>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-yellow-400">1.</span>
                    <span>Check your email for payment confirmation and account activation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-yellow-400">2.</span>
                    <span>Verify your internet connection and browser compatibility</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-yellow-400">3.</span>
                    <span>Clear browser cache and cookies, then try logging in again</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-yellow-400">4.</span>
                    <span>Check status.voicecraft.ai for any ongoing service issues</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-yellow-400">5.</span>
                    <span>Contact support@voicecraft.ai immediately - we'll resolve within 24 hours</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="p-8 bg-white border-4 border-black brutalist-shadow text-center">
                <h2 className="text-2xl font-bold uppercase mb-4">DELIVERY SUPPORT</h2>
                <p className="text-gray-700 mb-6">
                  Questions about service delivery or experiencing access issues?
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
                  <p>
                    <span className="font-bold">Status Page:</span>{" "}
                    <a href="https://status.voicecraft.ai" className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">
                      status.voicecraft.ai
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
