"use client"

import * as React from "react"
import { Button, Heading, Text } from "@/components/ui"
import { Waveform, AudioPlayer } from "@/components/voicecraft"
import { Footer } from "@/components/marketing/layout/footer"
import {
  RiSparklingLine,
  RiMicLine,
  RiMic2Fill,
  RiFlashlightLine,
  RiShieldCheckLine,
  RiGlobalLine,
  RiHeadphoneLine,
  RiArrowRightLine,
  RiPlayCircleLine,
  RiCheckLine,
  RiCloseLine,
  RiStarFill,
  RiLineChartLine,
  RiUserLine,
  RiAwardLine,
  RiTimerLine,
} from "react-icons/ri"

export default function Home() {
  // Features data
  const features = [
    {
      icon: RiSparklingLine,
      title: "POWERED BY KOKORO-82M",
      description: "Most popular voice model with 56M+ runs. Battle-tested AI technology delivering natural-sounding speech at massive scale.",
    },
    {
      icon: RiMicLine,
      title: "VOICE CLONING",
      description: "Clone voices with Minimax technology. Quick training from 10 seconds to 5 minutes of audio. 300+ preset voices available.",
    },
    {
      icon: RiFlashlightLine,
      title: "LIGHTNING FAST",
      description: "Real-time voice synthesis in seconds. Minimax 2.6 Turbo optimized for low latency. Generate hours of content instantly.",
    },
    {
      icon: RiShieldCheckLine,
      title: "SECURE & PRIVATE",
      description: "Your voice data is encrypted end-to-end and never shared. Full GDPR compliance. Enterprise-grade security.",
    },
    {
      icon: RiGlobalLine,
      title: "50+ LANGUAGES",
      description: "Multilingual support powered by Minimax and XTTS-v2. Native accents, natural intonation, cross-language voice transfer.",
    },
    {
      icon: RiHeadphoneLine,
      title: "STUDIO QUALITY",
      description: "Professional 48kHz audio output. Emotion control, pitch adjustment, speed control. MP3, WAV, FLAC formats supported.",
    },
  ]

  // Pricing data
  const pricingPlans = [
    {
      name: "STARTER",
      price: "$0",
      description: "Perfect for trying out VoiceCraft",
      features: [
        { text: "10,000 characters/month", included: true },
        { text: "5 preset voices", included: true },
        { text: "MP3 downloads", included: true },
        { text: "Voice cloning", included: false },
        { text: "Commercial use", included: false },
        { text: "Priority support", included: false },
      ],
      ctaText: "GET STARTED FREE",
      popular: false,
    },
    {
      name: "PRO",
      price: "$29",
      description: "For professionals and content creators",
      features: [
        { text: "100,000 characters/month", included: true },
        { text: "50+ preset voices", included: true },
        { text: "WAV & MP3 downloads", included: true },
        { text: "3 voice clones", included: true },
        { text: "Commercial use", included: true },
        { text: "Priority support", included: true },
        { text: "API access", included: false },
      ],
      ctaText: "START FREE TRIAL",
      popular: true,
    },
    {
      name: "ENTERPRISE",
      price: "CUSTOM",
      description: "For teams and organizations",
      features: [
        { text: "Unlimited characters", included: true },
        { text: "All preset voices", included: true },
        { text: "All audio formats", included: true },
        { text: "Unlimited voice clones", included: true },
        { text: "Commercial use", included: true },
        { text: "Dedicated support", included: true },
        { text: "Full API access", included: true },
        { text: "Custom integrations", included: true },
        { text: "SLA guarantee", included: true },
      ],
      ctaText: "CONTACT SALES",
      popular: false,
    },
  ]

  // Stats data
  const stats = [
    {
      value: "2M+",
      label: "VOICES GENERATED",
      icon: RiLineChartLine,
    },
    {
      value: "75K+",
      label: "ACTIVE CREATORS",
      icon: RiUserLine,
    },
    {
      value: "4.9",
      label: "AVERAGE RATING",
      icon: RiStarFill,
    },
    {
      value: "99.9%",
      label: "UPTIME SLA",
      icon: RiAwardLine,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center brutalist-shadow-yellow">
              <RiMic2Fill className="w-7 h-7 text-yellow-400" />
            </div>
            <span className="text-xl font-bold uppercase tracking-tight">VOICECRAFT</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors">Pricing</a>
            <a href="#stats" className="text-sm font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors">Stats</a>
          </nav>
          <Button size="md" className="bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-bold uppercase">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 border-4 border-black">
                <RiSparklingLine className="w-5 h-5" />
                <Text variant="body-sm" className="font-bold uppercase tracking-wider">50+ LANGUAGES SUPPORT</Text>
              </div>
              <Heading variant="h1" className="text-black uppercase leading-tight">
                CREATE PROFESSIONAL VOICE CONTENT IN SECONDS
              </Heading>
              <Text variant="body-lg" className="text-gray-700 max-w-xl">
                AI-powered voice synthesis and cloning for creators, businesses, and developers. Generate natural-sounding voices or clone your own voice with just minutes of audio.
              </Text>
              <div className="flex flex-wrap gap-4">
                <Button size="xl" className="gap-3 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow">
                  <RiArrowRightLine className="w-5 h-5" />
                  Start Free Trial
                </Button>
                <Button size="xl" variant="secondary" className="gap-3 bg-white text-black hover:bg-gray-100 border-4 border-black font-bold uppercase">
                  <RiPlayCircleLine className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20" />
              <div className="relative border-4 border-black brutalist-shadow-yellow">
                <img
                  src="/images/microphone-hero-street.jpg"
                  alt="VoiceCraft AI Voice Synthesis"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="bg-black py-16 border-b-8 border-yellow-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 mb-4">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 uppercase">{stat.value}</div>
                  <div className="text-sm font-bold text-white uppercase tracking-wider">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black border-4 border-black mb-6">
              <RiSparklingLine className="w-6 h-6 text-yellow-400" />
              <Text variant="body-sm" className="text-yellow-400 font-bold uppercase tracking-wider">Features</Text>
            </div>
            <Heading variant="h2" className="mb-4 uppercase">EVERYTHING YOU NEED</Heading>
            <Text variant="body-lg" className="text-gray-600 max-w-3xl mx-auto">
              Powerful features designed for creators, businesses, and developers
            </Text>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const bgColors = ["bg-white", "bg-black", "bg-yellow-400"]
              const textColors = ["text-black", "text-yellow-400", "text-black"]
              const borderColors = ["border-black", "border-black", "border-black"]
              const shadowColors = ["brutalist-shadow", "brutalist-shadow-yellow", "brutalist-shadow"]

              const colorIndex = index % 3

              return (
                <div key={index} className={`p-8 ${bgColors[colorIndex]} border-4 ${borderColors[colorIndex]} ${shadowColors[colorIndex]}`}>
                  <div className={`w-16 h-16 ${colorIndex === 1 ? "bg-yellow-400" : "bg-black"} flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${colorIndex === 1 ? "text-black" : "text-yellow-400"}`} />
                  </div>
                  <Heading variant="h4" className={`mb-4 ${textColors[colorIndex]} uppercase`}>
                    {feature.title}
                  </Heading>
                  <Text variant="body" className={colorIndex === 1 ? "text-white" : "text-gray-600"}>
                    {feature.description}
                  </Text>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo CTA Section */}
      <section className="py-24 bg-yellow-400 border-y-8 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Demo Image */}
            <div className="order-2 md:order-1">
              <div className="relative border-4 border-black brutalist-shadow">
                <img
                  src="/images/ai-assistant-street.jpg"
                  alt="AI Voice Assistant"
                  className="w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-black border-4 border-black flex items-center justify-center hover:scale-110 transition-transform brutalist-shadow-yellow">
                    <RiPlayCircleLine className="w-10 h-10 text-yellow-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-black border-4 border-black mb-4">
                <RiTimerLine className="w-6 h-6 text-yellow-400" />
                <Text variant="body-sm" className="text-yellow-400 font-bold uppercase tracking-wider">2-Minute Demo</Text>
              </div>
              <Heading variant="h2" className="text-black uppercase">SEE VOICECRAFT IN ACTION</Heading>
              <Text variant="body-lg" className="text-gray-900">
                Watch how easy it is to generate professional voice content in seconds. No credit card required.
              </Text>
              <Button size="xl" className="gap-3 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow">
                <RiPlayCircleLine className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-black mb-6">
              <Text variant="body-sm" className="text-black font-bold uppercase tracking-wider">Pricing</Text>
            </div>
            <Heading variant="h2" className="mb-4 uppercase">CHOOSE YOUR PLAN</Heading>
            <Text variant="body-lg" className="text-gray-600 max-w-3xl mx-auto">
              Start free, upgrade when you need more. All plans include our core features.
            </Text>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`p-8 border-4 border-black ${
                  plan.popular
                    ? "bg-black brutalist-shadow-yellow"
                    : "bg-white brutalist-shadow"
                }`}
              >
                {plan.popular && (
                  <div className="inline-flex items-center px-4 py-2 bg-yellow-400 border-4 border-yellow-400 mb-6">
                    <Text variant="caption" className="text-black font-bold uppercase tracking-wider">Most Popular</Text>
                  </div>
                )}
                <Heading variant="h3" className={`mb-2 uppercase ${plan.popular ? "text-yellow-400" : "text-black"}`}>
                  {plan.name}
                </Heading>
                <div className="mb-6">
                  <span className={`text-5xl font-bold uppercase ${plan.popular ? "text-yellow-400" : "text-black"}`}>
                    {plan.price}
                  </span>
                  {plan.price !== "CUSTOM" && (
                    <span className={`text-lg font-bold uppercase ${plan.popular ? "text-white" : "text-gray-600"}`}>/mo</span>
                  )}
                </div>
                <Text variant="body" className={`mb-8 ${plan.popular ? "text-white" : "text-gray-600"}`}>
                  {plan.description}
                </Text>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <RiCheckLine className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-yellow-400" : "text-black"}`} />
                      ) : (
                        <RiCloseLine className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-gray-600" : "text-gray-400"}`} />
                      )}
                      <Text
                        variant="body-sm"
                        className={`${
                          feature.included
                            ? plan.popular ? "text-white" : "text-black"
                            : plan.popular ? "text-gray-600" : "text-gray-400"
                        } font-medium`}
                      >
                        {feature.text}
                      </Text>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className={`w-full gap-3 border-4 border-black font-bold uppercase ${
                    plan.popular
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "bg-black text-yellow-400 hover:bg-gray-900"
                  }`}
                >
                  {plan.ctaText}
                  <RiArrowRightLine className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-black border-t-8 border-yellow-400">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-yellow-400 mb-8">
            <RiSparklingLine className="w-6 h-6 text-black" />
            <Text variant="body-sm" className="text-black font-bold uppercase tracking-wider">Ready to Start?</Text>
          </div>
          <Heading variant="h1" className="mb-6 text-yellow-400 uppercase">
            TRANSFORM YOUR VOICE CONTENT
          </Heading>
          <Text variant="body-lg" className="text-white mb-12 max-w-2xl mx-auto">
            Join thousands of creators and businesses using VoiceCraft to create professional voice content in seconds. Start your free trial today—no credit card required.
          </Text>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="xl" className="gap-3 bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-yellow-400 font-bold uppercase brutalist-shadow-yellow">
              <RiArrowRightLine className="w-5 h-5" />
              Start Free Trial
            </Button>
            <Button size="xl" variant="secondary" className="gap-3 bg-white text-black hover:bg-gray-100 border-4 border-white font-bold uppercase">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
