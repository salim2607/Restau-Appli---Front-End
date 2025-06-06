"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ShoppingCart, 
  Settings, 
  MenuIcon,
  LogOut,
  Map
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedData = JSON.parse(userData);
      setUserRoles(parsedData.roles || []);
      setUserEmail(parsedData.email || "");
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/login");
  };

  const isAdmin = userRoles.includes("ROLE_ADMIN");
  const isCuisinier = userRoles.includes("ROLE_CUISINIER");
  const isServeur = userRoles.includes("ROLE_SERVEUR");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Tableau de bord</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-65px)] sticky top-[65px] hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              {isAdmin && (
                <>
                  <li>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
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
                </>
              )}

              {(isAdmin || isCuisinier || isServeur) && (
                <li>
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Commandes
                  </Link>
                </li>
              )}

              {isServeur && (
                <li>
                  <Link
                    href="/dashboard/floor-plan"
                    className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <Map className="h-5 w-5 mr-3" />
                    Plan de salle
                  </Link>
                </li>
              )}

              {(isAdmin || isServeur) && (
                <li>
                  <Link
                    href="/dashboard/take-order"
                    className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <MenuIcon className="h-5 w-5 mr-3" />
                    Prendre commande
                  </Link>
                </li>
              )}

              {isAdmin && (
                <li>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Paramètres
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}