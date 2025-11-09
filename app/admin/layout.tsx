import Link from "next/link"
import {
  RiDashboardLine,
  RiFolder3Line,
  RiUserLine,
  RiTeamLine,
  RiMoneyDollarCircleLine,
  RiArrowLeftLine,
  RiShieldCheckLine,
} from "react-icons/ri"
import { Text, Heading } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: RiDashboardLine },
  { name: "Projects", href: "/admin/projects", icon: RiFolder3Line },
  { name: "Users", href: "/admin/users", icon: RiUserLine },
  { name: "Specialists", href: "/admin/specialists", icon: RiTeamLine },
  { name: "Financials", href: "/admin/financials", icon: RiMoneyDollarCircleLine },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r-4 border-black bg-white">
        <div className="flex h-16 items-center justify-between border-b-4 border-black px-6">
          <Heading variant="h2" className="text-xl font-bold uppercase">
            VoiceCraft
          </Heading>
        </div>

        <div className="border-b-4 border-black bg-purple-50 p-4">
          <div className="flex items-center gap-2">
            <RiShieldCheckLine className="h-5 w-5 text-purple-600" />
            <Text variant="caption" className="text-xs font-bold uppercase text-purple-900">
              ADMIN PORTAL
            </Text>
          </div>
          <Text variant="body" className="mt-1 text-sm font-bold text-purple-800">
            Platform Management
          </Text>
        </div>

        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 border-2 border-transparent px-4 py-3 font-medium transition-all hover:border-black hover:bg-purple-400"
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm uppercase">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="w-full border-2">
              <RiArrowLeftLine className="mr-2 h-4 w-4" />
              SWITCH TO USER
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
