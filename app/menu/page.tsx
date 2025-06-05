"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch plats
        const dishesResponse = await fetch("http://localhost:8080/api/plats");
        if (!dishesResponse.ok) throw new Error("Failed to fetch dishes");
        const dishesData = await dishesResponse.json();
        setDishes(dishesData);

        // Fetch boissons
        const drinksResponse = await fetch("http://localhost:8080/api/boissons");
        if (!drinksResponse.ok) throw new Error("Failed to fetch drinks");
        const drinksData = await drinksResponse.json();
        setDrinks(drinksData);

        // Fetch desserts
        const dessertsResponse = await fetch("http://localhost:8080/api/desserts");
        if (!dessertsResponse.ok) throw new Error("Failed to fetch desserts");
        const dessertsData = await dessertsResponse.json();
        setDesserts(dessertsData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load menu data. Please try again later.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement du menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md mx-auto">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Notre Menu</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez nos plats, boissons et desserts soigneusement préparés pour vous offrir une expérience culinaire unique.
        </p>
      </div>

      <Tabs defaultValue="food" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="food">Plats</TabsTrigger>
          <TabsTrigger value="drinks">Boissons</TabsTrigger>
          <TabsTrigger value="desserts">Desserts</TabsTrigger>
        </TabsList>

        {/* Plats */}
        <TabsContent value="food" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dishes.map((dish: any) => (
              <Card key={dish.id} className="menu-card">
                <img
                  src={dish.imageUrl || "https://via.placeholder.com/400x300"}
                  alt={dish.nom || "Image non disponible"}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{dish.nom || "Nom non disponible"}</CardTitle>
                    <span className="font-bold text-lg">
                      {dish.prix !== null ? `${dish.prix.toFixed(2)} €` : "Prix non disponible"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{dish.description || "Description non disponible"}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Boissons */}
        <TabsContent value="drinks" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drinks.map((drink: any) => (
              <Card key={drink.id} className="menu-card">
                <img
                  src={drink.imageUrl || "https://via.placeholder.com/400x300"}
                  alt={drink.nom}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{drink.nom}</CardTitle>
                    <span className="font-bold text-lg">{`${drink.prix.toFixed(2)} €`}</span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Desserts */}
        <TabsContent value="desserts" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {desserts.map((dessert: any) => (
              <Card key={dessert.id} className="menu-card">
                <img
                  src={dessert.imageUrl || "https://via.placeholder.com/400x300"}
                  alt={dessert.nom}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{dessert.nom}</CardTitle>
                    <span className="font-bold text-lg">{`${dessert.prix.toFixed(2)} €`}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{dessert.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
