"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heading, Text } from "@/components/ui/typography"
import { Footer } from "@/components/marketing/layout/footer"
import {
  FeatureCard,
  PricingCard,
  TestimonialCard,
  BlogCard,
  StatCard
} from "@/components/marketing/cards"
import {
  Waveform,
  AudioPlayer,
  VoiceSelector,
  GenerationProgress,
  VoiceCloneUploader,
  type Voice,
  type GenerationStep,
  type UploadedFile
} from "@/components/voicecraft"
import {
  Sparkles,
  Zap,
  Shield,
  Globe,
  Star,
  TrendingUp,
  Users,
  Award
} from "lucide-react"
// React Icons imports
import {
  RiRocketLine,
  RiFlashlightLine,
  RiSparklingLine,
  RiSave3Line,
  RiDeleteBin6Line,
  RiExternalLinkLine,
  RiArrowRightLine,
  RiPlayCircleLine,
  RiDownloadLine,
  RiStarLine,
  RiCheckLine,
  RiSettings3Line
} from "react-icons/ri"
import {
  TbBrandOpenai,
  TbLayoutDashboard,
  TbChartBar,
  TbUsers,
  TbWaveSine,
  TbMicrophone
} from "react-icons/tb"
import {
  HiOutlineSparkles,
  HiOutlineCube,
  HiOutlineBeaker,
  HiOutlinePuzzlePiece
} from "react-icons/hi2"
import {
  FiLayout,
  FiCode,
  FiPackage,
  FiBox
} from "react-icons/fi"

export default function ComponentsPage() {
  const [selectedVoice, setSelectedVoice] = React.useState<string | undefined>()
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const [voiceName, setVoiceName] = React.useState("")

  // Sample data
  const sampleVoices: Voice[] = [
    {
      id: "1",
      name: "Emma Watson",
      language: "en-US",
      gender: "female",
      description: "Professional, warm, and articulate voice perfect for narration",
      previewUrl: "/audio/sample1.mp3",
      isFavorite: true,
    },
    {
      id: "2",
      name: "James Morgan",
      language: "en-GB",
      gender: "male",
      description: "Deep, authoritative voice ideal for documentaries",
      previewUrl: "/audio/sample2.mp3",
    },
    {
      id: "3",
      name: "My Custom Voice",
      language: "en-US",
      gender: "neutral",
      description: "Your cloned voice for personal projects",
      isCloned: true,
      isFavorite: true,
    },
  ]

  const sampleGenerationSteps: GenerationStep[] = [
    { id: "1", label: "Text Analysis", status: "completed", progress: 100 },
    { id: "2", label: "Voice Synthesis", status: "processing", progress: 65 },
    { id: "3", label: "Audio Rendering", status: "queued", progress: 0 },
  ]

  const handleFilesUpload = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      status: "uploading" as const,
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])

    setTimeout(() => {
      setUploadedFiles(prev =>
        prev.map(f =>
          newFiles.find(nf => nf.id === f.id)
            ? { ...f, status: "ready" as const, duration: 15 }
            : f
        )
      )
    }, 2000)
  }

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Bold Brutalist Style */}
      <div className="border-b-4 border-black bg-white sticky top-0 z-50">
        <Container maxWidth="xl">
          <div className="py-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-black flex items-center justify-center brutalist-shadow-yellow">
                <FiPackage className="w-8 h-8 text-yellow-400" />
              </div>
              <Heading variant="h1" className="text-black">
                COMPONENT LIBRARY
              </Heading>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <Text variant="body-lg" className="text-gray-800 max-w-2xl font-semibold">
                A BOLD BLACK & WHITE DESIGN SYSTEM WITH YELLOW HIGHLIGHTS
              </Text>
            </div>
          </div>
        </Container>
      </div>

      <Container maxWidth="xl" className="py-16 space-y-28">
        {/* Core UI Components */}
        <section>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center border-4 border-black">
                <FiBox className="w-6 h-6 text-black" />
              </div>
              <Heading variant="h2" className="text-black uppercase">Core Components</Heading>
            </div>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {/* Buttons with Bold Design */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-yellow-400" />
              <Heading variant="h3" className="text-black uppercase">Interactive Buttons</Heading>
            </div>
            <div className="space-y-10">
              {/* Primary Actions - Black Background */}
              <div className="p-10 bg-black border-4 border-black brutalist-shadow">
                <Text variant="body-sm" className="text-yellow-400 mb-6 font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400" />
                  Primary Actions
                </Text>
                <div className="flex flex-wrap gap-6">
                  <Button variant="primary" className="gap-2 bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-bold uppercase">
                    <RiRocketLine className="w-5 h-5" />
                    Launch
                  </Button>
                  <Button variant="primary" className="gap-2 bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-bold uppercase">
                    <RiSave3Line className="w-5 h-5" />
                    Save
                  </Button>
                  <Button variant="primary" className="gap-2 bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-bold uppercase">
                    <RiPlayCircleLine className="w-6 h-6" />
                    Start
                  </Button>
                  <Button variant="primary" className="gap-2 bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-bold uppercase">
                    <RiDownloadLine className="w-5 h-5" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Secondary Actions - White Background */}
              <div className="p-10 bg-white border-4 border-black brutalist-shadow-yellow">
                <Text variant="body-sm" className="text-black mb-6 font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 bg-black" />
                  Secondary Actions
                </Text>
                <div className="flex flex-wrap gap-6">
                  <Button variant="secondary" className="gap-2 bg-white text-black hover:bg-gray-100 border-4 border-black font-bold uppercase">
                    <RiSettings3Line className="w-5 h-5" />
                    Settings
                  </Button>
                  <Button variant="outline" className="gap-2 bg-white text-black border-4 border-black hover:bg-yellow-400 font-bold uppercase">
                    <RiExternalLinkLine className="w-5 h-5" />
                    View
                  </Button>
                  <Button variant="ghost" className="gap-2 text-black hover:bg-yellow-400 border-4 border-transparent hover:border-black font-bold uppercase">
                    <RiArrowRightLine className="w-5 h-5" />
                    More
                  </Button>
                  <Button variant="destructive" className="gap-2 bg-white text-black hover:bg-red-500 hover:text-white border-4 border-black font-bold uppercase">
                    <RiDeleteBin6Line className="w-5 h-5" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Size Variations */}
              <div className="p-10 bg-yellow-400 border-4 border-black">
                <Text variant="body-sm" className="text-black mb-6 font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-4 h-4 bg-black" />
                  Button Sizes
                </Text>
                <div className="flex flex-wrap items-center gap-6">
                  <Button size="sm" className="gap-2 bg-black text-yellow-400 border-4 border-black font-bold uppercase">
                    <RiStarLine className="w-3.5 h-3.5" />
                    Small
                  </Button>
                  <Button size="md" className="gap-2 bg-black text-yellow-400 border-4 border-black font-bold uppercase">
                    <RiStarLine className="w-4 h-4" />
                    Medium
                  </Button>
                  <Button size="lg" className="gap-2 bg-black text-yellow-400 border-4 border-black font-bold uppercase">
                    <RiStarLine className="w-5 h-5" />
                    Large
                  </Button>
                  <Button size="xl" className="gap-2 bg-black text-yellow-400 border-4 border-black font-bold uppercase">
                    <RiStarLine className="w-5 h-5" />
                    XL
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bold Cards */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-yellow-400" />
              <Heading variant="h3" className="text-black uppercase">Card Styles</Heading>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Minimal Card */}
              <Card variant="default" padding="lg" className="group bg-white border-4 border-black hover:brutalist-shadow-yellow transition-all duration-200">
                <div className="w-16 h-16 bg-black flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors">
                  <TbBrandOpenai className="w-8 h-8 text-yellow-400 group-hover:text-black" />
                </div>
                <Heading variant="h4" className="mb-3 uppercase">White Card</Heading>
                <Text variant="body-sm" className="text-gray-700 mb-6 font-semibold">
                  Clean white background with bold black borders
                </Text>
                <Button variant="ghost" size="sm" className="gap-2 text-black hover:text-yellow-400 font-bold uppercase border-2 border-black">
                  Explore
                  <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>

              {/* Black Card */}
              <Card variant="elevated" padding="lg" className="group bg-black border-4 border-black brutalist-shadow">
                <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-4 border-black">
                  <TbWaveSine className="w-8 h-8 text-black" />
                </div>
                <Heading variant="h4" className="mb-3 text-yellow-400 uppercase">Black Card</Heading>
                <Text variant="body-sm" className="text-gray-300 mb-6 font-semibold">
                  Bold black background with dramatic yellow accents
                </Text>
                <Button variant="secondary" size="sm" className="gap-2 bg-yellow-400 text-black border-4 border-yellow-400 font-bold uppercase">
                  Discover
                  <RiArrowRightLine className="w-4 h-4" />
                </Button>
              </Card>

              {/* Yellow Card */}
              <Card variant="gradient" padding="lg" className="group bg-yellow-400 border-4 border-black hover:brutalist-shadow transition-all">
                <div className="w-16 h-16 bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-4 border-black">
                  <HiOutlineSparkles className="w-8 h-8 text-yellow-400" />
                </div>
                <Heading variant="h4" className="mb-3 text-black uppercase">Yellow Highlight</Heading>
                <Text variant="body-sm" className="text-gray-900 mb-6 font-semibold">
                  Eye-catching yellow for important call-to-actions
                </Text>
                <Button variant="primary" size="sm" className="gap-2 bg-black text-yellow-400 border-4 border-black font-bold uppercase">
                  View More
                  <RiArrowRightLine className="w-4 h-4" />
                </Button>
              </Card>
            </div>
          </div>

          {/* Bold Inputs */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-yellow-400" />
              <Heading variant="h3" className="text-black uppercase">Input Fields</Heading>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="p-8 bg-white border-4 border-black">
                <label className="block text-sm font-bold text-black mb-4 uppercase tracking-wide flex items-center gap-2">
                  <RiFlashlightLine className="w-5 h-5" />
                  Default Input
                </label>
                <Input variant="default" placeholder="ENTER TEXT..." className="border-4 border-black font-semibold uppercase" />
              </div>
              <div className="p-8 bg-yellow-400 border-4 border-black brutalist-shadow">
                <label className="block text-sm font-bold text-black mb-4 uppercase tracking-wide flex items-center gap-2">
                  <RiCheckLine className="w-5 h-5" />
                  Success State
                </label>
                <Input variant="success" placeholder="VALID INPUT..." className="border-4 border-black font-semibold uppercase" />
              </div>
              <div className="p-8 bg-white border-4 border-black">
                <label className="block text-sm font-bold text-black mb-4 uppercase tracking-wide">
                  Error State
                </label>
                <Input variant="error" placeholder="CHECK THIS FIELD..." className="border-4 border-red-500 font-semibold uppercase" />
              </div>
              <div className="p-8 bg-black border-4 border-black">
                <label className="block text-sm font-bold text-yellow-400 mb-4 uppercase tracking-wide">
                  Large Input
                </label>
                <Input inputSize="lg" placeholder="LARGER TEXT..." className="border-4 border-yellow-400 bg-white font-semibold uppercase" />
              </div>
            </div>
          </div>

          {/* Typography Showcase */}
          <div className="p-12 bg-white border-4 border-black brutalist-shadow-yellow">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-2 h-2 bg-yellow-400" />
              <Heading variant="h3" className="text-black uppercase">Typography Scale</Heading>
            </div>
            <div className="space-y-8">
              <div className="pb-6 border-b-4 border-black">
                <Heading variant="h1" className="text-black uppercase">DISPLAY LARGE</Heading>
                <Text variant="caption" className="text-gray-600 mt-2 font-bold uppercase">Hero sections and major headlines</Text>
              </div>
              <div className="pb-6 border-b-4 border-gray-200">
                <Heading variant="h2" className="text-black uppercase">DISPLAY MEDIUM</Heading>
                <Text variant="caption" className="text-gray-600 mt-2 font-bold uppercase">Section titles</Text>
              </div>
              <div className="pb-6 border-b-4 border-gray-200">
                <Heading variant="h3" className="text-black uppercase">DISPLAY SMALL</Heading>
                <Text variant="caption" className="text-gray-600 mt-2 font-bold uppercase">Subsection titles</Text>
              </div>
              <div className="pb-6 border-b-4 border-gray-200">
                <Heading variant="h4" className="text-black uppercase">TITLE LARGE</Heading>
                <Text variant="caption" className="text-gray-600 mt-2 font-bold uppercase">Card headers</Text>
              </div>
              <div className="p-6 bg-yellow-400 border-4 border-black">
                <Heading variant="h2" className="text-black uppercase">
                  BOLD YELLOW HIGHLIGHT
                </Heading>
                <Text variant="body-sm" className="text-black mt-3 font-semibold uppercase">For maximum impact and attention</Text>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Cards */}
        <section>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center border-4 border-black">
                <TbChartBar className="w-6 h-6 text-black" />
              </div>
              <Heading variant="h2" className="text-black uppercase">Marketing Components</Heading>
            </div>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {/* Feature Cards */}
          <div className="mb-20">
            <Heading variant="h3" className="mb-8 text-black uppercase">Feature Showcase</Heading>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Sparkles}
                iconColor="text-yellow-500"
                title="AI-POWERED"
                description="Generate natural-sounding voices using cutting-edge AI technology"
              />
              <FeatureCard
                icon={Zap}
                iconColor="text-black"
                title="LIGHTNING FAST"
                description="Generate voice audio in seconds, not minutes"
              />
              <FeatureCard
                icon={Shield}
                iconColor="text-yellow-500"
                title="SECURE"
                description="Your voice data is encrypted and never shared"
              />
            </div>
          </div>

          {/* Stat Cards */}
          <div>
            <Heading variant="h3" className="mb-8 text-black uppercase">Platform Statistics</Heading>
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard
                value="2M+"
                label="VOICES GENERATED"
                icon={TrendingUp}
                trend={{ value: "+45%", direction: "up" }}
              />
              <StatCard
                value="75K+"
                label="ACTIVE USERS"
                icon={Users}
              />
              <StatCard
                value="4.9"
                label="RATING"
                icon={Star}
              />
              <StatCard
                value="99.9%"
                label="UPTIME"
                icon={Award}
              />
            </div>
          </div>
        </section>

        {/* VoiceCraft Components */}
        <section>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center border-4 border-black brutalist-shadow-yellow">
                <TbMicrophone className="w-6 h-6 text-yellow-400" />
              </div>
              <Heading variant="h2" className="text-black uppercase">Voice Components</Heading>
            </div>
            <div className="h-1 w-24 bg-black" />
          </div>

          {/* Waveform */}
          <div className="mb-20">
            <Heading variant="h3" className="mb-8 text-black uppercase">Audio Waveform</Heading>
            <div className="grid md:grid-cols-3 gap-8">
              <Card variant="elevated" padding="lg" className="bg-white border-4 border-black">
                <Text variant="body-sm" className="text-black mb-4 font-bold uppercase tracking-wider flex items-center gap-2">
                  <TbWaveSine className="w-5 h-5" />
                  Small
                </Text>
                <Waveform size="sm" color="primary" />
              </Card>
              <Card variant="elevated" padding="lg" className="bg-yellow-400 border-4 border-black brutalist-shadow">
                <Text variant="body-sm" className="text-black mb-4 font-bold uppercase tracking-wider flex items-center gap-2">
                  <TbWaveSine className="w-5 h-5" />
                  Medium
                </Text>
                <Waveform size="md" color="secondary" />
              </Card>
              <Card variant="elevated" padding="lg" className="bg-black border-4 border-black">
                <Text variant="body-sm" className="text-yellow-400 mb-4 font-bold uppercase tracking-wider flex items-center gap-2">
                  <TbWaveSine className="w-5 h-5" />
                  Large
                </Text>
                <Waveform size="lg" color="success" />
              </Card>
            </div>
          </div>

          {/* Audio Player */}
          <div className="mb-20">
            <Heading variant="h3" className="mb-8 text-black uppercase">Audio Player</Heading>
            <div className="max-w-2xl">
              <Card variant="elevated" padding="lg" className="bg-white border-4 border-black brutalist-shadow-yellow">
                <AudioPlayer
                  title="WELCOME MESSAGE"
                  subtitle="Generated with VoiceCraft"
                  waveformColor="primary"
                />
              </Card>
            </div>
          </div>

          {/* Voice Selector */}
          <div className="mb-20">
            <Heading variant="h3" className="mb-8 text-black uppercase">Voice Selection</Heading>
            <VoiceSelector
              voices={sampleVoices}
              selectedVoiceId={selectedVoice}
              onVoiceSelect={(voice) => setSelectedVoice(voice.id)}
              layout="grid"
            />
          </div>

          {/* Generation Progress - Temporarily disabled due to caching issue */}
          {/* <div className="mb-20">
            <Heading variant="h3" className="mb-8 text-black uppercase">Generation Progress</Heading>
            <div className="max-w-2xl space-y-4">
              <Card variant="elevated" padding="lg" className="bg-white border-4 border-black brutalist-shadow-yellow">
                <GenerationProgress
                  status="processing"
                  progress={65}
                  steps={sampleGenerationSteps}
                  message="Generating your voice..."
                  estimatedTime={30}
                />
              </Card>
              <Card variant="elevated" padding="lg" className="bg-black border-4 border-black brutalist-shadow">
                <GenerationProgress
                  status="completed"
                  progress={100}
                  message="Voice generation complete!"
                />
              </Card>
            </div>
          </div> */}

          {/* Voice Clone Uploader */}
          <div className="mb-20">
            <Heading variant="h3" className="mb-8 text-black uppercase">Voice Clone Uploader</Heading>
            <div className="max-w-2xl">
              <Card variant="elevated" padding="lg" className="bg-white border-4 border-black brutalist-shadow-yellow">
                <VoiceCloneUploader
                  onFilesUpload={(files) => setUploadedFiles(files.map((file, index) => ({
                    id: `file-${index}`,
                    file,
                    url: URL.createObjectURL(file),
                    status: "ready" as const
                  })))}
                  uploadedFiles={uploadedFiles}
                  voiceName={voiceName}
                  onVoiceNameChange={setVoiceName}
                />
              </Card>
            </div>
          </div>
        </section>

        {/* Marketing Card Components */}
        <section>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center border-4 border-black">
                <TbLayoutDashboard className="w-6 h-6 text-black" />
              </div>
              <Heading variant="h2" className="text-black uppercase">Marketing Cards</Heading>
            </div>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {/* Pricing Cards */}
          <div className="mb-20">
            <Heading variant="h3" className="mb-8 text-black uppercase">Pricing Cards</Heading>
            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard
                name="STARTER"
                price={0}
                period="month"
                description="Perfect for trying out VoiceCraft"
                features={[
                  { text: "10,000 characters/month", included: true },
                  { text: "5 preset voices", included: true },
                  { text: "MP3 downloads", included: true },
                  { text: "Voice cloning", included: false },
                  { text: "Commercial use", included: false },
                ]}
                ctaText="GET STARTED FREE"
                ctaHref="/signup"
              />
              <PricingCard
                name="PRO"
                price={29}
                period="month"
                description="For professionals and creators"
                popular={true}
                variant="premium"
                features={[
                  { text: "100,000 characters/month", included: true },
                  { text: "50+ preset voices", included: true },
                  { text: "WAV & MP3 downloads", included: true },
                  { text: "3 voice clones", included: true },
                  { text: "Commercial use", included: true },
                ]}
                ctaText="START FREE TRIAL"
                ctaHref="/signup?plan=pro"
              />
              <PricingCard
                name="ENTERPRISE"
                price="Custom"
                description="For teams and organizations"
                features={[
                  { text: "Unlimited characters", included: true },
                  { text: "All preset voices", included: true },
                  { text: "All audio formats", included: true },
                  { text: "Unlimited voice clones", included: true },
                  { text: "Full API access", included: true },
                ]}
                ctaText="CONTACT SALES"
                ctaHref="/contact"
              />
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="mb-20">
            <Heading variant="h3" className="mb-8 text-black uppercase">Testimonial Cards</Heading>
            <div className="grid md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="VoiceCraft has completely transformed our audiobook production pipeline. We've cut production time by 80% while maintaining incredible quality."
                author="Sarah Johnson"
                role="CEO"
                company="Story Audio Publishing"
                rating={5}
                image="SJ"
              />
              <TestimonialCard
                quote="The voice cloning feature is a game-changer. I can now create consistent voiceovers for all my YouTube videos in minutes instead of hours."
                author="Mike Chen"
                role="Content Creator"
                company="TechReview Daily"
                rating={5}
                image="MC"
              />
            </div>
          </div>

          {/* Blog Cards */}
          <div>
            <Heading variant="h3" className="mb-8 text-black uppercase">Blog Cards</Heading>
            <div className="grid md:grid-cols-3 gap-8">
              <BlogCard
                title="GETTING STARTED WITH AI VOICE SYNTHESIS"
                excerpt="Learn how to create your first AI-generated voice in just 5 minutes with our comprehensive guide."
                image="/images/waveform-visual-bw.jpg"
                date="2024-01-15"
                readTime="5 min read"
                category="TUTORIAL"
                href="/blog/getting-started"
              />
              <BlogCard
                title="VOICE CLONING: THE COMPLETE GUIDE"
                excerpt="Everything you need to know about cloning voices with AI, from basics to advanced techniques."
                image="/images/ai-assistant-bw.jpg"
                date="2024-01-10"
                readTime="8 min read"
                category="GUIDE"
                href="/blog/voice-cloning-guide"
              />
              <BlogCard
                title="10 CREATIVE USES FOR AI VOICES"
                excerpt="Discover innovative ways content creators are using AI voice technology to enhance their work."
                image="/images/headphones-bw.jpg"
                date="2024-01-05"
                readTime="6 min read"
                category="INSPIRATION"
                href="/blog/creative-uses"
              />
            </div>
          </div>
        </section>

        {/* Design Tokens */}
        <section>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center border-4 border-black brutalist-shadow">
                <TbUsers className="w-6 h-6 text-black" />
              </div>
              <Heading variant="h2" className="text-black uppercase">Design Tokens</Heading>
            </div>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {/* Bold Color Palette */}
          <div className="mb-20">
            <Heading variant="h3" className="mb-8 text-black uppercase">Bold Color System</Heading>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-black border-4 border-black brutalist-shadow-yellow">
                <Text variant="body-sm" className="text-yellow-400 mb-6 font-bold uppercase tracking-wide">
                  Monochrome Base
                </Text>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-black border-4 border-yellow-400" />
                    <div>
                      <Text variant="body-sm" className="font-bold text-white uppercase">Black</Text>
                      <Text variant="body-sm" className="text-gray-400 font-mono">#000000</Text>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white border-4 border-yellow-400" />
                    <div>
                      <Text variant="body-sm" className="font-bold text-white uppercase">White</Text>
                      <Text variant="body-sm" className="text-gray-400 font-mono">#FFFFFF</Text>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-yellow-400 border-4 border-black brutalist-shadow">
                <Text variant="body-sm" className="text-black mb-6 font-bold uppercase tracking-wide">
                  Yellow Highlight
                </Text>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-yellow-500 border-4 border-black" />
                    <div>
                      <Text variant="body-sm" className="font-bold uppercase">Yellow 500</Text>
                      <Text variant="body-sm" className="text-gray-800 font-mono">#EAB308</Text>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-yellow-400 border-4 border-black" />
                    <div>
                      <Text variant="body-sm" className="font-bold uppercase">Yellow 400</Text>
                      <Text variant="body-sm" className="text-gray-800 font-mono">#FACC15</Text>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-white border-4 border-black">
                <Text variant="body-sm" className="text-black mb-6 font-bold uppercase tracking-wide">
                  Bold Shadows
                </Text>
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-yellow-400 border-4 border-black brutalist-shadow" />
                  <Text variant="body-sm" className="font-bold uppercase">Brutalist Shadow</Text>
                  <div className="w-20 h-20 bg-black border-4 border-black brutalist-shadow-yellow" />
                  <Text variant="body-sm" className="font-bold uppercase">Yellow Shadow</Text>
                </div>
              </div>
            </div>
          </div>

          {/* Spacing System */}
          <div className="p-10 bg-white border-4 border-black brutalist-shadow-yellow">
            <Heading variant="h3" className="mb-8 text-black uppercase">Spacing System (8pt Grid)</Heading>
            <div className="space-y-4">
              {[1, 2, 3, 4, 6, 8, 12, 16, 20].map(multiplier => (
                <div key={multiplier} className="flex items-center gap-6">
                  <div className="w-32 text-sm text-black font-mono font-bold uppercase">
                    SPACE-{multiplier}
                  </div>
                  <div
                    className="h-12 bg-black border-4 border-black"
                    style={{ width: `${multiplier * 0.25}rem` }}
                  />
                  <div className="text-sm text-gray-600 font-mono font-bold">
                    {multiplier * 0.25}rem ({multiplier * 4}px)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>

      {/* Footer CTA - Bold Black & Yellow */}
      <div className="bg-black py-24 mt-28 border-t-8 border-yellow-400">
        <Container maxWidth="lg">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-black mb-8">
              <HiOutlineSparkles className="w-6 h-6 text-black" />
              <Text variant="body-sm" className="text-black font-bold uppercase tracking-wider">Ready to Build?</Text>
            </div>
            <Heading variant="h1" className="mb-6 text-yellow-400 uppercase">START BUILDING NOW</Heading>
            <Text variant="body-lg" className="mb-12 text-gray-300 max-w-2xl mx-auto font-semibold uppercase">
              Use these bold components to create powerful voice synthesis experiences
            </Text>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button variant="primary" size="xl" className="gap-3 bg-yellow-400 text-black border-4 border-yellow-400 font-bold uppercase brutalist-shadow-yellow">
                <FiCode className="w-6 h-6" />
                View Documentation
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="gap-3 text-yellow-400 border-4 border-yellow-400 hover:bg-yellow-400 hover:text-black font-bold uppercase"
              >
                <RiDownloadLine className="w-6 h-6" />
                Download Kit
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </div>
  )
}
