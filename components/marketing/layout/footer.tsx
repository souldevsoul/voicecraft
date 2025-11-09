import Link from "next/link"
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiTwitterXFill,
  RiLinkedinBoxFill,
  RiGithubFill,
} from "react-icons/ri"
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from "react-icons/si"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white border-t-8 border-yellow-400">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold uppercase mb-6 text-yellow-400">
              VoiceCraft
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Professional AI voice synthesis platform powered by the world's most trusted models.
            </p>

            {/* Payment Logos */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase text-gray-400 mb-3">Accepted Payment Methods</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white px-3 py-2 border-2 border-white flex items-center justify-center">
                  <SiVisa className="w-12 h-8 text-[#1A1F71]" />
                </div>
                <div className="bg-white px-3 py-2 border-2 border-white flex items-center justify-center">
                  <SiMastercard className="w-12 h-8" />
                </div>
                <div className="bg-white px-3 py-2 border-2 border-white flex items-center justify-center">
                  <SiApplepay className="w-12 h-8 text-black" />
                </div>
                <div className="bg-white px-3 py-2 border-2 border-white flex items-center justify-center">
                  <SiGooglepay className="w-12 h-8" />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/voicecraft"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
                aria-label="Twitter"
              >
                <RiTwitterXFill className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/voicecraft"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
                aria-label="LinkedIn"
              >
                <RiLinkedinBoxFill className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/voicecraft"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
                aria-label="GitHub"
              >
                <RiGithubFill className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold uppercase mb-6 text-yellow-400">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-bold uppercase mb-6 text-yellow-400">
              Legal & Policies
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/payment-policy" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Payment Policy
                </Link>
              </li>
              <li>
                <Link href="/delivery-policy" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold uppercase mb-6 text-yellow-400">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <RiMailLine className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold uppercase text-gray-400 mb-1">Email</div>
                  <a
                    href="mailto:support@voicecraft.ai"
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    support@voicecraft.ai
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <RiPhoneLine className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold uppercase text-gray-400 mb-1">Phone</div>
                  <a
                    href="tel:+14155551234"
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    +1 (415) 555-1234
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <RiMapPinLine className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold uppercase text-gray-400 mb-1">Address</div>
                  <address className="text-white not-italic">
                    VoiceCraft, Inc.
                    <br />
                    123 Voice Street, Suite 100
                    <br />
                    San Francisco, CA 94105
                    <br />
                    United States
                  </address>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Information Bar */}
      <div className="border-t-4 border-yellow-400">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Company Registration */}
            <div>
              <h5 className="text-sm font-bold uppercase text-yellow-400 mb-3">
                Company Information
              </h5>
              <div className="text-sm text-gray-300 space-y-1">
                <p>
                  <span className="font-bold">Legal Name:</span> VoiceCraft, Inc.
                </p>
                <p>
                  <span className="font-bold">Registration Number:</span> 12-3456789
                </p>
                <p>
                  <span className="font-bold">VAT Number:</span> US123456789
                </p>
                <p>
                  <span className="font-bold">Registered Address:</span> 123 Voice Street, Suite 100, San Francisco, CA 94105, United States
                </p>
              </div>
            </div>

            {/* Security & Compliance */}
            <div>
              <h5 className="text-sm font-bold uppercase text-yellow-400 mb-3">
                Security & Compliance
              </h5>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• GDPR Compliant</p>
                <p>• SOC 2 Type II Certified</p>
                <p>• PCI DSS Level 1 Compliant</p>
                <p>• End-to-End Encryption (AES-256)</p>
                <p>• Visa and Mastercard Approved Merchant</p>
              </div>
            </div>
          </div>

          {/* Copyright & Additional Info */}
          <div className="pt-6 border-t-2 border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>
                © {currentYear} VoiceCraft, Inc. All rights reserved.
              </p>
              <p className="text-center md:text-right">
                Card payments processed securely. We do not store your credit card information.
                <br />
                Prices shown in USD. Your bank may apply currency conversion fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
