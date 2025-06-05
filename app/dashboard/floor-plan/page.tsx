"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Clock, Utensils, X } from "lucide-react"

// Types for table data
type TableStatus = "available" | "occupied" | "reserved" | "maintenance"
type TableShape = "square" | "round" | "rectangle"
type TableSection = "main" | "patio"

interface Table {
  id: number
  number: number
  capacity: number
  currentOccupancy: number
  status: TableStatus
  shape: TableShape
  section: TableSection
  x: number
  y: number
  width: number
  height: number
  reservationTime?: string
  reservationName?: string
}

// Initial table data
const initialTables: Table[] = [
  {
    id: 1,
    number: 1,
    capacity: 4,
    currentOccupancy: 2,
    status: "occupied",
    shape: "square",
    section: "main",
    x: 100,
    y: 100,
    width: 80,
    height: 80,
  },
  {
    id: 2,
    number: 2,
    capacity: 4,
    currentOccupancy: 3,
    status: "occupied",
    shape: "square",
    section: "main",
    x: 220,
    y: 100,
    width: 80,
    height: 80,
  },
  {
    id: 3,
    number: 3,
    capacity: 4,
    currentOccupancy: 0,
    status: "available",
    shape: "square",
    section: "main",
    x: 340,
    y: 100,
    width: 80,
    height: 80,
  },
  {
    id: 4,
    number: 4,
    capacity: 4,
    currentOccupancy: 1,
    status: "occupied",
    shape: "square",
    section: "main",
    x: 460,
    y: 100,
    width: 80,
    height: 80,
  },
  {
    id: 5,
    number: 5,
    capacity: 4,
    currentOccupancy: 4,
    status: "occupied",
    shape: "square",
    section: "main",
    x: 580,
    y: 100,
    width: 80,
    height: 80,
  },
  {
    id: 6,
    number: 6,
    capacity: 4,
    currentOccupancy: 0,
    status: "maintenance",
    shape: "square",
    section: "patio",
    x: 700,
    y: 100,
    width: 80,
    height: 80,
  },
  {
    id: 7,
    number: 7,
    capacity: 4,
    currentOccupancy: 0,
    status: "available",
    shape: "square",
    section: "main",
    x: 100,
    y: 250,
    width: 80,
    height: 80,
  },
  {
    id: 8,
    number: 8,
    capacity: 4,
    currentOccupancy: 2,
    status: "occupied",
    shape: "square",
    section: "main",
    x: 220,
    y: 250,
    width: 80,
    height: 80,
  },
  {
    id: 9,
    number: 9,
    capacity: 4,
    currentOccupancy: 0,
    status: "available",
    shape: "square",
    section: "main",
    x: 580,
    y: 250,
    width: 80,
    height: 80,
  },
  {
    id: 10,
    number: 10,
    capacity: 4,
    currentOccupancy: 4,
    status: "occupied",
    shape: "square",
    section: "main",
    x: 700,
    y: 250,
    width: 80,
    height: 80,
  },
  {
    id: 11,
    number: 11,
    capacity: 8,
    currentOccupancy: 4,
    status: "occupied",
    shape: "round",
    section: "main",
    x: 400,
    y: 250,
    width: 120,
    height: 120,
  },
]

// Table component
const Table = ({ table, onClick }: { table: Table; onClick: (table: Table) => void }) => {
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "available":
        return "bg-gray-200"
      case "occupied":
        return table.section === "main" ? "bg-green-400" : "bg-red-400"
      case "reserved":
        return "bg-yellow-400"
      case "maintenance":
        return "bg-gray-400"
    }
  }

  return (
    <div
      className={`absolute flex flex-col items-center justify-center border-2 border-gray-400 cursor-pointer transition-colors ${getStatusColor(
        table.status,
      )} ${table.shape === "round" ? "rounded-full" : "rounded-md"}`}
      style={{
        left: `${table.x}px`,
        top: `${table.y}px`,
        width: `${table.width}px`,
        height: `${table.height}px`,
      }}
      onClick={() => onClick(table)}
    >
      <div className="font-bold text-lg">{table.number}</div>
      <div className="text-xs">
        {table.currentOccupancy}/{table.capacity}
      </div>
      {table.status === "reserved" && <Clock className="absolute top-1 right-1 h-4 w-4" />}
    </div>
  )
}

export default function FloorPlanPage() {
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [activeSection, setActiveSection] = useState<"main" | "patio">("main")

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
  }

  const updateTableStatus = (id: number, status: TableStatus) => {
    setTables(
      tables.map((table) => {
        if (table.id === id) {
          return { ...table, status }
        }
        return table
      }),
    )
    setSelectedTable(null)
  }

  const updateTableOccupancy = (id: number, occupancy: number) => {
    setTables(
      tables.map((table) => {
        if (table.id === id) {
          return { ...table, currentOccupancy: occupancy, status: occupancy > 0 ? "occupied" : "available" }
        }
        return table
      }),
    )
    setSelectedTable(null)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Plan de Salle</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="now">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="now">En cours</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="tomorrow">Demain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan de salle en temps réel</CardTitle>
          <CardDescription>
            Visualisez l'état des tables et gérez les réservations et les occupations en temps réel.
          </CardDescription>
          <Tabs
            defaultValue="main"
            className="w-full"
            onValueChange={(value) => setActiveSection(value as "main" | "patio")}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="main">Salle principale</TabsTrigger>
              <TabsTrigger value="patio">Terrasse</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[500px] border rounded-lg bg-white">
            {tables
              .filter((table) => table.section === activeSection)
              .map((table) => (
                <Table key={table.id} table={table} onClick={handleTableClick} />
              ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
              <span className="text-sm">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
              <span className="text-sm">Occupée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
              <span className="text-sm">Réservée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
              <span className="text-sm">Maintenance</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTable && (
        <Dialog open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Table {selectedTable.number}</DialogTitle>
              <DialogDescription>
                Capacité: {selectedTable.capacity} personnes | Statut:{" "}
                <Badge
                  variant={
                    selectedTable.status === "available"
                      ? "outline"
                      : selectedTable.status === "occupied"
                        ? "default"
                        : selectedTable.status === "reserved"
                          ? "secondary"
                          : "destructive"
                  }
                >
                  {selectedTable.status === "available"
                    ? "Disponible"
                    : selectedTable.status === "occupied"
                      ? "Occupée"
                      : selectedTable.status === "reserved"
                        ? "Réservée"
                        : "Maintenance"}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-2">
                <Label>Occupation actuelle</Label>
                <div className="flex items-center gap-2">
                  {[...Array(selectedTable.capacity)].map((_, i) => (
                    <Button
                      key={i}
                      variant={i < selectedTable.currentOccupancy ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTableOccupancy(selectedTable.id, i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => updateTableOccupancy(selectedTable.id, 0)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Changer le statut</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedTable.status === "available" ? "default" : "outline"}
                    onClick={() => updateTableStatus(selectedTable.id, "available")}
                  >
                    Disponible
                  </Button>
                  <Button
                    variant={selectedTable.status === "occupied" ? "default" : "outline"}
                    onClick={() => updateTableStatus(selectedTable.id, "occupied")}
                  >
                    Occupée
                  </Button>
                  <Button
                    variant={selectedTable.status === "reserved" ? "default" : "outline"}
                    onClick={() => updateTableStatus(selectedTable.id, "reserved")}
                  >
                    Réservée
                  </Button>
                  <Button
                    variant={selectedTable.status === "maintenance" ? "default" : "outline"}
                    onClick={() => updateTableStatus(selectedTable.id, "maintenance")}
                  >
                    Maintenance
                  </Button>
                </div>
              </div>

              {selectedTable.status === "occupied" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label>Heure d'arrivée</Label>
                    <Input type="time" defaultValue="19:30" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Durée estimée</Label>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue placeholder="Durée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1h</SelectItem>
                        <SelectItem value="90">1h30</SelectItem>
                        <SelectItem value="120">2h</SelectItem>
                        <SelectItem value="150">2h30</SelectItem>
                        <SelectItem value="180">3h</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {selectedTable.status === "reserved" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label>Nom de la réservation</Label>
                    <Input placeholder="Nom du client" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Heure de réservation</Label>
                    <Input type="time" defaultValue="20:00" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Nombre de personnes</Label>
                    <Input type="number" min="1" max={selectedTable.capacity} defaultValue="2" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Téléphone</Label>
                    <Input placeholder="Numéro de téléphone" />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {selectedTable.status === "occupied" && (
                <Button variant="outline" className="mr-auto">
                  <Utensils className="mr-2 h-4 w-4" />
                  Voir la commande
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedTable(null)}>
                Annuler
              </Button>
              <Button onClick={() => setSelectedTable(null)}>Confirmer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Statistiques d'occupation</CardTitle>
          <CardDescription>Vue d'ensemble de l'occupation des tables.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {tables.filter((t) => t.status === "available").length}/{tables.length}
              </div>
              <div className="text-sm text-muted-foreground">Tables disponibles</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {tables.filter((t) => t.status === "occupied").length}/{tables.length}
              </div>
              <div className="text-sm text-muted-foreground">Tables occupées</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {tables.reduce((acc, table) => acc + table.currentOccupancy, 0)}/
                {tables.reduce((acc, table) => acc + table.capacity, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Taux d'occupation</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {Math.round(
                  (tables.reduce((acc, table) => acc + table.currentOccupancy, 0) /
                    tables.reduce((acc, table) => acc + table.capacity, 0)) *
                    100,
                )}
                %
              </div>
              <div className="text-sm text-muted-foreground">Pourcentage d'occupation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
