import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, X } from "lucide-react";

const reservations = [
  {
    id: "RES-001",
    name: "Martin Dupont",
    date: "2023-11-15",
    time: "19:30",
    guests: 4,
    table: "Table 7",
    status: "Confirmé",
    phone: "06 12 34 56 78",
    email: "martin.dupont@example.com",
    notes: "Anniversaire",
  },
  {
    id: "RES-002",
    name: "Sophie Laurent",
    date: "2023-11-15",
    time: "20:00",
    guests: 2,
    table: "Table 3",
    status: "En attente",
    phone: "06 23 45 67 89",
    email: "sophie.laurent@example.com",
    notes: "",
  },
  {
    id: "RES-003",
    name: "Jean Petit",
    date: "2023-11-16",
    time: "12:30",
    guests: 6,
    table: "Table 12",
    status: "Confirmé",
    phone: "06 34 56 78 90",
    email: "jean.petit@example.com",
    notes: "Près de la fenêtre",
  },
  {
    id: "RES-004",
    name: "Marie Leroy",
    date: "2023-11-16",
    time: "19:00",
    guests: 3,
    table: "Table 5",
    status: "En attente",
    phone: "06 45 67 89 01",
    email: "marie.leroy@example.com",
    notes: "",
  },
  {
    id: "RES-005",
    name: "Pierre Martin",
    date: "2023-11-17",
    time: "20:30",
    guests: 5,
    table: "Table 9",
    status: "Confirmé",
    phone: "06 56 78 90 12",
    email: "pierre.martin@example.com",
    notes: "Allergique aux fruits de mer",
  },
];

export default function ReservationsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Réservations</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle réservation
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Réservations à venir</CardTitle>
            <CardDescription>Gérez les réservations de vos clients.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Personnes</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{reservation.name}</div>
                        <div className="text-xs text-muted-foreground">{reservation.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{reservation.date}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>{reservation.guests}</TableCell>
                    <TableCell>{reservation.table}</TableCell>
                    <TableCell>
                      <Badge variant={reservation.status === "Confirmé" ? "default" : "outline"}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
            <CardDescription>Visualisez les réservations par date.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

