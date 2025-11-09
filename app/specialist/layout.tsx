import Link from "next/link"
import { RiDashboardLine, RiFolder3Line, RiMoneyDollarCircleLine, RiUserSettingsLine, RiArrowLeftLine } from "react-icons/ri"
import { Text, Heading } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/specialist", icon: RiDashboardLine },
  { name: "Projects", href: "/specialist/projects", icon: RiFolder3Line },
  { name: "Earnings", href: "/specialist/earnings", icon: RiMoneyDollarCircleLine },
  { name: "Profile", href: "/specialist/profile", icon: RiUserSettingsLine },
]

export default function SpecialistLayout({
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

        <div className="border-b-4 border-black bg-blue-50 p-4">
          <Text variant="caption" className="text-xs font-bold uppercase text-blue-900">
            SPECIALIST PORTAL
          </Text>
          <Text variant="body" className="mt-1 text-sm font-bold text-blue-800">
            Audio Expert Dashboard
          </Text>
        </div>

        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 border-2 border-transparent px-4 py-3 font-medium transition-all hover:border-black hover:bg-blue-400"
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
