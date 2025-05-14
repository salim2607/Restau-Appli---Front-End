import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, ClipboardList, DollarSign, Users, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Assurez-vous que ce composant est correctement importé

const reservations = [
  {
    id: "RES-001",
    name: "Martin Dupont",
    date: "2023-11-15",
    time: "19:30",
    guests: 4,
    status: "Confirmé",
  },
  {
    id: "RES-002",
    name: "Sophie Laurent",
    date: "2023-11-15",
    time: "20:00",
    guests: 2,
    status: "En attente",
  },
  {
    id: "RES-003",
    name: "Jean Petit",
    date: "2023-11-16",
    time: "12:30",
    guests: 6,
    status: "Confirmé",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        <div className="flex items-center space-x-2">
          <Button>Télécharger le rapport</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytique</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Chiffre d'affaires */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€1,250.89</div>
                <p className="text-xs text-muted-foreground">+20.1% par rapport à hier</p>
              </CardContent>
            </Card>

            {/* Réservations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+24</div>
                <p className="text-xs text-muted-foreground">+12% par rapport à hier</p>
              </CardContent>
            </Card>

            {/* Commandes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+8% par rapport à hier</p>
              </CardContent>
            </Card>

            {/* Clients actifs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 depuis le mois dernier</p>
              </CardContent>
            </Card>
          </div>

          {/* Ventes et commandes récentes */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Ventes</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div>Graphique des ventes (statique)</div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Vous avez 12 commandes en cours de préparation.</CardDescription>
              </CardHeader>
              <CardContent>
                <div>Aucune commande récente.</div>
              </CardContent>
            </Card>
          </div>

          {/* Aperçu des réservations */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Aperçu des réservations</CardTitle>
                <CardDescription>Réservations pour aujourd'hui et demain.</CardDescription>
              </CardHeader>
              <CardContent>
                <div>Aperçu statique des réservations.</div>
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Alertes de stock</CardTitle>
                <CardDescription>Produits dont le stock est bas.</CardDescription>
              </CardHeader>
              <CardContent>
                <div>Aucune alerte de stock.</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytique */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytique</CardTitle>
              <CardDescription>Visualisez les tendances et les performances de votre restaurant.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div>Graphique analytique (statique)</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications de réservations</CardTitle>
              <CardDescription>Les réservations récentes ou en attente.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {reservations.map((reservation) => (
                  <li key={reservation.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{reservation.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {reservation.date} à {reservation.time} - {reservation.guests} personnes
                      </p>
                    </div>
                    <Badge variant={reservation.status === "Confirmé" ? "default" : "outline"}>
                      {reservation.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}