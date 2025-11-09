"use client"

import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import {
  RiSparklingLine,
  RiMicLine,
  RiFlashlightLine,
  RiShieldCheckLine,
  RiGlobalLine,
  RiHeadphoneLine,
  RiSettings4Line,
  RiVoiceprintLine,
  RiTimerLine,
  RiDatabase2Line,
  RiCodeLine,
  RiTeamLine,
  RiArrowRightLine,
  RiCheckDoubleLine,
  RiSoundModuleLine,
} from "react-icons/ri"

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: RiSparklingLine,
      title: "Powered by Kokoro-82M",
      subtitle: "56M+ RUNS - MOST POPULAR MODEL",
      description: "Built on the world's most popular voice synthesis model. Battle-tested at massive scale with 56.7 million production runs. Proven reliability, exceptional quality, lightning-fast inference.",
      features: [
        "82M parameters based on StyleTTS2",
        "Natural-sounding speech synthesis",
        "Multiple voice profiles available",
        "Automatic long text splitting",
        "Speed control from 0.1x to 5.0x",
        "Lightweight and efficient"
      ]
    },
    {
      icon: RiMicLine,
      title: "Advanced Voice Cloning",
      subtitle: "MINIMAX TECHNOLOGY",
      description: "Clone any voice with Minimax's cutting-edge voice cloning technology. Quick training from just 10 seconds to 5 minutes of audio. Create custom voice profiles that work across all our synthesis models.",
      features: [
        "300+ preset voices included",
        "Custom voice training in minutes",
        "Noise reduction & volume normalization",
        "Works with Speech 2.6 Turbo & HD",
        "Quality validation built-in",
        "Voice ID generation"
      ]
    },
    {
      icon: RiFlashlightLine,
      title: "Real-Time Synthesis",
      subtitle: "LIGHTNING FAST PERFORMANCE",
      description: "Generate professional voice content in seconds, not minutes. Minimax 2.6 Turbo optimized for real-time applications with minimal latency. Perfect for live applications, chatbots, and streaming.",
      features: [
        "Sub-second response times",
        "Real-time streaming support",
        "Batch processing for efficiency",
        "Queue management for scale",
        "Concurrent request handling",
        "CDN-optimized audio delivery"
      ]
    },
    {
      icon: RiSettings4Line,
      title: "Emotion & Expression Control",
      subtitle: "NATURAL EMOTIONAL DELIVERY",
      description: "Fine-tune every aspect of voice delivery. Control emotion, pitch, speed, and volume to create the perfect voice for your content. From happy and excited to calm and serious - full emotional range.",
      features: [
        "8 emotion presets (happy, sad, angry, etc.)",
        "Automatic emotion detection",
        "Pitch adjustment (-12 to +12 semitones)",
        "Speed control (0.5x to 2.0x)",
        "Volume control (0 to 10)",
        "Temperature control for variance"
      ]
    },
    {
      icon: RiGlobalLine,
      title: "Multilingual Support",
      subtitle: "50+ LANGUAGES",
      description: "Generate voices in 50+ languages with native accents and natural intonation. Powered by Minimax and XTTS-v2 for global reach. Cross-language voice transfer supported.",
      features: [
        "50+ languages (Minimax)",
        "17 languages with voice cloning (XTTS-v2)",
        "Native accent support",
        "Natural cross-language intonation",
        "Language-specific normalization",
        "Automatic language detection"
      ]
    },
    {
      icon: RiHeadphoneLine,
      title: "Studio Quality Audio",
      subtitle: "PROFESSIONAL OUTPUT",
      description: "Professional-grade audio output at up to 48kHz sample rate. Multiple format support including MP3, WAV, FLAC, and PCM. Perfect for podcasts, audiobooks, videos, and commercial production.",
      features: [
        "48kHz sample rate (max)",
        "MP3, WAV, FLAC, PCM formats",
        "Configurable bitrates",
        "Mono & stereo channel support",
        "Subtitle export with timestamps",
        "High-fidelity output"
      ]
    },
    {
      icon: RiShieldCheckLine,
      title: "Security & Privacy",
      subtitle: "ENTERPRISE-GRADE PROTECTION",
      description: "Your voice data is encrypted end-to-end and never shared with third parties. Full GDPR compliance, SOC 2 Type II certified. Enterprise-grade security for peace of mind.",
      features: [
        "End-to-end encryption",
        "GDPR compliant",
        "SOC 2 Type II certified",
        "Data residency options",
        "Zero data retention (optional)",
        "Audit logs & compliance reports"
      ]
    },
    {
      icon: RiVoiceprintLine,
      title: "Voice Library Management",
      subtitle: "ORGANIZE YOUR VOICES",
      description: "Manage unlimited custom voice clones. Organize, preview, edit, and delete voice profiles. Search and filter your voice library. Track usage statistics for each voice.",
      features: [
        "Unlimited voice storage (Enterprise)",
        "Voice preview & testing",
        "Metadata & descriptions",
        "Usage analytics per voice",
        "Batch operations",
        "Import/export voice profiles"
      ]
    },
    {
      icon: RiTimerLine,
      title: "Advanced Text Processing",
      subtitle: "INTELLIGENT TEXT HANDLING",
      description: "Automatic text splitting for long content. Pause markers for timing control. Number and date normalization. SSML support for advanced control over pronunciation and delivery.",
      features: [
        "Automatic long text splitting",
        "Pause markers (<#0.5#>)",
        "Number & date normalization",
        "Custom pronunciation dictionary",
        "SSML markup support (coming soon)",
        "Character limit: 10,000 per request"
      ]
    },
    {
      icon: RiDatabase2Line,
      title: "Usage & Analytics",
      subtitle: "TRACK YOUR USAGE",
      description: "Comprehensive analytics dashboard showing character usage, voice generation history, model performance, and cost tracking. Export reports for accounting and billing.",
      features: [
        "Real-time usage tracking",
        "Character count analytics",
        "Generation history",
        "Cost estimation & tracking",
        "Export reports (CSV, PDF)",
        "Webhook notifications"
      ]
    },
    {
      icon: RiCodeLine,
      title: "Developer API",
      subtitle: "FULL API ACCESS",
      description: "Complete REST API with comprehensive documentation. SDKs available for Node.js, Python, Go, and more. Webhook support for async operations. Rate limiting and authentication included.",
      features: [
        "RESTful API",
        "Official SDKs (Node.js, Python, Go)",
        "Webhook support",
        "Rate limiting & quotas",
        "API key management",
        "Detailed error messages"
      ]
    },
    {
      icon: RiTeamLine,
      title: "Team Collaboration",
      subtitle: "WORK TOGETHER",
      description: "Built for teams. Share voice clones across your organization. Role-based access control. Team analytics and usage tracking. Centralized billing and management.",
      features: [
        "Unlimited team members (Enterprise)",
        "Role-based permissions",
        "Shared voice library",
        "Team usage analytics",
        "Centralized billing",
        "SSO integration (Enterprise)"
      ]
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
              <span className="text-sm font-bold uppercase tracking-wider">Features</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              EVERYTHING YOU NEED FOR PROFESSIONAL VOICE CONTENT
            </h1>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Powered by the world's most popular voice models. Built for creators, businesses, and developers who demand the best.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="gap-3 bg-black text-yellow-400 border-4 border-black font-bold uppercase"
              >
                <RiArrowRightLine className="w-5 h-5" />
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-3 border-4 border-black font-bold uppercase"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Model Stats */}
      <section className="py-16 bg-black border-b-8 border-yellow-400">
        <Container maxWidth="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2 uppercase">56.7M+</div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">Kokoro Runs</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2 uppercase">50+</div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">Languages</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2 uppercase">300+</div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">Voices</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2 uppercase">48kHz</div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">Audio Quality</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Features Grid */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon
              const bgColors = ["bg-white", "bg-black", "bg-yellow-400"]
              const textColors = ["text-black", "text-yellow-400", "text-black"]
              const subtitleColors = ["text-gray-600", "text-white", "text-gray-900"]
              const colorIndex = index % 3

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

                  <h3 className={`text-2xl font-bold uppercase mb-2 ${textColors[colorIndex]}`}>
                    {feature.title}
                  </h3>

                  <div className={`text-xs font-bold uppercase tracking-wider mb-4 ${subtitleColors[colorIndex]}`}>
                    {feature.subtitle}
                  </div>

                  <p className={`mb-6 ${colorIndex === 1 ? "text-white" : "text-gray-700"}`}>
                    {feature.description}
                  </p>

                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <RiCheckDoubleLine className={`w-5 h-5 flex-shrink-0 ${colorIndex === 1 ? "text-yellow-400" : "text-black"}`} />
                        <span className={`text-sm ${colorIndex === 1 ? "text-white" : "text-gray-700"}`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Model Comparison CTA */}
      <section className="py-24 bg-yellow-400 border-y-8 border-black">
        <Container maxWidth="xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black border-4 border-black mb-8">
              <RiSoundModuleLine className="w-6 h-6 text-yellow-400" />
              <span className="text-sm font-bold uppercase tracking-wider text-yellow-400">Multiple Models</span>
            </div>
            <h2 className="text-5xl font-bold uppercase mb-6 text-black">
              CHOOSE THE RIGHT MODEL FOR YOUR NEEDS
            </h2>
            <p className="text-xl text-gray-900 mb-8">
              We support multiple voice models: Kokoro-82M (simplest, most popular), Minimax 2.6 Turbo (advanced features), and XTTS-v2 (multilingual cloning).
            </p>
            <Button
              size="xl"
              className="gap-3 bg-black text-yellow-400 border-4 border-black font-bold uppercase brutalist-shadow"
            >
              <RiArrowRightLine className="w-5 h-5" />
              Compare Models
            </Button>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-black border-t-8 border-yellow-400">
        <Container maxWidth="xl">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold uppercase mb-6 text-yellow-400">
              READY TO GET STARTED?
            </h2>
            <p className="text-xl text-white mb-12">
              Join thousands of creators and businesses using VoiceCraft. Start your free trial today—no credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="xl"
                className="gap-3 bg-yellow-400 text-black border-4 border-yellow-400 font-bold uppercase"
              >
                <RiArrowRightLine className="w-5 h-5" />
                Start Free Trial
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="gap-3 bg-white text-black border-4 border-white font-bold uppercase"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
