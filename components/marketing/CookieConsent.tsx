"use client"

import { useState, useEffect } from 'react'
import { RiCloseLine, RiCheckLine, RiSettingsLine } from 'react-icons/ri'
import { Button } from '@/components/ui'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')

    if (!consent) {
      // Show banner after 1 second if no consent exists
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookie-consent', JSON.stringify(consent))
    setIsVisible(false)

    // Initialize analytics and marketing scripts here
    if (typeof window !== 'undefined') {
      // Example: Initialize Google Analytics
      // window.gtag('consent', 'update', { analytics_storage: 'granted' })
    }
  }

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookie-consent', JSON.stringify(consent))
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookie-consent', JSON.stringify(consent))
    setIsVisible(false)

    // Initialize only selected services
    if (typeof window !== 'undefined') {
      // Example: Update consent based on preferences
      // window.gtag('consent', 'update', {
      //   analytics_storage: preferences.analytics ? 'granted' : 'denied',
      //   ad_storage: preferences.marketing ? 'granted' : 'denied',
      // })
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop - only visible when settings are open */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/30 z-50 animate-in fade-in duration-200"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-8 border-black brutalist-shadow">
            {showSettings ? (
              // Settings View
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold uppercase mb-2">Cookie Settings</h3>
                    <p className="text-gray-600">
                      Manage your cookie preferences. You can change these settings at any time.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-10 h-10 bg-black text-yellow-400 flex items-center justify-center hover:bg-gray-900 transition-colors"
                    aria-label="Close settings"
                  >
                    <RiCloseLine className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-start gap-4 p-4 border-4 border-black bg-yellow-50">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="mt-1 w-5 h-5"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold uppercase mb-1">Necessary Cookies</h4>
                      <p className="text-sm text-gray-700">
                        Essential for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start gap-4 p-4 border-4 border-black bg-white">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="mt-1 w-5 h-5"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold uppercase mb-1">Analytics Cookies</h4>
                      <p className="text-sm text-gray-700">
                        Help us understand how visitors interact with our website by collecting anonymous information.
                      </p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start gap-4 p-4 border-4 border-black bg-white">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="mt-1 w-5 h-5"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold uppercase mb-1">Marketing Cookies</h4>
                      <p className="text-sm text-gray-700">
                        Used to track visitors across websites to display relevant advertisements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleSavePreferences}
                    className="gap-2 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow"
                  >
                    <RiCheckLine className="w-5 h-5" />
                    Save Preferences
                  </Button>
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="outline"
                    className="border-4 border-black font-bold uppercase"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Main Banner View
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-yellow-400 border-4 border-black flex items-center justify-center">
                      <span className="text-4xl">🍪</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold uppercase mb-2">
                      We Use Cookies
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                      By clicking "Accept All", you consent to our use of cookies.{' '}
                      <a href="/cookie-policy" className="underline hover:text-yellow-600">
                        Learn more
                      </a>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                      onClick={handleAcceptAll}
                      size="lg"
                      className="gap-2 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow whitespace-nowrap"
                    >
                      <RiCheckLine className="w-5 h-5" />
                      Accept All
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      size="lg"
                      variant="outline"
                      className="gap-2 border-4 border-black font-bold uppercase whitespace-nowrap"
                    >
                      <RiSettingsLine className="w-5 h-5" />
                      Settings
                    </Button>
                    <Button
                      onClick={handleRejectAll}
                      size="lg"
                      variant="outline"
                      className="border-4 border-black font-bold uppercase whitespace-nowrap"
                    >
                      Reject All
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
