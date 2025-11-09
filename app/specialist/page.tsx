"use client"

import { useState, useEffect } from "react"
import { RiFolder3Line, RiCheckboxCircleLine, RiMoneyDollarCircleLine, RiStarFill } from "react-icons/ri"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Text, Heading } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { SpecialistProjectCard } from "@/components/project"

export default function SpecialistDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    rating: 0,
  })
  const [recentProjects, setRecentProjects] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'

      // Fetch real projects data
      const projectsResponse = await fetch(`${baseUrl}/api/projects`, {
        cache: 'no-store',
      })

      let activeProjects = 0
      let completedProjects = 0
      let totalEarnings = 0
      let recentProjectsList: any[] = []

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        if (projectsData.success && projectsData.projects) {
          // TODO: Filter by assignedExpertId once auth is implemented
          // For now, show all projects to demonstrate real data
          const allProjects = projectsData.projects

          // Calculate stats
          activeProjects = allProjects.filter((p: any) =>
            p.status === 'assigned' || p.status === 'in_review'
          ).length

          completedProjects = allProjects.filter((p: any) =>
            p.status === 'completed'
          ).length

          // Calculate total earnings from completed projects
          totalEarnings = allProjects
            .filter((p: any) => p.status === 'completed')
            .reduce((sum: number, p: any) => sum + (p.estimatedCost || 0), 0) / 100 // Convert cents to dollars

          // Get recent projects (last 5 assigned or in_review)
          recentProjectsList = allProjects
            .filter((p: any) => p.status === 'assigned' || p.status === 'in_review')
            .slice(0, 5)
        }
      }

      setStats({
        activeProjects,
        completedProjects,
        totalEarnings,
        rating: 0, // TODO: Implement rating system
      })

      setRecentProjects(recentProjectsList)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-96">
          <Text variant="body" className="text-slate-600">Loading dashboard...</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Heading as="h1" className="text-2xl font-bold uppercase tracking-tight">
            SPECIALIST DASHBOARD
          </Heading>
          <Text variant="body" className="text-slate-600">
            Manage your assigned projects and track earnings
          </Text>
        </div>
        <Button variant="primary" onClick={() => window.location.href = "/specialist/projects"}>
          <RiFolder3Line className="mr-2 h-4 w-4" />
          VIEW ALL PROJECTS
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Projects */}
        <Card variant="outlined" className="border-4 border-blue-500 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-blue-900">
              ACTIVE PROJECTS
            </CardTitle>
            <RiFolder3Line className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <Heading as="h2" className="text-3xl font-bold text-blue-900">
              {stats.activeProjects}
            </Heading>
            <Text variant="caption" className="mt-2 text-xs text-blue-800">
              Currently in progress
            </Text>
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card variant="outlined" className="border-4 border-green-500 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-green-900">
              COMPLETED
            </CardTitle>
            <RiCheckboxCircleLine className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <Heading as="h2" className="text-3xl font-bold text-green-900">
              {stats.completedProjects}
            </Heading>
            <Text variant="caption" className="mt-2 text-xs text-green-800">
              Total finished projects
            </Text>
          </CardContent>
        </Card>

        {/* Total Earnings */}
        <Card variant="outlined" className="border-4 border-yellow-500 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-yellow-900">
              TOTAL EARNINGS
            </CardTitle>
            <RiMoneyDollarCircleLine className="h-6 w-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <Heading as="h2" className="text-3xl font-bold text-yellow-900">
              ${stats.totalEarnings.toLocaleString()}
            </Heading>
            <Text variant="caption" className="mt-2 text-xs text-yellow-800">
              Lifetime earnings
            </Text>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card variant="outlined" className="border-4 border-purple-500 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-purple-900">
              RATING
            </CardTitle>
            <RiStarFill className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <Heading as="h2" className="text-3xl font-bold text-purple-900">
                {stats.rating.toFixed(1)}
              </Heading>
              <Text variant="body" className="text-lg font-bold text-purple-700">
                / 5.0
              </Text>
            </div>
            <Text variant="caption" className="mt-2 text-xs text-purple-800">
              Average client rating
            </Text>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading variant="h3" className="text-xl font-bold uppercase">
            RECENT PROJECTS
          </Heading>
          <Button
            variant="outline"
            size="sm"
            className="border-2"
            onClick={() => window.location.href = "/specialist/projects"}
          >
            VIEW ALL
          </Button>
        </div>

        {recentProjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <SpecialistProjectCard
                key={project.id}
                {...project}
                onClick={() => window.location.href = `/specialist/projects/${project.id}`}
              />
            ))}
          </div>
        ) : (
          <Card variant="outlined" className="border-4 border-dashed border-black">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <RiFolder3Line className="h-16 w-16 text-slate-400" />
              <Heading as="h3" className="mt-4 text-xl font-bold uppercase text-slate-900">
                NO ACTIVE PROJECTS
              </Heading>
              <Text variant="body" className="mt-2 text-center text-slate-600">
                You don't have any assigned projects at the moment.
                <br />
                Projects will appear here when assigned by an admin.
              </Text>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
