"use client"

import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import {
  RiArticleLine,
  RiCalendarLine,
  RiTimeLine,
  RiArrowRightLine,
  RiFireLine,
  RiLightbulbLine,
  RiCodeLine,
  RiMicLine,
} from "react-icons/ri"

export default function BlogPage() {
  const categories = [
    { name: "All Posts", slug: "all", count: 24 },
    { name: "Product Updates", slug: "updates", count: 8 },
    { name: "Tutorials", slug: "tutorials", count: 10 },
    { name: "Use Cases", slug: "use-cases", count: 6 },
  ]

  const featuredPost = {
    title: "Kokoro-82M: Why 56M+ Runs Makes It the Most Trusted Voice Model",
    excerpt: "Deep dive into the world's most popular voice synthesis model and why battle-tested technology matters for production applications.",
    category: "Product Updates",
    date: "Nov 8, 2025",
    readTime: "8 min read",
    author: "VoiceCraft Team",
    image: "featured",
  }

  const blogPosts = [
    {
      title: "Getting Started with Voice Cloning: A Complete Guide",
      excerpt: "Learn how to create custom voice profiles using Minimax technology. From audio preparation to training optimization.",
      category: "Tutorials",
      date: "Nov 5, 2025",
      readTime: "12 min read",
      author: "Sarah Chen",
      tag: "Beginner",
    },
    {
      title: "10 Creative Ways to Use AI Voice Synthesis",
      excerpt: "Discover innovative applications of voice AI: from audiobook narration to podcast production and e-learning content.",
      category: "Use Cases",
      date: "Nov 3, 2025",
      readTime: "6 min read",
      author: "Marcus Johnson",
      tag: "Popular",
    },
    {
      title: "Emotion Control in Voice AI: Technical Deep Dive",
      excerpt: "How emotion parameters work in Minimax models and best practices for natural-sounding emotional delivery.",
      category: "Tutorials",
      date: "Nov 1, 2025",
      readTime: "10 min read",
      author: "Dr. Emily Rodriguez",
      tag: "Technical",
    },
    {
      title: "Comparing Voice Models: Kokoro vs Minimax vs XTTS",
      excerpt: "A comprehensive comparison of the top three voice synthesis models: features, quality, speed, and pricing.",
      category: "Product Updates",
      date: "Oct 28, 2025",
      readTime: "15 min read",
      author: "VoiceCraft Team",
      tag: "Popular",
    },
    {
      title: "How Podcasters Are Using Voice AI to Scale Production",
      excerpt: "Case study: How independent podcasters use voice synthesis to create intro/outro content and multilingual versions.",
      category: "Use Cases",
      date: "Oct 25, 2025",
      readTime: "7 min read",
      author: "Alex Turner",
      tag: "Case Study",
    },
    {
      title: "Voice AI API Integration: Best Practices",
      excerpt: "Essential tips for integrating voice synthesis into your application: rate limiting, error handling, and caching strategies.",
      category: "Tutorials",
      date: "Oct 22, 2025",
      readTime: "11 min read",
      author: "Dev Team",
      tag: "Technical",
    },
    {
      title: "The Future of Multilingual Voice Content",
      excerpt: "How AI voice technology is breaking language barriers and enabling creators to reach global audiences.",
      category: "Product Updates",
      date: "Oct 19, 2025",
      readTime: "8 min read",
      author: "Sarah Chen",
      tag: "Trending",
    },
    {
      title: "Optimizing Audio Quality: Pro Tips",
      excerpt: "Advanced techniques for getting the best audio output: pitch adjustment, speed control, and format selection.",
      category: "Tutorials",
      date: "Oct 16, 2025",
      readTime: "9 min read",
      author: "Marcus Johnson",
      tag: "Pro Tips",
    },
    {
      title: "Voice AI for E-Learning: A Teacher's Perspective",
      excerpt: "How educators are using voice synthesis to create engaging, accessible, and scalable learning content.",
      category: "Use Cases",
      date: "Oct 13, 2025",
      readTime: "6 min read",
      author: "Jennifer Liu",
      tag: "Education",
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
              <RiArticleLine className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-wider">Blog</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              VOICE AI INSIGHTS & UPDATES
            </h1>
            <p className="text-xl text-gray-700">
              Tutorials, use cases, product updates, and everything you need to master voice synthesis
            </p>
          </div>
        </Container>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-black border-b-8 border-yellow-400">
        <Container maxWidth="xl">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-3 font-bold uppercase text-sm border-4 ${
                  index === 0
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-transparent text-white border-white hover:bg-white hover:text-black"
                } transition-all`}
              >
                {category.name}
                <span className="ml-2">({category.count})</span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-gray-50">
        <Container maxWidth="xl">
          <div className="mb-6 flex items-center gap-3">
            <RiFireLine className="w-6 h-6" />
            <h2 className="text-2xl font-bold uppercase">Featured Post</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 bg-black border-4 border-black brutalist-shadow-yellow p-8">
            <div className="bg-yellow-400 border-4 border-black aspect-video flex items-center justify-center">
              <RiMicLine className="w-24 h-24 text-black" />
            </div>

            <div className="flex flex-col justify-center text-white">
              <div className="inline-flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase mb-3">
                <span className="px-3 py-1 bg-yellow-400 text-black border-2 border-yellow-400">
                  {featuredPost.category}
                </span>
              </div>

              <h3 className="text-3xl font-bold uppercase mb-4 leading-tight text-yellow-400">
                {featuredPost.title}
              </h3>

              <p className="text-white mb-6 text-lg leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <RiCalendarLine className="w-4 h-4" />
                  {featuredPost.date}
                </div>
                <div className="flex items-center gap-2">
                  <RiTimeLine className="w-4 h-4" />
                  {featuredPost.readTime}
                </div>
              </div>

              <Button
                size="lg"
                className="bg-yellow-400 text-black border-4 border-yellow-400 font-bold uppercase w-fit"
              >
                Read Article
                <RiArrowRightLine className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Blog Grid */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              LATEST ARTICLES
            </h2>
            <p className="text-xl text-gray-700">
              Stay updated with the latest in voice AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => {
              const bgColors = ["bg-white", "bg-black", "bg-yellow-400"]
              const textColors = ["text-black", "text-yellow-400", "text-black"]
              const excerptColors = ["text-gray-700", "text-white", "text-gray-900"]
              const metaColors = ["text-gray-600", "text-gray-300", "text-gray-700"]
              const colorIndex = index % 3

              const tagIcons: { [key: string]: any } = {
                Popular: RiFireLine,
                Technical: RiCodeLine,
                Beginner: RiLightbulbLine,
              }

              const TagIcon = tagIcons[post.tag] || RiArticleLine

              return (
                <div
                  key={index}
                  className={`${bgColors[colorIndex]} border-4 border-black ${
                    colorIndex === 1 ? "brutalist-shadow-yellow" : "brutalist-shadow"
                  } overflow-hidden flex flex-col`}
                >
                  {/* Image Placeholder */}
                  <div
                    className={`h-48 ${
                      colorIndex === 1 ? "bg-yellow-400" : colorIndex === 2 ? "bg-black" : "bg-gray-200"
                    } border-b-4 border-black flex items-center justify-center`}
                  >
                    <RiArticleLine
                      className={`w-16 h-16 ${
                        colorIndex === 1 ? "text-black" : colorIndex === 2 ? "text-yellow-400" : "text-gray-400"
                      }`}
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Category & Tag */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-bold uppercase px-3 py-1 ${
                          colorIndex === 1
                            ? "bg-yellow-400 text-black"
                            : colorIndex === 2
                            ? "bg-black text-yellow-400"
                            : "bg-black text-yellow-400"
                        }`}
                      >
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <TagIcon
                          className={`w-4 h-4 ${
                            colorIndex === 1 ? "text-yellow-400" : "text-black"
                          }`}
                        />
                        <span
                          className={`text-xs font-bold uppercase ${metaColors[colorIndex]}`}
                        >
                          {post.tag}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-xl font-bold uppercase mb-3 leading-tight ${textColors[colorIndex]}`}
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className={`mb-4 text-sm leading-relaxed flex-1 ${excerptColors[colorIndex]}`}>
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className={`flex items-center gap-4 text-xs ${metaColors[colorIndex]} mb-4`}>
                      <div className="flex items-center gap-1">
                        <RiCalendarLine className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <RiTimeLine className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>

                    {/* Read More */}
                    <button
                      className={`w-full py-3 font-bold uppercase text-sm border-4 ${
                        colorIndex === 1
                          ? "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300"
                          : colorIndex === 2
                          ? "bg-black text-yellow-400 border-black hover:bg-gray-900"
                          : "bg-black text-yellow-400 border-black hover:bg-gray-900"
                      } transition-all`}
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button
              size="xl"
              variant="outline"
              className="gap-3 bg-white text-black border-4 border-black font-bold uppercase brutalist-shadow"
            >
              Load More Articles
              <RiArrowRightLine className="w-5 h-5" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-black border-y-8 border-yellow-400">
        <Container maxWidth="xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 text-yellow-400">
              STAY UPDATED
            </h2>
            <p className="text-xl text-white mb-8">
              Get the latest voice AI insights, tutorials, and product updates delivered to your inbox
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 border-4 border-white font-medium text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
              <Button
                size="lg"
                className="bg-yellow-400 text-black border-4 border-yellow-400 font-bold uppercase px-8 whitespace-nowrap"
              >
                Subscribe
                <RiArrowRightLine className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              No spam. Unsubscribe anytime. Read our{" "}
              <a href="/privacy" className="text-yellow-400 underline hover:no-underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
