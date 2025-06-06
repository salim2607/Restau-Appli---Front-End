"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const API_BASE_URL = "http://localhost:8080/api";

export default function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [dishesResponse, drinksResponse, dessertsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/plats`),
          fetch(`${API_BASE_URL}/boissons`),
          fetch(`${API_BASE_URL}/desserts`),
        ]);

        if (!dishesResponse.ok || !drinksResponse.ok || !dessertsResponse.ok) {
          throw new Error("Failed to fetch menu data");
        }

        const [dishesData, drinksData, dessertsData] = await Promise.all([
          dishesResponse.json(),
          drinksResponse.json(),
          dessertsResponse.json(),
        ]);

        setDishes(dishesData);
        setDrinks(drinksData);
        setDesserts(dessertsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Échec du chargement du menu. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddToCart = (item: any) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem.id !== itemId)
    );
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleValidateOrder = async () => {
    try {
      const lignesCommande = cartItems.map((item) => {
        const type = item.type; // "plat", "boisson", "dessert"
        return {
          quantite: item.quantity,
          [type]: { id: item.id },
        };
      });

      const validationResponse = await fetch(`${API_BASE_URL}/commandes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statutPaiement: "payée",
          statutPreparation: "à cuisiner",
          lignesCommande,
        }),
      });

      if (!validationResponse.ok) {
        throw new Error("Échec de la validation de la commande.");
      }

      setSuccessMessage("Commande validée avec succès !");
      setCartItems([]);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Error validating order:", err);
      setError("Échec de la validation de la commande. Veuillez réessayer.");
      setTimeout(() => setError(null), 5000);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.prix * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <span className="text-lg">Chargement du menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center min-h-screen">
        <div className="bg-destructive/15 text-destructive p-6 rounded-lg max-w-md text-center">
          <p className="font-medium">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Notre Menu</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez nos plats, boissons et desserts soigneusement préparés pour vous offrir une expérience culinaire unique.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Menu Items */}
        <div className="lg:flex-1">
          <Tabs defaultValue="food" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="food">Plats</TabsTrigger>
              <TabsTrigger value="drinks">Boissons</TabsTrigger>
              <TabsTrigger value="desserts">Desserts</TabsTrigger>
            </TabsList>

            {/* Plats */}
            <TabsContent value="food" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dishes.map((dish: any) => (
                  <Card key={dish.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video">
                      <img
                        src={dish.imageUrl || "/placeholder-food.jpg"}
                        alt={dish.nom || "Image non disponible"}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{dish.nom || "Nom non disponible"}</CardTitle>
                        <span className="font-bold text-lg">
                          {dish.prix !== null ? `${dish.prix.toFixed(2)} €` : "Prix non disponible"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {dish.description || "Description non disponible"}
                      </CardDescription>
                      <Button 
                        onClick={() => handleAddToCart(dish)} 
                        className="w-full"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Boissons */}
            <TabsContent value="drinks" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drinks.map((drink: any) => (
                  <Card key={drink.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video">
                      <img
                        src={drink.imageUrl || "/placeholder-drink.jpg"}
                        alt={drink.nom}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{drink.nom}</CardTitle>
                        <span className="font-bold text-lg">{`${drink.prix.toFixed(2)} €`}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleAddToCart(drink)} 
                        className="w-full"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Desserts */}
            <TabsContent value="desserts" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {desserts.map((dessert: any) => (
                  <Card key={dessert.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video">
                      <img
                        src={dessert.imageUrl || "/placeholder-dessert.jpg"}
                        alt={dessert.nom}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{dessert.nom}</CardTitle>
                        <span className="font-bold text-lg">{`${dessert.prix.toFixed(2)} €`}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleAddToCart(dessert)} 
                        className="w-full"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Cart Sidebar */}
        <div className="lg:w-96">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Votre Panier</span>
                <Badge variant="secondary">{cartItems.length} article(s)</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  <ul className="space-y-4">
                    {cartItems.map((item) => (
                      <li key={item.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.nom}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.prix.toFixed(2)} € × {item.quantity} = {(item.prix * item.quantity).toFixed(2)} €
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Separator />
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{totalAmount.toFixed(2)} €</span>
                    </div>

                    {/* Section Paiement (interface seulement) */}
                    <div className="space-y-4 pt-4">
                      <h3 className="font-medium">Détails de paiement</h3>
                      <Input
                        placeholder="Numéro de carte"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentChange}
                      />
                      <div className="flex gap-4">
                        <Input
                          placeholder="MM/AA"
                          name="expiryDate"
                          value={paymentDetails.expiryDate}
                          onChange={handlePaymentChange}
                        />
                        <Input
                          placeholder="CVV"
                          name="cvv"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentChange}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleValidateOrder} 
                      className="w-full mt-4"
                    >
                      Valider et payer la commande
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <img 
                    src="/empty-cart.svg" 
                    alt="Panier vide" 
                    className="h-32 w-32 mb-4 opacity-50"
                  />
                  <p className="text-muted-foreground">Votre panier est vide</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ajoutez des articles pour commencer
                  </p>
                </div>
              )}

              {successMessage && (
                <div className="mt-4 p-3 bg-success/10 text-success rounded-md text-sm">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}