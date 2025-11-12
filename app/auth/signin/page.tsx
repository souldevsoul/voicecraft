"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RiArrowRightLine, RiLockLine, RiMailLine } from "react-icons/ri"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

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
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white border-4 border-black brutalist-shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border-4 border-red-500 p-4">
                <p className="text-red-700 font-bold uppercase text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold uppercase text-sm">
                Email Address
              </Label>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 border-4 border-black h-14 text-lg"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold uppercase text-sm">
                Password
              </Label>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-12 border-4 border-black h-14 text-lg"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg gap-3 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase brutalist-shadow"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
              <RiArrowRightLine className="w-5 h-5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-black"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm font-bold uppercase">
                Or
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-bold text-black hover:text-yellow-400 underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-black font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4 animate-pulse">
              <RiLockLine className="w-10 h-10 text-yellow-400" />
            </div>
            <p className="text-gray-600 font-bold uppercase">Loading...</p>
          </div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  )
}
