"use client"

import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import {
  RiSparklingLine,
  RiHeartLine,
  RiLightbulbLine,
  RiRocketLine,
  RiShieldCheckLine,
  RiGlobalLine,
  RiTeamLine,
  RiCodeLine,
  RiMicLine,
  RiFlashlightLine,
  RiArrowRightLine,
  RiCheckDoubleLine,
} from "react-icons/ri"

export default function AboutPage() {
  const values = [
    {
      icon: RiLightbulbLine,
      title: "Innovation First",
      description: "We leverage the most advanced AI models to push the boundaries of what's possible with voice synthesis. Always testing, always improving.",
    },
    {
      icon: RiShieldCheckLine,
      title: "Privacy & Security",
      description: "Your data is yours. End-to-end encryption, GDPR compliance, and SOC 2 certification are standard, not optional.",
    },
    {
      icon: RiHeartLine,
      title: "User-Centric",
      description: "Built by creators, for creators. Every feature is designed with real user needs in mind, from hobbyists to enterprise teams.",
    },
    {
      icon: RiGlobalLine,
      title: "Accessible to All",
      description: "Professional voice technology should be accessible to everyone. That's why we offer a free tier and transparent pricing.",
    },
  ]

  const technology = [
    {
      icon: RiSparklingLine,
      name: "Kokoro-82M",
      description: "The world's most popular voice synthesis model with 56.7M+ production runs. Based on StyleTTS2 with 82M parameters.",
      stats: "56.7M+ Runs",
    },
    {
      icon: RiMicLine,
      name: "Minimax AI",
      description: "Cutting-edge voice cloning and synthesis technology supporting 50+ languages with natural emotion control.",
      stats: "50+ Languages",
    },
    {
      icon: RiFlashlightLine,
      name: "XTTS-v2",
      description: "Advanced multilingual voice cloning supporting 17 languages with one-shot cloning capabilities.",
      stats: "4.4M+ Runs",
    },
    {
      icon: RiCodeLine,
      name: "Replicate Platform",
      description: "Enterprise-grade infrastructure for running AI models at scale with guaranteed uptime and performance.",
      stats: "99.9% Uptime",
    },
  ]

  const milestones = [
    {
      year: "2024",
      title: "VoiceCraft Founded",
      description: "Started with a mission to democratize professional voice synthesis technology.",
    },
    {
      year: "2024",
      title: "Beta Launch",
      description: "Launched private beta with 100 creators testing Kokoro-82M integration.",
    },
    {
      year: "2024",
      title: "Voice Cloning Added",
      description: "Integrated Minimax voice cloning technology, enabling custom voice creation.",
    },
    {
      year: "2025",
      title: "Public Launch",
      description: "Opened to the public with free tier, serving thousands of users worldwide.",
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
              <span className="text-sm font-bold uppercase tracking-wider">About Us</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              MAKING VOICE AI ACCESSIBLE TO EVERYONE
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              We're building the future of voice synthesis. Professional-quality voices powered by the world's most trusted AI models.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6">
                OUR MISSION
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Voice technology has the power to transform how we create content, communicate, and connect with audiences. But for too long, professional voice synthesis has been out of reach for most creators and businesses.
              </p>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                We built VoiceCraft to change that. By leveraging the world's most popular and battle-tested AI models, we're making studio-quality voice synthesis accessible to everyone—from solo creators to enterprise teams.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                Our platform is powered by <span className="font-bold">Kokoro-82M</span> (56.7M+ production runs), <span className="font-bold">Minimax AI</span> (50+ languages), and <span className="font-bold">XTTS-v2</span> (multilingual cloning). These aren't experimental models—they're proven at massive scale.
              </p>
            </div>
            <div className="bg-black p-8 border-4 border-black brutalist-shadow-yellow">
              <div className="space-y-8">
                <div>
                  <div className="text-6xl font-bold text-yellow-400 mb-2">56.7M+</div>
                  <div className="text-sm font-bold text-white uppercase">Voice Generations</div>
                </div>
                <div>
                  <div className="text-6xl font-bold text-yellow-400 mb-2">50+</div>
                  <div className="text-sm font-bold text-white uppercase">Languages Supported</div>
                </div>
                <div>
                  <div className="text-6xl font-bold text-yellow-400 mb-2">300+</div>
                  <div className="text-sm font-bold text-white uppercase">Voice Profiles</div>
                </div>
                <div>
                  <div className="text-6xl font-bold text-yellow-400 mb-2">99.9%</div>
                  <div className="text-sm font-bold text-white uppercase">Platform Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-yellow-400 border-y-8 border-black">
        <Container maxWidth="xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              OUR VALUES
            </h2>
            <p className="text-xl text-gray-900 max-w-3xl mx-auto">
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="p-8 bg-white border-4 border-black brutalist-shadow"
                >
                  <div className="w-16 h-16 bg-black flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase mb-4">{value.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Technology Section */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              POWERED BY THE BEST
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We use only the most proven and popular AI models in production
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {technology.map((tech, index) => {
              const Icon = tech.icon
              const bgColors = ["bg-white", "bg-black"]
              const textColors = ["text-black", "text-yellow-400"]
              const descColors = ["text-gray-700", "text-white"]
              const colorIndex = index % 2

              return (
                <div
                  key={index}
                  className={`p-8 ${bgColors[colorIndex]} border-4 border-black ${
                    colorIndex === 1 ? "brutalist-shadow-yellow" : "brutalist-shadow"
                  }`}
                >
                  <div className={`w-16 h-16 ${colorIndex === 1 ? "bg-yellow-400" : "bg-black"} flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${colorIndex === 1 ? "text-black" : "text-yellow-400"}`} />
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-2xl font-bold uppercase ${textColors[colorIndex]}`}>
                      {tech.name}
                    </h3>
                    <span className={`text-sm font-bold uppercase ${colorIndex === 1 ? "text-yellow-400" : "text-black"} px-3 py-1 ${colorIndex === 1 ? "bg-black" : "bg-yellow-400"} border-2 border-black`}>
                      {tech.stats}
                    </span>
                  </div>
                  <p className={`${descColors[colorIndex]} leading-relaxed`}>{tech.description}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-black border-y-8 border-yellow-400">
        <Container maxWidth="xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4 text-yellow-400">
              OUR JOURNEY
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              From idea to platform serving thousands of users
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-24 h-24 bg-yellow-400 border-4 border-yellow-400 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">{milestone.year}</span>
                </div>
                <div className="flex-1 p-6 bg-white border-4 border-white brutalist-shadow-yellow">
                  <h3 className="text-xl font-bold uppercase mb-2">{milestone.title}</h3>
                  <p className="text-gray-700">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 text-center">
              WHY CHOOSE VOICECRAFT?
            </h2>

            <div className="space-y-6">
              <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                <div className="flex items-start gap-4">
                  <RiCheckDoubleLine className="w-8 h-8 flex-shrink-0 text-black" />
                  <div>
                    <h3 className="text-xl font-bold uppercase mb-2">
                      PROVEN AT SCALE
                    </h3>
                    <p className="text-gray-700">
                      Our primary model (Kokoro-82M) has over 56.7 million production runs. This isn't experimental technology—it's battle-tested at massive scale.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                <div className="flex items-start gap-4">
                  <RiCheckDoubleLine className="w-8 h-8 flex-shrink-0 text-yellow-400" />
                  <div>
                    <h3 className="text-xl font-bold uppercase mb-2 text-yellow-400">
                      TRANSPARENT PRICING
                    </h3>
                    <p className="text-white">
                      No hidden fees, no surprises. We show you exactly what you're paying for based on real API costs. Start free, scale as you grow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-4 border-black brutalist-shadow">
                <div className="flex items-start gap-4">
                  <RiCheckDoubleLine className="w-8 h-8 flex-shrink-0 text-black" />
                  <div>
                    <h3 className="text-xl font-bold uppercase mb-2">
                      ENTERPRISE SECURITY
                    </h3>
                    <p className="text-gray-700">
                      End-to-end encryption, GDPR compliance, SOC 2 Type II certification. Your voice data is protected with enterprise-grade security standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-yellow-400 border-4 border-black brutalist-shadow">
                <div className="flex items-start gap-4">
                  <RiCheckDoubleLine className="w-8 h-8 flex-shrink-0 text-black" />
                  <div>
                    <h3 className="text-xl font-bold uppercase mb-2">
                      BEST-IN-CLASS SUPPORT
                    </h3>
                    <p className="text-gray-900">
                      Real humans ready to help. From email support on free plans to dedicated account managers for enterprise customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow">
                <div className="flex items-start gap-4">
                  <RiCheckDoubleLine className="w-8 h-8 flex-shrink-0 text-yellow-400" />
                  <div>
                    <h3 className="text-xl font-bold uppercase mb-2 text-yellow-400">
                      CONSTANTLY IMPROVING
                    </h3>
                    <p className="text-white">
                      We're always adding new models, features, and capabilities. Beta access to cutting-edge models for Pro and Enterprise users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50 border-y-8 border-black">
        <Container maxWidth="xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              BUILT BY CREATORS, FOR CREATORS
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our team combines expertise in AI, audio engineering, and product design to build the best voice synthesis platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border-4 border-black brutalist-shadow text-center">
              <div className="w-24 h-24 bg-black border-4 border-black mx-auto mb-4 flex items-center justify-center">
                <RiCodeLine className="w-12 h-12 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-2">AI ENGINEERS</h3>
              <p className="text-gray-700">
                Deep expertise in machine learning, voice synthesis, and model optimization.
              </p>
            </div>

            <div className="p-6 bg-yellow-400 border-4 border-black brutalist-shadow text-center">
              <div className="w-24 h-24 bg-black border-4 border-black mx-auto mb-4 flex items-center justify-center">
                <RiMicLine className="w-12 h-12 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-2">AUDIO EXPERTS</h3>
              <p className="text-gray-900">
                Professional audio engineers ensuring studio-quality output.
              </p>
            </div>

            <div className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow text-center">
              <div className="w-24 h-24 bg-yellow-400 border-4 border-black mx-auto mb-4 flex items-center justify-center">
                <RiTeamLine className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-2 text-yellow-400">PRODUCT TEAM</h3>
              <p className="text-white">
                Focused on building intuitive tools that creators actually want to use.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold uppercase mb-6">
              JOIN THOUSANDS OF CREATORS
            </h2>
            <p className="text-xl text-gray-700 mb-12">
              Start creating professional voice content today. Free tier available—no credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="xl"
                className="gap-3 bg-yellow-400 text-black border-4 border-black font-bold uppercase brutalist-shadow"
                asChild
              >
                <a href="/signup">
                  <RiArrowRightLine className="w-5 h-5" />
                  Get Started Free
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
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
