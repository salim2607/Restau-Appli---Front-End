"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Échec de la connexion. Vérifiez vos identifiants.");
      }

      const data = await response.json();

      // Stocker le token ou gérer la session si nécessaire
      console.log("Connexion réussie :", data);

      // Rediriger vers le tableau de bord
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Section Formulaire de Connexion */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-semibold text-gray-800">Bienvenue !</h1>
            <p className="text-gray-600">Entrez vos identifiants pour accéder à votre compte</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <a href="#" className="text-xs text-gray-500 hover:text-primary">
                  Mot de passe oublié ?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Se souvenir de moi pendant 30 jours
              </Label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
              {loading ? "Connexion..." : "Connexion"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Vous n'avez pas de compte ?
            <Link href="/signup" className="ml-1 font-medium text-primary hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>

      {/* Section Image */}
      <div className="relative flex-1 h-64 md:h-auto">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_restau-10nJ27w6Gs5js8IjGpAWA7ZHjgD0WJ.webp"
          alt="Cozy restaurant interior with warm lighting, wooden tables and brick walls"
          fill
          className="object-cover rounded-t-2xl md:rounded-t-none md:rounded-r-2xl"
          priority
        />
      </div>
    </div>
  );
}

