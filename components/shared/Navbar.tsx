"use client"

import * as React from "react"
import { RiMic2Fill } from "react-icons/ri"
import { Menu, X } from "lucide-react"
import { UserButton } from "@/components/auth/user-button"

/**
 * Unified Navbar Component
 *
 * This is the main navigation bar used across all marketing pages.
 * It provides consistent navigation with Features, Pricing, Demo, About, and Contact links.
 *
 * @example
 * ```tsx
 * import { Navbar } from "@/components/shared/Navbar"
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <Navbar />
 *       <main>{/* Your content *\/}</main>
 *     </>
 *   )
 * }
 * ```
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Standard navigation links used across all pages
  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Demo", href: "/demo" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-4 border-black transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center brutalist-shadow-yellow">
              <RiMic2Fill className="w-7 h-7 text-yellow-400" />
            </div>
            <span className="text-xl font-bold uppercase tracking-tight">VOICECRAFT</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* User Button / Auth */}
          <div className="hidden md:flex items-center gap-4">
            <UserButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-4 border-black py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2">
                <UserButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
