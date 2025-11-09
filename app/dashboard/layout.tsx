"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { AppHeader } from "@/components/marketing/layout/app-header"

type User = {
  name: string
  email: string
  credits: number
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'
        const response = await fetch(`${baseUrl}/api/users/me`, {
          cache: 'no-store',
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setUser({
              name: data.user.name || 'User',
              email: data.user.email,
              credits: data.user.credits || 0,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <AppHeader user={user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
