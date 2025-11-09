import { Container } from "@/components/ui/container"
import { Header } from "@/components/marketing/layout/header"
import { Footer } from "@/components/marketing/layout/footer"

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-white">
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

      <section className="py-20">
        <Container maxWidth="2xl">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400 border-4 border-black mb-6">
                <span className="text-sm font-bold uppercase tracking-wider">Legal</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold uppercase mb-4 leading-tight">
                Cookie Policy
              </h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold uppercase mb-4 text-black">What Are Cookies</h2>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
                <p>
                  VoiceCraft uses cookies and similar tracking technologies to track activity on our service and store certain information. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold uppercase mb-4 text-black">How We Use Cookies</h2>
                <p>We use cookies for several purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., authentication, security)</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Track your browsing habits to provide relevant advertisements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold uppercase mb-4 text-black">Types of Cookies We Use</h2>

                <div className="space-y-6">
                  <div className="p-6 border-4 border-black bg-yellow-50">
                    <h3 className="text-xl font-bold uppercase mb-3">Essential Cookies</h3>
                    <p className="mb-2"><strong>Purpose:</strong> Required for core website functionality</p>
                    <p className="mb-2"><strong>Examples:</strong></p>
                    <ul className="list-disc pl-6">
                      <li>Session authentication cookies</li>
                      <li>Security and fraud prevention</li>
                      <li>Load balancing</li>
                    </ul>
                    <p className="mt-2"><strong>Duration:</strong> Session or up to 1 year</p>
                  </div>

                  <div className="p-6 border-4 border-black bg-white">
                    <h3 className="text-xl font-bold uppercase mb-3">Analytics Cookies</h3>
                    <p className="mb-2"><strong>Purpose:</strong> Help us improve our service</p>
                    <p className="mb-2"><strong>Third-party services:</strong></p>
                    <ul className="list-disc pl-6">
                      <li>Google Analytics</li>
                      <li>Mixpanel</li>
                      <li>Hotjar</li>
                    </ul>
                    <p className="mt-2"><strong>Duration:</strong> Up to 2 years</p>
                  </div>

                  <div className="p-6 border-4 border-black bg-yellow-50">
                    <h3 className="text-xl font-bold uppercase mb-3">Marketing Cookies</h3>
                    <p className="mb-2"><strong>Purpose:</strong> Personalize content and ads</p>
                    <p className="mb-2"><strong>Third-party services:</strong></p>
                    <ul className="list-disc pl-6">
                      <li>Google Ads</li>
                      <li>Facebook Pixel</li>
                      <li>LinkedIn Insight Tag</li>
                    </ul>
                    <p className="mt-2"><strong>Duration:</strong> Up to 1 year</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold uppercase mb-4 text-black">Your Cookie Choices</h2>
                <p>You have several options for managing cookies:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings</li>
                  <li><strong>Opt-Out Tools:</strong> You can opt out of specific advertising cookies using industry tools</li>
                  <li><strong>Do Not Track:</strong> We respect Do Not Track signals from your browser</li>
                </ul>

                <div className="mt-6 p-6 border-4 border-black bg-black text-white">
                  <h3 className="text-lg font-bold uppercase mb-3 text-yellow-400">Browser Cookie Settings</h3>
                  <ul className="space-y-2 text-sm">
                    <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
                    <li>Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
                    <li>Safari: Preferences → Privacy → Cookies and website data</li>
                    <li>Edge: Settings → Cookies and site permissions → Manage and delete cookies</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold uppercase mb-4 text-black">Third-Party Cookies</h2>
                <p>
                  Some cookies on our site are placed by third-party services. We use these services to help us analyze website usage, provide social media features, and deliver targeted advertising.
                </p>
                <p>
                  We do not control these third-party cookies and recommend reviewing their privacy policies:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Google Privacy Policy: <a href="https://policies.google.com/privacy" className="text-yellow-600 hover:underline">policies.google.com/privacy</a></li>
                  <li>Facebook Data Policy: <a href="https://www.facebook.com/privacy" className="text-yellow-600 hover:underline">facebook.com/privacy</a></li>
                  <li>Stripe Privacy Policy: <a href="https://stripe.com/privacy" className="text-yellow-600 hover:underline">stripe.com/privacy</a></li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold uppercase mb-4 text-black">Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page with an updated "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold uppercase mb-4 text-black">Contact Us</h2>
                <p>
                  If you have questions about our use of cookies, please contact us:
                </p>
                <div className="mt-4 p-6 border-4 border-black bg-white">
                  <p><strong>Email:</strong> privacy@voicecraft.ai</p>
                  <p><strong>Address:</strong> VoiceCraft, Inc., 123 Voice Street, Suite 100, San Francisco, CA 94105, United States</p>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
