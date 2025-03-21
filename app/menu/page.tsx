"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Types pour les données
interface Dish {
  id: number;
  nom: string | null;
  description: string | null;
  prix: number | null;
  imageUrl: string | null;
}

interface Drink {
  id: number;
  nom: string;
  prix: number;
  imageUrl: string;
}

interface Dessert {
  id: number;
  nom: string;
  description: string;
  prix: number;
  imageUrl: string;
}

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Données statiques pour les desserts
  const desserts: Dessert[] = [
    {
      id: 1,
      nom: "Tiramisu",
      description: "Biscuits imbibés d'espresso superposés avec de la crème de mascarpone.",
      prix: 8.95,
      imageUrl: "https://i.pinimg.com/736x/f2/5f/14/f25f148f1075c1a2bfbe058c178402e7.jpg",
    },
    {
      id: 2,
      nom: "Panna Cotta",
      description: "Crème cuite italienne servie avec un coulis de fruits rouges.",
      prix: 6.95,
      imageUrl: "https://i.pinimg.com/736x/33/04/5d/33045d34012feff40248a3e48332b0bc.jpg",
    },
    {
      id: 3,
      nom: "Cannoli Sicilien",
      description: "Pâtisserie croustillante farcie de ricotta sucrée et de pépites de chocolat.",
      prix: 7.95,
      imageUrl: "https://i.pinimg.com/736x/37/f0/81/37f0819fd43c0d991b61d44f4e4af415.jpg",
    },
  ];

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
            {dishes.map((dish) => (
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
            {drinks.map((drink) => (
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
            {desserts.map((dessert) => (
              <Card key={dessert.id} className="menu-card">
                <img
                  src={dessert.imageUrl}
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
