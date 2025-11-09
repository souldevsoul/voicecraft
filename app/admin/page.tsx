"use client"

import { useState, useEffect } from "react"
import {
  RiFolder3Line,
  RiUserLine,
  RiTeamLine,
  RiMoneyDollarCircleLine,
  RiCheckboxCircleLine,
  RiTimeLine,
} from "react-icons/ri"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Text, Heading } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalUsers: 0,
    totalSpecialists: 0,
    pendingSpecialists: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'

      // Fetch real projects data
      const projectsResponse = await fetch(`${baseUrl}/api/projects`, {
        cache: 'no-store',
      })

      let totalProjects = 0
      let activeProjects = 0
      let completedProjects = 0

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        if (projectsData.success && projectsData.projects) {
          totalProjects = projectsData.projects.length
          activeProjects = projectsData.projects.filter((p: any) =>
            p.status === 'assigned' || p.status === 'in_review' || p.status === 'waiting_for_assignment'
          ).length
          completedProjects = projectsData.projects.filter((p: any) => p.status === 'completed').length
        }
      }

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalUsers: 0, // TODO: Needs User API endpoint
        totalSpecialists: 0, // TODO: Needs ExpertProfile API endpoint
        pendingSpecialists: 0,
        totalRevenue: 0, // TODO: Calculate from completed projects
        monthlyRevenue: 0,
      })
    } catch (error) {
      console.error("Error fetching admin stats:", error)
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
          <Heading variant="h1" className="uppercase">
            ADMIN DASHBOARD
          </Heading>
          <Text variant="body" className="text-slate-600">
            Platform overview and management
          </Text>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <Card variant="outlined" className="border-4 border-purple-500 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-purple-900">
              TOTAL PROJECTS
            </CardTitle>
            <RiFolder3Line className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold text-purple-900">
              {stats.totalProjects}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <Text variant="caption" className="text-xs text-purple-800">
                {stats.activeProjects} active
              </Text>
              <Text variant="caption" className="text-xs text-purple-600">•</Text>
              <Text variant="caption" className="text-xs text-purple-800">
                {stats.completedProjects} completed
              </Text>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card variant="outlined" className="border-4 border-blue-500 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-blue-900">
              TOTAL USERS
            </CardTitle>
            <RiUserLine className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold text-blue-900">
              {stats.totalUsers}
            </h2>
            <Text variant="caption" className="mt-2 text-xs text-blue-800">
              Registered clients
            </Text>
          </CardContent>
        </Card>

        {/* Specialists */}
        <Card variant="outlined" className="border-4 border-cyan-500 bg-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-cyan-900">
              SPECIALISTS
            </CardTitle>
            <RiTeamLine className="h-6 w-6 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold text-cyan-900">
              {stats.totalSpecialists}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <Text variant="caption" className="text-xs text-cyan-800">
                {stats.pendingSpecialists} pending approval
              </Text>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card variant="outlined" className="border-4 border-green-500 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-green-900">
              TOTAL REVENUE
            </CardTitle>
            <RiMoneyDollarCircleLine className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <Heading as="h2" className="text-3xl font-bold text-green-900">
              ${stats.totalRevenue.toLocaleString()}
            </Heading>
            <Text variant="caption" className="mt-2 text-xs text-green-800">
              ${stats.monthlyRevenue.toLocaleString()} this month
            </Text>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <Heading variant="h3" className="uppercase">
          QUICK ACTIONS
        </Heading>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="outlined" className="border-4 border-black hover:shadow-[4px_4px_0_0_#000] transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <RiFolder3Line className="h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-sm font-bold uppercase tracking-tight">
                MANAGE PROJECTS
              </h3>
              <Text variant="caption" className="mt-2 text-xs text-slate-600">
                View and manage all projects
              </Text>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-2"
                onClick={() => window.location.href = "/admin/projects"}
              >
                GO TO PROJECTS
              </Button>
            </CardContent>
          </Card>

          <Card variant="outlined" className="border-4 border-black hover:shadow-[4px_4px_0_0_#000] transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <RiUserLine className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-sm font-bold uppercase tracking-tight">
                MANAGE USERS
              </h3>
              <Text variant="caption" className="mt-2 text-xs text-slate-600">
                View users and manage credits
              </Text>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-2"
                onClick={() => window.location.href = "/admin/users"}
              >
                GO TO USERS
              </Button>
            </CardContent>
          </Card>

          <Card variant="outlined" className="border-4 border-black hover:shadow-[4px_4px_0_0_#000] transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <RiTeamLine className="h-12 w-12 text-cyan-600" />
              <h3 className="mt-4 text-sm font-bold uppercase tracking-tight">
                MANAGE SPECIALISTS
              </h3>
              <Text variant="caption" className="mt-2 text-xs text-slate-600">
                Approve and manage experts
              </Text>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-2"
                onClick={() => window.location.href = "/admin/specialists"}
              >
                GO TO SPECIALISTS
              </Button>
            </CardContent>
          </Card>

          <Card variant="outlined" className="border-4 border-black hover:shadow-[4px_4px_0_0_#000] transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <RiMoneyDollarCircleLine className="h-12 w-12 text-green-600" />
              <h3 className="mt-4 text-sm font-bold uppercase tracking-tight">
                FINANCIALS
              </h3>
              <Text variant="caption" className="mt-2 text-xs text-slate-600">
                View revenue and transactions
              </Text>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-2"
                onClick={() => window.location.href = "/admin/financials"}
              >
                GO TO FINANCIALS
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
