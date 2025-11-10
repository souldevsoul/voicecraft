"use client"

import * as React from "react"
import { RiMic2Fill } from "react-icons/ri"
import { Menu, X } from "lucide-react"

export interface NavLink {
  label: string
  href: string
}

export interface NavigationProps {
  logoText?: string
  navLinks?: NavLink[]
  ctaButton?: {
    text: string
    href?: string
    onClick?: () => void
  }
  transparent?: boolean
  className?: string
}

/**
 * Navigation component - Unified navigation bar used across all pages
 *
 * @example
 * ```tsx
 * import { Navigation } from "@/components/marketing/layout/navigation"
 *
 * export default function Page() {
 *   return (
 *     <Navigation
 *       navLinks={[
 *         { label: "Features", href: "/features" },
 *         { label: "Pricing", href: "/pricing" },
 *         { label: "About", href: "/about" },
 *         { label: "Contact", href: "/contact" },
 *       ]}
 *       ctaButton={{
 *         text: "Get Started",
 *         onClick: () => window.location.href = '/dashboard'
 *       }}
 *     />
 *   )
 * }
 * ```
 */
export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({
    logoText = "VoiceCraft",
    navLinks = [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    ctaButton = {
      text: "Get Started",
      onClick: () => window.location.href = '/dashboard'
    },
    transparent = false,
    className = "",
  }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 10)
      }
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const headerBg = transparent && !scrolled
      ? "bg-transparent"
      : "bg-white border-b-4 border-black"

    return (
      <header
        ref={ref}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${headerBg} ${className}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black border-4 border-black flex items-center justify-center brutalist-shadow-yellow">
                <RiMic2Fill className="w-7 h-7 text-yellow-400" />
              </div>
              <span className="text-xl font-bold uppercase tracking-tight">{logoText}</span>
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

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              {ctaButton && (
                <button
                  onClick={ctaButton.onClick}
                  className="bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-bold uppercase px-6 py-2 transition-colors"
                >
                  {ctaButton.href ? (
                    <a href={ctaButton.href}>{ctaButton.text}</a>
                  ) : (
                    ctaButton.text
                  )}
                </button>
              )}
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
                {ctaButton && (
                  <button
                    className="bg-yellow-400 text-black hover:bg-yellow-300 border-4 border-black font-bold uppercase px-6 py-3 transition-colors w-full"
                    onClick={() => {
                      ctaButton.onClick?.()
                      setMobileMenuOpen(false)
                    }}
                  >
                    {ctaButton.href ? (
                      <a href={ctaButton.href}>{ctaButton.text}</a>
                    ) : (
                      ctaButton.text
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    )
  }
)
Navigation.displayName = "Navigation"
