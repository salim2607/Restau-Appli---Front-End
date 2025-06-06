"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Plus, X } from "lucide-react";

const API_URL = "http://localhost:8080/api/reservations"; // Remplacez par votre base_url

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // État pour la date sélectionnée

  // Récupération des réservations depuis l'API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des réservations.");
        }
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Filtrer les réservations par date sélectionnée
  const filteredReservations = selectedDate
    ? reservations.filter(
        (reservation) =>
          new Date(reservation.dateHeure).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
      )
    : reservations;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* En-tête */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Réservations</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle réservation
        </Button>
      </div>

      {/* Contenu principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Liste des réservations */}
        <CardContent>
          {loading ? (
            <p>Chargement des réservations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredReservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Personnes</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.nomClient}</TableCell>
                    <TableCell>{reservation.email}</TableCell>
                    <TableCell>{new Date(reservation.dateHeure).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(reservation.dateHeure).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                    <TableCell>{reservation.nombrePersonnes}</TableCell>
                    <TableCell>{reservation.numeroTable || "Non attribuée"}</TableCell>
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
          ) : (
            <p>Aucune réservation trouvée.</p>
          )}
        </CardContent>

        {/* Calendrier */}
        <CardContent>
          <div className="space-y-4">
            <label htmlFor="date" className="block text-sm font-medium">
              Sélectionnez une date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            <p className="text-sm text-muted-foreground">
              {selectedDate
                ? `Réservations pour le ${new Date(selectedDate).toLocaleDateString()}`
                : "Toutes les réservations"}
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
}

