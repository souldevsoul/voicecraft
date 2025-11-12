"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  RiUserLine,
  RiLogoutBoxLine,
  RiDashboardLine,
  RiArrowRightLine,
  RiCoinLine,
} from "react-icons/ri"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserButton() {
  const { data: session, status } = useSession()
  const [credits, setCredits] = useState<number | null>(null)

  // Fetch user credits when session is available
  useEffect(() => {
    if (session?.user) {
      fetch('/api/users/me')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setCredits(data.user.credits || 0)
          }
        })
        .catch(err => console.error('Failed to fetch credits:', err))
    }
  }, [session])

  if (status === "loading") {
    return (
      <div className="w-10 h-10 bg-gray-200 border-4 border-black animate-pulse"></div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/auth/signin">
          <Button
            variant="secondary"
            className="gap-2 bg-white text-black hover:bg-gray-100 border-4 border-black font-bold uppercase"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button className="gap-2 bg-black text-yellow-400 hover:bg-gray-900 border-4 border-black font-bold uppercase">
            Sign Up
            <RiArrowRightLine className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="gap-2 bg-white text-black hover:bg-gray-100 border-4 border-black font-bold uppercase"
        >
          <RiUserLine className="w-5 h-5" />
          {session.user.name || session.user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white border-4 border-black brutalist-shadow"
      >
        <div className="px-4 py-3 border-b-4 border-black">
          <p className="font-bold uppercase text-sm">{session.user.name}</p>
          <p className="text-xs text-gray-600">{session.user.email}</p>
        </div>

        {/* Credits Display */}
        {credits !== null && (
          <div className="px-4 py-3 border-b-4 border-black bg-yellow-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiCoinLine className="w-5 h-5 text-yellow-600" />
                <span className="font-bold uppercase text-sm">Credits</span>
              </div>
              <span className="font-bold text-lg">{credits}</span>
            </div>
          </div>
        )}

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-400 cursor-pointer font-bold uppercase text-sm"
          >
            <RiDashboardLine className="w-5 h-5" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-t-4 border-black" />
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 hover:bg-red-100 cursor-pointer font-bold uppercase text-sm text-red-600 w-full text-left"
        >
          <RiLogoutBoxLine className="w-5 h-5" />
          Sign Out
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
