"use client"

import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import {
  RiSparklingLine,
  RiCheckLine,
  RiCloseLine,
  RiArrowRightLine,
  RiQuestionLine,
  RiShieldCheckLine,
  RiFlashlightLine,
  RiMicLine,
  RiGlobalLine,
} from "react-icons/ri"

export default function PricingPage() {
  const pricingTiers = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out VoiceCraft and small projects",
      popular: false,
      features: [
        { text: "5,000 characters/month", included: true },
        { text: "Kokoro-82M voice model", included: true },
        { text: "Basic voice presets", included: true },
        { text: "MP3 audio format", included: true },
        { text: "48kHz sample rate", included: true },
        { text: "Email support", included: true },
        { text: "Voice cloning", included: false },
        { text: "Advanced models", included: false },
        { text: "Team collaboration", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Start Free",
      ctaHref: "/signup",
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For creators and businesses that need powerful voice synthesis",
      popular: true,
      features: [
        { text: "100,000 characters/month", included: true },
        { text: "All voice models (Kokoro, Minimax, XTTS)", included: true },
        { text: "5 custom voice clones", included: true },
        { text: "Emotion control (8 emotions)", included: true },
        { text: "Speed, pitch, volume control", included: true },
        { text: "MP3, WAV, FLAC formats", included: true },
        { text: "50+ languages", included: true },
        { text: "API access", included: true },
        { text: "Priority email support", included: true },
        { text: "Usage analytics", included: true },
      ],
      cta: "Start Free Trial",
      ctaHref: "/signup?plan=pro",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Advanced features, unlimited usage, and dedicated support",
      popular: false,
      features: [
        { text: "Unlimited characters", included: true },
        { text: "All voice models + beta access", included: true },
        { text: "Unlimited voice clones", included: true },
        { text: "Custom voice model training", included: true },
        { text: "Dedicated infrastructure", included: true },
        { text: "SLA guarantee (99.9% uptime)", included: true },
        { text: "Team collaboration (unlimited)", included: true },
        { text: "SSO integration", included: true },
        { text: "Priority 24/7 support", included: true },
        { text: "Custom integrations", included: true },
      ],
      cta: "Contact Sales",
      ctaHref: "/contact",
    },
  ]

  const comparisonFeatures = [
    {
      category: "USAGE LIMITS",
      features: [
        { name: "Characters per month", starter: "5,000", pro: "100,000", enterprise: "Unlimited" },
        { name: "Voice clones", starter: "0", pro: "5", enterprise: "Unlimited" },
        { name: "API requests/min", starter: "10", pro: "60", enterprise: "Custom" },
        { name: "Concurrent generations", starter: "1", pro: "3", enterprise: "Unlimited" },
      ],
    },
    {
      category: "VOICE MODELS",
      features: [
        { name: "Kokoro-82M (56M+ runs)", starter: true, pro: true, enterprise: true },
        { name: "Minimax 2.6 Turbo", starter: false, pro: true, enterprise: true },
        { name: "Minimax 2.6 HD", starter: false, pro: true, enterprise: true },
        { name: "XTTS-v2 Multilingual", starter: false, pro: true, enterprise: true },
        { name: "Beta model access", starter: false, pro: false, enterprise: true },
        { name: "Custom model training", starter: false, pro: false, enterprise: true },
      ],
    },
    {
      category: "FEATURES",
      features: [
        { name: "Basic voice presets", starter: true, pro: true, enterprise: true },
        { name: "Voice cloning (Minimax)", starter: false, pro: true, enterprise: true },
        { name: "Emotion control (8 emotions)", starter: false, pro: true, enterprise: true },
        { name: "Speed & pitch adjustment", starter: true, pro: true, enterprise: true },
        { name: "Volume control", starter: true, pro: true, enterprise: true },
        { name: "50+ languages", starter: false, pro: true, enterprise: true },
        { name: "Audio formats (MP3, WAV, FLAC)", starter: "MP3", pro: true, enterprise: true },
        { name: "Subtitle export", starter: false, pro: true, enterprise: true },
        { name: "Batch processing", starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: "SUPPORT & SECURITY",
      features: [
        { name: "Email support", starter: true, pro: true, enterprise: true },
        { name: "Priority support", starter: false, pro: true, enterprise: true },
        { name: "24/7 support", starter: false, pro: false, enterprise: true },
        { name: "Dedicated account manager", starter: false, pro: false, enterprise: true },
        { name: "GDPR compliance", starter: true, pro: true, enterprise: true },
        { name: "SOC 2 Type II", starter: true, pro: true, enterprise: true },
        { name: "SLA guarantee", starter: false, pro: false, enterprise: "99.9%" },
        { name: "SSO integration", starter: false, pro: false, enterprise: true },
      ],
    },
  ]

  const faqs = [
    {
      question: "How is usage calculated?",
      answer: "Usage is calculated based on the number of characters in your input text. For example, 'Hello World' contains 11 characters (including the space). Characters are counted before text processing, so what you type is what you pay for.",
    },
    {
      question: "What happens if I exceed my character limit?",
      answer: "On the Starter plan, generation will be paused until the next month. On Pro, you can purchase additional character packs for $10 per 50,000 characters. Enterprise plans have unlimited characters.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! All plans can be canceled at any time. If you cancel, you'll retain access until the end of your current billing period, and you won't be charged again.",
    },
    {
      question: "What's the difference between the voice models?",
      answer: "Kokoro-82M is the simplest and most popular (56M+ runs), great for most use cases. Minimax 2.6 Turbo offers advanced features like emotion control and 50+ languages. XTTS-v2 specializes in multilingual voice cloning. Pro plan includes all models.",
    },
    {
      question: "How does voice cloning work?",
      answer: "Upload 10 seconds to 5 minutes of clear audio of the voice you want to clone. Our Minimax-powered technology will create a custom voice profile (voice_id) that you can use with all our synthesis models. The more audio you provide, the better the quality.",
    },
    {
      question: "What audio formats are supported?",
      answer: "Starter plan supports MP3. Pro and Enterprise support MP3, WAV, FLAC, and PCM. All formats can be exported at up to 48kHz sample rate for studio-quality audio.",
    },
    {
      question: "Is there a free trial for Pro?",
      answer: "Yes! All new Pro subscribers get a 14-day free trial. No credit card required to start. Cancel anytime during the trial and you won't be charged.",
    },
    {
      question: "What languages are supported?",
      answer: "Kokoro-82M supports multiple languages. Minimax models support 50+ languages including English, Spanish, French, German, Chinese, Japanese, and more. XTTS-v2 supports 17 languages with voice cloning capabilities.",
    },
    {
      question: "Do you offer discounts for non-profits or education?",
      answer: "Yes! We offer 50% discounts for qualified non-profit organizations and educational institutions. Contact us at sales@voicecraft.ai with your organization details.",
    },
    {
      question: "How secure is my data?",
      answer: "All voice data is encrypted end-to-end (AES-256). We're GDPR compliant and SOC 2 Type II certified. Your audio files and voice clones are never shared with third parties. Enterprise plans can opt for zero data retention.",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="py-20 border-b-8 border-black">
        <Container maxWidth="xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-black mb-8">
              <RiSparklingLine className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-wider">Pricing</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              SIMPLE, TRANSPARENT PRICING
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Start free, scale as you grow. No hidden fees, no surprises. Cancel anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <RiShieldCheckLine className="w-5 h-5 text-black" />
                <span className="font-bold uppercase">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <RiFlashlightLine className="w-5 h-5 text-black" />
                <span className="font-bold uppercase">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <RiCheckLine className="w-5 h-5 text-black" />
                <span className="font-bold uppercase">Cancel anytime</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative p-8 border-4 border-black ${
                  tier.popular
                    ? "bg-black text-white brutalist-shadow-yellow scale-105"
                    : "bg-white brutalist-shadow"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-yellow-400 border-4 border-black">
                    <span className="text-sm font-bold uppercase text-black">Most Popular</span>
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className={`text-2xl font-bold uppercase mb-2 ${
                      tier.popular ? "text-yellow-400" : "text-black"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className={`text-5xl font-bold ${
                        tier.popular ? "text-yellow-400" : "text-black"
                      }`}
                    >
                      {tier.price}
                    </span>
                    <span
                      className={`text-sm font-bold uppercase ${
                        tier.popular ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {tier.period}
                    </span>
                  </div>
                  <p className={`text-sm ${tier.popular ? "text-white" : "text-gray-600"}`}>
                    {tier.description}
                  </p>
                </div>

                <Button
                  size="lg"
                  className={`w-full mb-8 border-4 font-bold uppercase ${
                    tier.popular
                      ? "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300"
                      : "bg-black text-yellow-400 border-black hover:bg-gray-900"
                  }`}
                  asChild
                >
                  <a href={tier.ctaHref}>
                    {tier.cta}
                    <RiArrowRightLine className="w-5 h-5 ml-2" />
                  </a>
                </Button>

                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <RiCheckLine
                          className={`w-5 h-5 flex-shrink-0 ${
                            tier.popular ? "text-yellow-400" : "text-black"
                          }`}
                        />
                      ) : (
                        <RiCloseLine
                          className={`w-5 h-5 flex-shrink-0 ${
                            tier.popular ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? tier.popular
                              ? "text-white"
                              : "text-gray-900"
                            : tier.popular
                            ? "text-gray-500 line-through"
                            : "text-gray-400 line-through"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-24 bg-gray-50 border-y-8 border-black">
        <Container maxWidth="xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              DETAILED FEATURE COMPARISON
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what's included in each plan
            </p>
          </div>

          {comparisonFeatures.map((category, catIndex) => (
            <div key={catIndex} className="mb-8 bg-white border-4 border-black brutalist-shadow">
              <div className="bg-black text-yellow-400 px-6 py-4 border-b-4 border-black">
                <h3 className="text-xl font-bold uppercase">{category.category}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-4 border-black bg-yellow-400">
                      <th className="text-left p-4 font-bold uppercase text-sm">Feature</th>
                      <th className="text-center p-4 font-bold uppercase text-sm border-l-4 border-black">
                        Starter
                      </th>
                      <th className="text-center p-4 font-bold uppercase text-sm border-l-4 border-black">
                        Pro
                      </th>
                      <th className="text-center p-4 font-bold uppercase text-sm border-l-4 border-black">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.features.map((feature, featIndex) => (
                      <tr key={featIndex} className="border-b-2 border-gray-200 last:border-0">
                        <td className="p-4 font-medium">{feature.name}</td>
                        <td className="text-center p-4 border-l-4 border-black">
                          {typeof feature.starter === "boolean" ? (
                            feature.starter ? (
                              <RiCheckLine className="w-6 h-6 text-black mx-auto" />
                            ) : (
                              <RiCloseLine className="w-6 h-6 text-gray-400 mx-auto" />
                            )
                          ) : (
                            <span className="font-bold">{feature.starter}</span>
                          )}
                        </td>
                        <td className="text-center p-4 border-l-4 border-black bg-yellow-50">
                          {typeof feature.pro === "boolean" ? (
                            feature.pro ? (
                              <RiCheckLine className="w-6 h-6 text-black mx-auto" />
                            ) : (
                              <RiCloseLine className="w-6 h-6 text-gray-400 mx-auto" />
                            )
                          ) : (
                            <span className="font-bold">{feature.pro}</span>
                          )}
                        </td>
                        <td className="text-center p-4 border-l-4 border-black">
                          {typeof feature.enterprise === "boolean" ? (
                            feature.enterprise ? (
                              <RiCheckLine className="w-6 h-6 text-black mx-auto" />
                            ) : (
                              <RiCloseLine className="w-6 h-6 text-gray-400 mx-auto" />
                            )
                          ) : (
                            <span className="font-bold">{feature.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Cost Calculator */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
                TRANSPARENT PRICING MODEL
              </h2>
              <p className="text-xl text-gray-600">
                Based on Replicate API costs with our markup
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center mb-4">
                  <RiMicLine className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold uppercase mb-2">KOKORO-82M</h3>
                <div className="text-3xl font-bold mb-2">$0.05</div>
                <p className="text-sm text-gray-600 mb-4">per 1,000 characters</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Most economical</li>
                  <li>• 56M+ production runs</li>
                  <li>• Best for volume</li>
                </ul>
              </div>

              <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center mb-4">
                  <RiFlashlightLine className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-bold uppercase mb-2 text-yellow-400">
                  MINIMAX 2.6 TURBO
                </h3>
                <div className="text-3xl font-bold mb-2 text-yellow-400">$0.10</div>
                <p className="text-sm text-gray-300 mb-4">per 1,000 characters</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Real-time optimized</li>
                  <li>• Emotion control</li>
                  <li>• 50+ languages</li>
                </ul>
              </div>

              <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center mb-4">
                  <RiGlobalLine className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold uppercase mb-2">VOICE CLONING</h3>
                <div className="text-3xl font-bold mb-2">$0.20</div>
                <p className="text-sm text-gray-600 mb-4">per clone training</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• One-time cost</li>
                  <li>• Use unlimited times</li>
                  <li>• 10s-5min audio</li>
                </ul>
              </div>
            </div>

            <div className="p-8 bg-yellow-400 border-4 border-black brutalist-shadow">
              <h3 className="text-2xl font-bold uppercase mb-4">EXAMPLE MONTHLY COSTS</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b-4 border-black">
                  <span className="font-bold">Small Blog (10K chars/month)</span>
                  <span className="text-2xl font-bold">$0.50 - $1.00</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b-4 border-black">
                  <span className="font-bold">Medium Podcast (100K chars/month)</span>
                  <span className="text-2xl font-bold">$5.00 - $10.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Large Business (1M chars/month)</span>
                  <span className="text-2xl font-bold">$50.00 - $100.00</span>
                </div>
              </div>
              <p className="text-sm mt-6 font-medium">
                * API costs only. Pro plan ($29/mo) includes 100K characters plus all premium features.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-black border-y-8 border-yellow-400">
        <Container maxWidth="xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-yellow-400 mb-8">
              <RiQuestionLine className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-wider">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4 text-yellow-400">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-xl text-white">
              Everything you need to know about pricing and plans
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 bg-white border-4 border-white brutalist-shadow-yellow"
              >
                <h3 className="text-lg font-bold uppercase mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold uppercase mb-6">
              READY TO GET STARTED?
            </h2>
            <p className="text-xl text-gray-700 mb-12">
              Start with our free Starter plan. Upgrade anytime as you grow. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="xl"
                className="gap-3 bg-yellow-400 text-black border-4 border-black font-bold uppercase brutalist-shadow"
                asChild
              >
                <a href="/signup">
                  <RiArrowRightLine className="w-5 h-5" />
                  Start Free Trial
                </a>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="gap-3 bg-white text-black border-4 border-black font-bold uppercase brutalist-shadow"
                asChild
              >
                <a href="/demo">Try Demo</a>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="gap-3 bg-black text-yellow-400 border-4 border-black font-bold uppercase brutalist-shadow"
                asChild
              >
                <a href="/contact">Contact Sales</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
