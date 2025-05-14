import Link from "next/link"
import type { ReactNode } from "react"
import { LayoutDashboard, Users, Calendar, ShoppingCart, Settings, MenuIcon } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-61px)] sticky top-[61px] hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100">
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/users"
                  className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <Users className="h-5 w-5 mr-3" />
                  Utilisateurs
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/reservations"
                  className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Réservations
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/orders"
                  className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Commandes
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/take-order"
                  className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <MenuIcon className="h-5 w-5 mr-3" />
                  Prendre une commande
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Paramètres
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
