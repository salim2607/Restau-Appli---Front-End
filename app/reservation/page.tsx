"use client";

import { AIImage } from "@/components/AIImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";


export default function ReservationPage() {
  // Fonction pour obtenir la date et l'heure actuelles au format ISO
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{9,15}$/; // Numéro de téléphone entre 9 et 15 chiffres
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nomClient = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
    const dateHeure = (document.getElementById("dateHeure") as HTMLInputElement).value;
    const nombrePersonnes = (document.getElementById("persons") as HTMLSelectElement).value;
    const numeroTable = (document.getElementById("numeroTable") as HTMLInputElement).value;

    if (!validateEmail(email)) {
      setEmailError("Veuillez entrer une adresse email valide.");
      return;
    } else {
      setEmailError(null);
    }

    if (!validatePhone(phone)) {
      setPhoneError("Veuillez entrer un numéro de téléphone valide.");
      return;
    } else {
      setPhoneError(null);
    }

    const reservationData = {
      nomClient,
      dateHeure,
      nombrePersonnes: parseInt(nombrePersonnes),
      numeroTable: parseInt(numeroTable),
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
      <div className="grid md:grid-cols-2 gap-12">
        <div>


        <img
  src="https://i.pinimg.com/736x/22/c4/f5/22c4f5115b7d08821b7e61597a0026ca.jpg"
  alt="Une table élégamment dressée dans un restaurant italien"
  width={600}
  height={400}
  className="rounded-lg shadow-lg mb-6"
/>

          {/*
                    // Utilisation de l'AIImage pour afficher une image avec une alternative

          <AIImage
            prompt="Une table élégamment dressée dans un restaurant italien"
            alt="Une table élégamment dressée dans un restaurant italien"
            width={600}
            height={400}
            className="rounded-lg shadow-lg mb-6"
            fallbackSrc="../photos/reservation.jpg" // Image alternative en cas d'échec
          />
          */ }

        

          <h2 className="text-2xl font-semibold mb-4">
            Profitez d'une soirée inoubliable
          </h2>
          <p className="mb-4">
            Réservez votre table chez Bella Italia et préparez-vous à vivre une
            expérience culinaire authentique. Notre équipe est impatiente de
            vous accueillir et de vous faire découvrir les saveurs de l'Italie.
          </p>
          <p className="mb-2">
            Pour toute demande spéciale ou pour les groupes de plus de 8
            personnes, veuillez nous contacter directement :
          </p>
          <p className="font-semibold">01 23 45 67 89</p>
        </div>
        <div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                Nom du client
              </label>
              <Input id="name" placeholder="Votre nom" required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 font-medium">
                Téléphone
              </label>
              <div className="flex">
                <select className="border border-gray-300 rounded-l-lg p-2 bg-gray-100">
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+49">🇩🇪 +49</option>
                </select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Votre numéro"
                  className="rounded-r-lg"
                  required
                />
              </div>
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>
            <div>
              <label htmlFor="dateHeure" className="block mb-2 font-medium">
                Date et Heure
              </label>
              <Input
                id="dateHeure"
                type="datetime-local"
                min={getCurrentDateTime()}
                required
              />
            </div>
            <div>
              <label htmlFor="persons" className="block mb-2 font-medium">
                Nombre de personnes
              </label>
              <select
                id="persons"
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
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
                <option value="plus">Plus de 8 personnes</option>
              </select>
            </div>
            <div>
              <label htmlFor="numeroTable" className="block mb-2 font-medium">
                Numéro de table
              </label>
              <Input
                id="numeroTable"
                type="number"
                placeholder="Numéro de table"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 text-white">
              Réserver
            </Button>
          </form>
          {successMessage && (
            <p className="text-green-500 text-sm mt-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
