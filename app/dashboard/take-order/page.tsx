"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import CartItem from "@/components/ui/cart-item";

// Types
interface MenuItemType {
  id: number;
  nom: string;
  prix: number;
  imageUrl: string;
  category: "Plats" | "Boissons" | "Desserts";
  description?: string | null;
}

interface CartItemType extends Pick<MenuItemType, "id" | "nom" | "prix"> {
  quantity: number;
}

const API_ENDPOINTS = {
  Plats: "http://localhost:8080/api/plats",
  Boissons: "http://localhost:8080/api/boissons",
  Desserts: "http://localhost:8080/api/desserts",
};

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [activeCategory, setActiveCategory] = useState<"Plats" | "Boissons" | "Desserts">("Plats");
  const [cartAnimation, setCartAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const categories = Object.keys(API_ENDPOINTS) as Array<keyof typeof API_ENDPOINTS>;
        const results = await Promise.all(
          categories.map((category) =>
            fetch(API_ENDPOINTS[category])
              .then((res) => {
                if (!res.ok) throw new Error(`Échec du chargement des ${category}`);
                return res.json();
              })
              .then((items) =>
                items.map((item: Omit<MenuItemType, "category">) => ({
                  ...item,
                  category,
                }))
              )
          )
        );

        setMenuItems(results.flat());
      } catch (err) {
        console.error("Erreur lors du chargement du menu:", err);
        setError("Échec du chargement des données du menu. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const addToCart = (item: MenuItemType) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevItems, { id: item.id, nom: item.nom, prix: item.prix, quantity: 1 }];
      }
    });

    setCartAnimation(true);
    setTimeout(() => setCartAnimation(false), 700);

    toast({
      title: "Article ajouté",
      description: `${item.nom} a été ajouté à votre commande`,
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast({
      title: "Article supprimé",
      description: "L'article a été retiré de votre commande",
      variant: "destructive",
    });
  };

  const validateOrder = async () => {
    try {
      // Construire les données de la commande
      const orderData = {
        statutPaiement: "a payée",
        statutPreparation: "à cuisiner",
        lignesCommande: cartItems.map((item) => {
          const category = menuItems.find((menuItem) => menuItem.id === item.id)?.category;
          return {
            quantite: item.quantity,
            [category === "Plats" ? "plat" : category === "Boissons" ? "boisson" : "dessert"]: { id: item.id },
          };
        }),
      };

      // Envoyer la commande au backend
      const response = await fetch("http://localhost:8080/api/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Échec de la validation de la commande");
      }

      toast({
        title: "Commande validée",
        description: "Votre commande a été envoyée avec succès !",
      });

      // Réinitialiser le panier après validation
      setCartItems([]);
    } catch (error) {
      console.error("Erreur lors de la validation de la commande:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation de votre commande.",
        variant: "destructive",
      });
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.prix * item.quantity, 0);

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="flex gap-4">
              {["Plats", "Boissons", "Desserts"].map((category) => (
                <Skeleton key={category} className="h-10 w-24 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md mx-auto">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Section */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Menu</h2>

            {/* Category Buttons */}
            <div className="flex gap-4 mb-8">
              {["Plats", "Boissons", "Desserts"].map((category) => (
                <button
                  key={category}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                .filter((item) => item.category === activeCategory)
                .map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                    <div className="relative h-48">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.nom}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">{item.nom}</h3>
                        <p className="text-lg font-semibold">
                          {typeof item.prix === "number" ? `${item.prix.toFixed(2)} €` : "Prix non disponible"}
                        </p>
                      </div>
                      <button
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-110 active:scale-95"
                        onClick={() => addToCart(item)}
                        aria-label={`Ajouter ${item.nom} au panier`}
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Order Section */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="sticky top-4 bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ma Commande</h2>
                <div className={`relative ${cartAnimation ? "animate-bounce" : ""}`}>
                  <ShoppingBag size={24} className="text-red-600" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-200 mb-4" />

              {/* Order Items */}
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Votre panier est vide</div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {cartItems.map((item) => {
                    const menuItem = menuItems.find((menuItem) => menuItem.id === item.id);
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        {menuItem?.imageUrl && (
                          <img
                            src={menuItem.imageUrl}
                            alt={item.nom}
                            className="h-16 w-16 object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        )}
                        <CartItem
                          title={item.nom}
                          quantity={item.quantity}
                          price={item.prix * item.quantity}
                          onRemove={() => removeFromCart(item.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Total */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
              </div>

              {/* Order Button */}
              <div className="mt-8">
                <button
                  className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${
                    cartItems.length > 0
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={cartItems.length === 0}
                  onClick={validateOrder}
                >
                  Commander
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}