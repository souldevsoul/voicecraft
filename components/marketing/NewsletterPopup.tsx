"use client"

import { useState, useEffect } from 'react'
import { RiCloseLine, RiMailLine, RiSparklingLine } from 'react-icons/ri'
import { Button } from '@/components/ui'

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen')

    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('newsletter-popup-seen', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Successfully subscribed! Check your inbox.')
        setEmail('')

        // Close popup after 2 seconds on success
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white border-8 border-black max-w-lg w-full brutalist-shadow pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Close Button */}
          <div className="relative bg-yellow-400 border-b-8 border-black p-6">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 bg-black text-yellow-400 flex items-center justify-center hover:bg-gray-900 transition-colors"
              aria-label="Close"
            >
              <RiCloseLine className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-6">
              {/* Microphone Image */}
              <div className="flex-shrink-0">
                <img
                  src="/images/mic-futuristic-cube-nobg.png"
                  alt="Microphone"
                  className="w-32 h-32"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.3))' }}
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black mb-3">
                  <RiSparklingLine className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                    Special Offer
                  </span>
                </div>
                <h2 className="text-3xl font-bold uppercase leading-tight">
                  JOIN THE
                  <br />
                  VOICE REVOLUTION
                </h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-lg text-gray-700 mb-6">
              Subscribe to our newsletter and get <strong className="text-black">exclusive early access</strong> to new features, voice templates, and AI updates.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newsletter-email" className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-mono text-sm"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full gap-3 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <RiMailLine className="w-5 h-5" />
                    Subscribe Now
                  </>
                )}
              </Button>

              {/* Status Message */}
              {status !== 'idle' && (
                <div className={`p-4 border-4 border-black ${
                  status === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <p className={`text-sm font-bold ${
                    status === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message}
                  </p>
                </div>
              )}
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              No spam, unsubscribe anytime. By subscribing, you agree to our{' '}
              <a href="/privacy" className="underline hover:text-yellow-600">
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Bottom Accent */}
          <div className="h-4 bg-yellow-400 border-t-4 border-black" />
        </div>
      </div>
    </>
  )
}
