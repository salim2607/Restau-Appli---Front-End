"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    nomClient: "",
    email: "",
    dateHeure: "",
    nombrePersonnes: "",
    numeroTable: "",
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError("Veuillez entrer une adresse email valide.");
      return;
    } else {
      setEmailError(null);
    }

    const reservationData = {
      nomClient: formData.nomClient,
      email: formData.email,
      dateHeure: formData.dateHeure,
      nombrePersonnes: parseInt(formData.nombrePersonnes),
      numeroTable: parseInt(formData.numeroTable),
    };

    console.log("Données envoyées :", reservationData); // Vérifiez les données envoyées

    try {
      const response = await fetch("http://localhost:8080/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      console.log("Statut de la réponse :", response.status); // Vérifiez le statut de la réponse
      console.log("Corps de la réponse :", await response.text()); // Vérifiez le corps de la réponse

      if (response.ok) {
        setSuccessMessage("Réservation effectuée avec succès !");
        setErrorMessage(null);
        setFormData({
          nomClient: "",
          email: "",
          dateHeure: "",
          nombrePersonnes: "",
          numeroTable: "",
        });
      } else {
        throw new Error("Erreur lors de la réservation.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setErrorMessage("Une erreur est survenue lors de la réservation.");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Réserver une table</h1>
      <form className="space-y-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nomClient" className="block mb-2 font-medium">
            Nom du client
          </label>
          <Input
            id="nomClient"
            name="nomClient"
            placeholder="Votre nom"
            value={formData.nomClient}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>
        <div>
          <label htmlFor="dateHeure" className="block mb-2 font-medium">
            Date et Heure
          </label>
          <Input
            id="dateHeure"
            name="dateHeure"
            type="datetime-local"
            value={formData.dateHeure}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="nombrePersonnes" className="block mb-2 font-medium">
            Nombre de personnes
          </label>
          <select
            id="nombrePersonnes"
            name="nombrePersonnes"
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
            value={formData.nombrePersonnes}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez</option>
            <option value="1">1 personne</option>
            <option value="2">2 personnes</option>
            <option value="3">3 personnes</option>
            <option value="4">4 personnes</option>
            <option value="5">5 personnes</option>
            <option value="6">6 personnes</option>
            <option value="7">7 personnes</option>
            <option value="8">8 personnes</option>
          </select>
        </div>
        <div>
          <label htmlFor="numeroTable" className="block mb-2 font-medium">
            Numéro de table
          </label>
          <Input
            id="numeroTable"
            name="numeroTable"
            type="number"
            placeholder="Numéro de table"
            value={formData.numeroTable}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white">
          Réserver
        </Button>
      </form>
      {successMessage && <p className="text-green-500 text-sm mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
    </div>
  );
}
