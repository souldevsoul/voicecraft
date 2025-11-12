import { Suspense } from "react"
import Link from "next/link"
import {
  RiVoiceprintLine,
  RiSoundModuleLine,
  RiFolder3Line,
  RiCoinLine,
  RiArrowRightLine,
} from "react-icons/ri"
import { Card } from "@/components/ui/card"
import { Text, Heading } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions"
import { DashboardCreditsCard } from "@/components/dashboard/dashboard-credits-card"
import { DashboardSubscriptionBanner } from "@/components/dashboard/dashboard-subscription-banner"
import { getCurrentUserId } from "@/lib/get-current-user"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

type DashboardStats = {
  totalAudios: number
  totalVoices: number
  totalProjects: number
  creditsRemaining: number
}

type UserSubscription = {
  plan: string
  status: string
  isTrialing: boolean
  trialEndsAt: Date | null
} | null

type RecentAudio = {
  id: string
  filename: string
  voiceName: string | null
  createdAt: string
  status: string
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get current user from session
    const userId = await getCurrentUserId()

    if (!userId) {
      redirect('/auth/signin')
    }

    // Query database directly using Prisma - get all counts in parallel
    const [totalAudios, totalVoices, totalProjects, user] = await Promise.all([
      prisma.audio.count({ where: { userId } }),
      prisma.voice.count({ where: { userId } }),
      prisma.project.count({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { credits: true } }),
    ])

    return {
      totalAudios,
      totalVoices,
      totalProjects,
      creditsRemaining: user?.credits || 0,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalAudios: 0,
      totalVoices: 0,
      totalProjects: 0,
      creditsRemaining: 0,
    }
  }
}

async function getRecentAudios(): Promise<RecentAudio[]> {
  try {
    // Get current user from session
    const userId = await getCurrentUserId()

    if (!userId) {
      redirect('/auth/signin')
    }

    // Query database directly using Prisma
    const audios = await prisma.audio.findMany({
      where: { userId },
      include: {
        voice: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Map to RecentAudio type
    return audios.map((audio) => ({
      id: audio.id,
      filename: audio.filename,
      voiceName: audio.voice?.name || null,
      createdAt: audio.createdAt.toISOString(),
      status: audio.status,
    }))
  } catch (error) {
    console.error('Error fetching recent audios:', error)
    return []
  }
}

async function getUserSubscription(): Promise<UserSubscription> {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      redirect('/auth/signin')
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        plan: true,
        status: true,
        isTrialing: true,
        trialEndsAt: true,
      },
    })

    return subscription
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const recentAudios = await getRecentAudios()
  const subscription = await getUserSubscription()

  const statCards = [
    {
      title: "Total Audios",
      value: stats.totalAudios,
      icon: RiSoundModuleLine,
      color: "bg-blue-400",
      link: "/dashboard/audios",
    },
    {
      title: "Cloned Voices",
      value: stats.totalVoices,
      icon: RiVoiceprintLine,
      color: "bg-purple-400",
      link: "/dashboard/voices",
    },
    {
      title: "Active Projects",
      value: stats.totalProjects,
      icon: RiFolder3Line,
      color: "bg-orange-400",
      link: "/dashboard/projects",
    },
    {
      title: "Credits",
      value: stats.creditsRemaining,
      icon: RiCoinLine,
      color: "bg-yellow-400",
      link: "#",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading variant="h1" className="uppercase">
          Dashboard
        </Heading>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {/* Subscription Banner */}
        <DashboardSubscriptionBanner subscription={subscription} />
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.link}>
                <Card
                  variant="outlined"
                  className="p-6 transition-all hover:shadow-[8px_8px_0_0_#000] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                        {stat.title}
                      </Text>
                      <Heading as="h2" className="text-3xl font-bold uppercase mt-2">
                        {stat.value}
                      </Heading>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center border-2 border-black ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent Audios */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card variant="outlined" className="col-span-4 p-6">
            <div className="flex items-center justify-between">
              <Heading variant="h3" className="uppercase">
                Recent Audios
              </Heading>
              <Link href="/dashboard/audios">
                <Button variant="ghost" size="sm">
                  View All
                  <RiArrowRightLine className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {recentAudios.map((audio) => (
                <div
                  key={audio.id}
                  className="flex items-center justify-between border-2 border-black p-4 hover:bg-yellow-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white">
                      <RiSoundModuleLine className="h-5 w-5" />
                    </div>
                    <div>
                      <Text variant="body" className="font-medium">
                        {audio.filename}
                      </Text>
                      <Text variant="caption" className="text-xs text-slate-600">
                        {audio.voiceName || "No voice"}
                      </Text>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={audio.status === "ready" ? "success" : "warning"}
                      className="text-xs"
                    >
                      {audio.status}
                    </Badge>
                    <Text variant="caption" className="text-xs text-slate-500">
                      {new Date(audio.createdAt).toLocaleTimeString()}
                    </Text>
                  </div>
                </div>
              ))}

              {recentAudios.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-black p-8">
                  <RiSoundModuleLine className="h-12 w-12 text-slate-400" />
                  <Text variant="body" className="mt-2 text-slate-600">
                    No recent audios
                  </Text>
                </div>
              )}
            </div>
          </Card>

          {/* Credits Card */}
          <DashboardCreditsCard creditsRemaining={stats.creditsRemaining} />
        </div>

        {/* Quick Actions */}
        <DashboardQuickActions />
      </Suspense>
    </div>
  )
}
