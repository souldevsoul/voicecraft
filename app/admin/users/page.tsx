"use client"

import { Text, Heading } from "@/components/ui/typography"
import { Card, CardContent } from "@/components/ui/card"
import { RiUserLine } from "react-icons/ri"

export default function AdminUsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Heading variant="h2" className="text-3xl font-bold uppercase tracking-tight">
            USER MANAGEMENT
          </Heading>
          <Text variant="body" className="text-slate-600">
            Manage users and their credits
          </Text>
        </div>
      </div>

      {/* Placeholder */}
      <Card variant="outlined" className="border-4 border-dashed border-black">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <RiUserLine className="h-16 w-16 text-slate-400" />
          <Heading variant="h3" className="mt-4 font-bold uppercase text-slate-900">
            USER MANAGEMENT - COMING SOON
          </Heading>
          <Text variant="body" className="mt-2 text-center text-slate-600">
            User management interface with credit management will be implemented here.
            <br />
            This will include user listing, search, credit adjustments, and activity logs.
          </Text>
        </CardContent>
      </Card>
    </div>
  )
}
