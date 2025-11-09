"use client"

import * as React from "react"
import { Button, Heading, Text } from "@/components/ui"
import { Waveform, AudioPlayer } from "@/components/voicecraft"
import { Footer } from "@/components/marketing/layout/footer"
import { NewsletterPopup } from "@/components/marketing/NewsletterPopup"
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
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

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
            <a href="/about" className="text-sm font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors">About</a>
            <a href="/contact" className="text-sm font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors">Contact</a>
          </nav>
          <Button
            size="md"
            className="bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-bold uppercase"
            onClick={() => window.location.href = '/dashboard'}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-yellow-50 to-white border-b-8 border-black min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center space-y-12">
            {/* Badge */}
            <div className={`inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-black brutalist-shadow transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <RiSparklingLine className="w-6 h-6" />
              <Text variant="body-sm" className="font-bold uppercase tracking-wider">AI-POWERED VOICE SYNTHESIS</Text>
            </div>

            {/* Big Revealing Text */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none">
                <span className={`block transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <span className="text-black">YOUR</span>{" "}
                  <span className="text-yellow-400 [-webkit-text-stroke:3px_black] [text-stroke:3px_black]">VOICE</span>
                </span>
                <span className={`block transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <span className="text-black">YOUR</span>{" "}
                  <span className="text-yellow-400 [-webkit-text-stroke:3px_black] [text-stroke:3px_black]">STYLE</span>
                </span>
                <span className={`block transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <span className="text-black">IN</span>{" "}
                  <span className="text-yellow-400 [-webkit-text-stroke:3px_black] [text-stroke:3px_black]">SECONDS</span>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className={`transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Text variant="lead" className="text-gray-900 max-w-3xl mx-auto text-xl md:text-2xl font-medium">
                Clone voices, generate speech, create content. Professional AI voice synthesis powered by cutting-edge machine learning.
              </Text>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-wrap justify-center gap-6 pt-4 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Button
                size="xl"
                className="gap-3 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow text-lg px-12 py-8"
                onClick={() => window.location.href = '/dashboard'}
              >
                <RiArrowRightLine className="w-6 h-6" />
                Start Free Now
              </Button>
              <Button
                size="xl"
                variant="secondary"
                className="gap-3 bg-white text-black hover:bg-gray-100 border-4 border-black font-bold uppercase text-lg px-12 py-8"
                onClick={() => window.location.href = '/demo'}
              >
                <RiMic2Fill className="w-6 h-6" />
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Microphone Lineup */}
      <section className="relative bg-gradient-to-br from-white via-yellow-50 to-white pb-20 -mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex justify-center items-end gap-4 md:gap-8 lg:gap-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <img
              src="/images/test-mic-vintage-square-nobg.png"
              alt="Vintage Square Microphone"
              className="w-24 md:w-32 lg:w-40 h-auto transition-all duration-300 hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 40px rgba(250, 204, 21, 0.4))' }}
            />
            <img
              src="/images/mic-modern-condenser-nobg.png"
              alt="Modern Condenser Microphone"
              className="w-20 md:w-28 lg:w-36 h-auto transition-all duration-300 hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 40px rgba(250, 204, 21, 0.4))' }}
            />
            <img
              src="/images/mic-futuristic-cube-nobg.png"
              alt="Futuristic Cube Microphone"
              className="w-28 md:w-36 lg:w-44 h-auto transition-all duration-300 hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 40px rgba(250, 204, 21, 0.4))' }}
            />
            <img
              src="/images/mic-classic-broadcast-nobg.png"
              alt="Classic Broadcast Microphone"
              className="w-22 md:w-30 lg:w-38 h-auto transition-all duration-300 hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 40px rgba(250, 204, 21, 0.4))' }}
            />
            <img
              src="/images/mic-hexagonal-geometric-nobg.png"
              alt="Hexagonal Geometric Microphone"
              className="w-24 md:w-32 lg:w-40 h-auto transition-all duration-300 hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 40px rgba(250, 204, 21, 0.4))' }}
            />
            <img
              src="/images/mic-triangular-prism-nobg.png"
              alt="Triangular Prism Microphone"
              className="w-22 md:w-30 lg:w-38 h-auto transition-all duration-300 hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 40px rgba(250, 204, 21, 0.4))' }}
            />
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
            <Heading variant="h2" className="mb-4 uppercase text-4xl md:text-5xl lg:text-6xl">EVERYTHING YOU NEED</Heading>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-black mb-6">
              <Text variant="body-sm" className="text-black font-bold uppercase tracking-wider">Pricing</Text>
            </div>
            <Heading variant="h2" className="mb-4 uppercase text-4xl md:text-5xl lg:text-6xl">CHOOSE YOUR PLAN</Heading>
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
          <Heading variant="h1" className="mb-6 text-yellow-400 uppercase text-5xl md:text-6xl lg:text-7xl">
            TRANSFORM YOUR VOICE CONTENT
          </Heading>
          <Text variant="body-lg" className="text-white mb-12 max-w-2xl mx-auto">
            Join thousands of creators and businesses using VoiceCraft to create professional voice content in seconds. Start your free trial today—no credit card required.
          </Text>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="xl"
              className="gap-3 bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-yellow-400 font-bold uppercase brutalist-shadow-yellow"
              onClick={() => window.location.href = '/dashboard'}
            >
              <RiArrowRightLine className="w-5 h-5" />
              Start Free Trial
            </Button>
            <Button
              size="xl"
              variant="secondary"
              className="gap-3 bg-white text-black hover:bg-gray-100 border-4 border-white font-bold uppercase"
              onClick={() => window.location.href = '/contact'}
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Newsletter Popup */}
      <NewsletterPopup />
    </div>
  )
}
