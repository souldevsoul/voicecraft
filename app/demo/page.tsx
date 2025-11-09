import { Container } from "@/components/ui/container"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import { VoiceGenerator } from "@/components/voicecraft"
import { ArrowLeft } from "lucide-react"

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <Header
        logoText="VoiceCraft"
        navLinks={[
          { label: "Features", href: "/#features" },
          { label: "Pricing", href: "/#pricing" },
          { label: "Demo", href: "/demo" },
        ]}
        ctaButton={{
          text: "Get Started",
          href: "/signup",
        }}
      />

      {/* Demo Section */}
      <section className="py-20">
        <Container maxWidth="xl">
          {/* Back to Home Link */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase text-gray-700 hover:text-yellow-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>

          {/* Page Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-black mb-6">
              <span className="text-sm font-bold uppercase tracking-wider">Live Demo</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              Try VoiceCraft
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl">
              Experience AI-powered voice synthesis in action. Generate professional voice content from text in seconds.
            </p>
          </div>

          {/* Voice Generator */}
          <VoiceGenerator />

          {/* Info Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 border-4 border-black bg-yellow-50 brutalist-shadow">
              <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold uppercase mb-2">Enter Text</h3>
              <p className="text-sm text-gray-700">
                Type or paste the text you want to convert to speech. Up to 10,000 characters supported.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 border-4 border-black bg-white brutalist-shadow">
              <div className="w-10 h-10 bg-black text-white border-2 border-black flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold uppercase mb-2">Customize Voice</h3>
              <p className="text-sm text-gray-700">
                Choose voice, emotion, speed, pitch, and volume to create the perfect sound.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 border-4 border-black bg-yellow-50 brutalist-shadow">
              <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold uppercase mb-2">Generate & Download</h3>
              <p className="text-sm text-gray-700">
                Click generate to create your audio, then download it in high-quality MP3 format.
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-12 p-8 border-4 border-black bg-black text-white brutalist-shadow-yellow">
            <h2 className="text-3xl font-bold uppercase mb-6 text-yellow-400">What You Can Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase mb-1">Multiple Emotions</h4>
                  <p className="text-sm text-gray-300">
                    Choose from happy, sad, angry, excited, calm, and more
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase mb-1">Speed Control</h4>
                  <p className="text-sm text-gray-300">
                    Adjust playback speed from 0.5x to 2.0x
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase mb-1">Pitch Adjustment</h4>
                  <p className="text-sm text-gray-300">
                    Fine-tune pitch from -12 to +12 semitones
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase mb-1">High-Quality Output</h4>
                  <p className="text-sm text-gray-300">
                    Studio-quality MP3 audio at 48kHz sample rate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Sign up for a free account and unlock unlimited voice generation
            </p>
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold uppercase bg-yellow-400 text-black border-4 border-black hover:bg-yellow-300 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              Create Free Account
            </a>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
