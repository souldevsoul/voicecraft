"use client"

import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"
import {
  RiMailLine,
  RiCustomerService2Line,
  RiQuestionLine,
  RiRocketLine,
  RiTeamLine,
  RiTimeLine,
  RiArrowRightLine,
  RiCheckLine,
} from "react-icons/ri"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: RiCustomerService2Line,
      title: "General Support",
      description: "Questions about your account, features, or how to use VoiceCraft",
      email: "support@voicecraft.ai",
      responseTime: "24 hours",
      color: "white",
    },
    {
      icon: RiRocketLine,
      title: "Sales & Enterprise",
      description: "Interested in Enterprise plan, custom pricing, or volume discounts",
      email: "sales@voicecraft.ai",
      responseTime: "4 hours",
      color: "black",
    },
    {
      icon: RiTeamLine,
      title: "Partnerships",
      description: "Integration partnerships, affiliate programs, or collaboration opportunities",
      email: "partners@voicecraft.ai",
      responseTime: "48 hours",
      color: "yellow",
    },
  ]

  const supportTopics = [
    {
      title: "Account & Billing",
      items: [
        "Plan upgrades and downgrades",
        "Payment and invoice questions",
        "Account cancellation",
        "Refund requests",
      ],
    },
    {
      title: "Technical Support",
      items: [
        "API integration help",
        "Voice generation issues",
        "Audio quality problems",
        "Error troubleshooting",
      ],
    },
    {
      title: "Voice Cloning",
      items: [
        "Clone quality improvement",
        "Audio file requirements",
        "Training time questions",
        "Voice management",
      ],
    },
    {
      title: "Enterprise Inquiries",
      items: [
        "Custom deployment options",
        "SLA and uptime guarantees",
        "Security compliance",
        "Volume pricing",
      ],
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
              <RiMailLine className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-wider">Contact Us</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold uppercase mb-6 leading-tight">
              WE'RE HERE TO HELP
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Have questions? Need support? Want to discuss enterprise options? Our team is ready to assist you.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Methods */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              GET IN TOUCH
            </h2>
            <p className="text-xl text-gray-700">
              Choose the best way to reach us based on your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              const bgColor =
                method.color === "black"
                  ? "bg-black text-white"
                  : method.color === "yellow"
                  ? "bg-yellow-400"
                  : "bg-white"
              const shadowClass =
                method.color === "black" ? "brutalist-shadow-yellow" : "brutalist-shadow"

              return (
                <div
                  key={index}
                  className={`p-8 ${bgColor} border-4 border-black ${shadowClass}`}
                >
                  <div
                    className={`w-16 h-16 ${
                      method.color === "white" ? "bg-black" : method.color === "black" ? "bg-yellow-400" : "bg-black"
                    } flex items-center justify-center mb-6`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        method.color === "white"
                          ? "text-yellow-400"
                          : method.color === "black"
                          ? "text-black"
                          : "text-yellow-400"
                      }`}
                    />
                  </div>

                  <h3
                    className={`text-2xl font-bold uppercase mb-4 ${
                      method.color === "black" ? "text-yellow-400" : "text-black"
                    }`}
                  >
                    {method.title}
                  </h3>

                  <p
                    className={`mb-6 ${
                      method.color === "black"
                        ? "text-white"
                        : method.color === "yellow"
                        ? "text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {method.description}
                  </p>

                  <div className="mb-6">
                    <a
                      href={`mailto:${method.email}`}
                      className={`text-lg font-bold underline ${
                        method.color === "black" ? "text-yellow-400" : "text-black"
                      } hover:no-underline`}
                    >
                      {method.email}
                    </a>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-sm font-bold uppercase ${
                      method.color === "black"
                        ? "text-white"
                        : method.color === "yellow"
                        ? "text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    <RiTimeLine className="w-5 h-5" />
                    Response within {method.responseTime}
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-gray-50 border-y-8 border-black">
        <Container maxWidth="xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
                SEND US A MESSAGE
              </h2>
              <p className="text-xl text-gray-700">
                Fill out the form and we'll get back to you as soon as possible
              </p>
            </div>

            <div className="bg-white p-8 border-4 border-black brutalist-shadow">
              <form className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold uppercase mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-medium"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold uppercase mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-medium"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-bold uppercase mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-medium"
                    placeholder="Acme Inc."
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold uppercase mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-medium bg-white"
                  >
                    <option value="">Select a topic...</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="sales">Sales & Enterprise</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Product Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-bold uppercase mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-medium resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-yellow-400 text-black border-4 border-black font-bold uppercase hover:bg-yellow-300"
                >
                  <RiArrowRightLine className="w-5 h-5 mr-2" />
                  Send Message
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  We typically respond within 24 hours on business days
                </p>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* Support Topics */}
      <section className="py-24">
        <Container maxWidth="xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              COMMON SUPPORT TOPICS
            </h2>
            <p className="text-xl text-gray-700">
              Reach out about any of these topics—we're here to help
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {supportTopics.map((topic, index) => (
              <div
                key={index}
                className={`p-8 border-4 border-black ${
                  index % 2 === 0 ? "bg-white brutalist-shadow" : "bg-black text-white brutalist-shadow-yellow"
                }`}
              >
                <h3
                  className={`text-2xl font-bold uppercase mb-6 ${
                    index % 2 === 0 ? "text-black" : "text-yellow-400"
                  }`}
                >
                  {topic.title}
                </h3>
                <ul className="space-y-3">
                  {topic.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <RiCheckLine
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          index % 2 === 0 ? "text-black" : "text-yellow-400"
                        }`}
                      />
                      <span className={index % 2 === 0 ? "text-gray-700" : "text-white"}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Quick Links */}
      <section className="py-24 bg-yellow-400 border-y-8 border-black">
        <Container maxWidth="xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              LOOKING FOR SOMETHING ELSE?
            </h2>
            <p className="text-xl text-gray-900">
              Quick links to help you find what you need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href="/pricing"
              className="p-6 bg-white border-4 border-black brutalist-shadow text-center hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <RiQuestionLine className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-bold uppercase mb-2">Pricing FAQ</h3>
              <p className="text-sm text-gray-700">
                Common questions about plans and billing
              </p>
            </a>

            <a
              href="/demo"
              className="p-6 bg-black text-white border-4 border-black brutalist-shadow-yellow text-center hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(234,179,8,1)] transition-all"
            >
              <RiRocketLine className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold uppercase mb-2 text-yellow-400">Try Demo</h3>
              <p className="text-sm text-white">
                Test our voice generation before signing up
              </p>
            </a>

            <a
              href="/features"
              className="p-6 bg-white border-4 border-black brutalist-shadow text-center hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <RiCustomerService2Line className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-bold uppercase mb-2">Feature Docs</h3>
              <p className="text-sm text-gray-700">
                Learn about all VoiceCraft capabilities
              </p>
            </a>
          </div>
        </Container>
      </section>

      {/* Emergency Support */}
      <section className="py-24 bg-black border-t-8 border-yellow-400">
        <Container maxWidth="xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 text-yellow-400">
              ENTERPRISE & URGENT SUPPORT
            </h2>
            <p className="text-xl text-white mb-8">
              Enterprise customers with SLA agreements have access to priority 24/7 support via dedicated channels.
            </p>
            <div className="p-8 bg-white border-4 border-white brutalist-shadow-yellow">
              <h3 className="text-2xl font-bold uppercase mb-4">ENTERPRISE CUSTOMERS</h3>
              <p className="text-gray-700 mb-6">
                If you have an active Enterprise plan with SLA guarantee, use your dedicated support channels for immediate assistance.
              </p>
              <Button
                size="lg"
                className="bg-black text-yellow-400 border-4 border-black font-bold uppercase"
                asChild
              >
                <a href="mailto:enterprise@voicecraft.ai">
                  Contact Enterprise Support
                  <RiArrowRightLine className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
