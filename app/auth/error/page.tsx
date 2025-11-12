"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RiErrorWarningLine, RiArrowLeftLine } from "react-icons/ri"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link has expired or has already been used.",
    OAuthSignin: "Error in constructing an authorization URL.",
    OAuthCallback: "Error in handling the response from the OAuth provider.",
    OAuthCreateAccount: "Could not create OAuth provider user in the database.",
    EmailCreateAccount: "Could not create email provider user in the database.",
    Callback: "Error in the OAuth callback handler route.",
    OAuthAccountNotLinked:
      "The email is already associated with another account.",
    EmailSignin: "The email could not be sent.",
    CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
    Default: "An error occurred during authentication.",
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-black uppercase">
              VOICE<span className="text-yellow-400">CRAFT</span>
            </h1>
          </Link>
        </div>

        {/* Error Card */}
        <div className="bg-white border-4 border-red-500 brutalist-shadow p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 flex items-center justify-center mx-auto mb-6">
              <RiErrorWarningLine className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-black uppercase mb-4">
              Authentication Error
            </h2>

            <p className="text-gray-700 mb-8">{errorMessage}</p>

            <div className="space-y-4">
              <Button
                className="w-full h-12 gap-3 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase"
                onClick={() => (window.location.href = "/auth/signin")}
              >
                <RiArrowLeftLine className="w-5 h-5" />
                Try Again
              </Button>

              <Link href="/">
                <Button
                  variant="secondary"
                  className="w-full h-12 gap-3 bg-white text-black hover:bg-gray-100 border-4 border-black font-bold uppercase"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Need help?{" "}
            <Link
              href="/contact"
              className="font-bold text-black hover:text-yellow-400 underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
