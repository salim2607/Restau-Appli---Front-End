"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { AIImage } from "@/components/AIImage"

// Types for our data
interface Menu {
  id: number
  name: string
  description: string
}

interface Dish {
  id: number
  name: string
  description: string
  price: number
  menuId: number
}

interface Drink {
  id: number
  name: string
  description: string
  price: number
  category: string
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch menus
        const menusResponse = await fetch("http://localhost:8080/api/menus")
        if (!menusResponse.ok) throw new Error("Failed to fetch menus")
        const menusData = await menusResponse.json()
        setMenus(menusData)

        // Fetch dishes
        const dishesResponse = await fetch("http://localhost:8080/api/plats")
        if (!dishesResponse.ok) throw new Error("Failed to fetch dishes")
        const dishesData = await dishesResponse.json()
        setDishes(dishesData)

        // Fetch drinks
        const drinksResponse = await fetch("http://localhost:8080/api/boissons")
        if (!drinksResponse.ok) throw new Error("Failed to fetch drinks")
        const drinksData = await drinksResponse.json()
        setDrinks(drinksData)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load menu data. Please try again later.")
        setLoading(false)

        // Set some sample data for preview purposes
        setMenus([
          { id: 1, name: "Appetizers", description: "Start your meal with our delicious appetizers" },
          { id: 2, name: "Pasta", description: "Authentic Italian pasta dishes" },
          { id: 3, name: "Pizza", description: "Traditional wood-fired pizzas" },
          { id: 4, name: "Desserts", description: "Sweet treats to finish your meal" },
        ])

        setDishes([
          {
            id: 1,
            name: "Bruschetta",
            description: "Toasted bread topped with tomatoes, garlic, and basil",
            price: 8.95,
            menuId: 1,
          },
          {
            id: 2,
            name: "Calamari Fritti",
            description: "Crispy fried calamari served with marinara sauce",
            price: 12.95,
            menuId: 1,
          },
          {
            id: 3,
            name: "Spaghetti Carbonara",
            description: "Classic Roman pasta with eggs, cheese, pancetta, and black pepper",
            price: 16.95,
            menuId: 2,
          },
          {
            id: 4,
            name: "Fettuccine Alfredo",
            description: "Fettuccine pasta in a rich, creamy Parmesan sauce",
            price: 15.95,
            menuId: 2,
          },
          {
            id: 5,
            name: "Margherita Pizza",
            description: "Traditional Neapolitan pizza with tomatoes, mozzarella, and basil",
            price: 14.95,
            menuId: 3,
          },
          {
            id: 6,
            name: "Quattro Formaggi",
            description: "Four cheese pizza with mozzarella, gorgonzola, fontina, and parmesan",
            price: 16.95,
            menuId: 3,
          },
          {
            id: 7,
            name: "Tiramisu",
            description: "Espresso-soaked ladyfingers layered with mascarpone cream",
            price: 8.95,
            menuId: 4,
          },
          {
            id: 8,
            name: "Panna Cotta",
            description: "Italian custard topped with berry compote",
            price: 7.95,
            menuId: 4,
          },
        ])

        setDrinks([
          { id: 1, name: "Chianti", description: "Classic Tuscan red wine", price: 9.95, category: "Wine" },
          {
            id: 2,
            name: "Pinot Grigio",
            description: "Crisp and refreshing white wine",
            price: 8.95,
            category: "Wine",
          },
          { id: 3, name: "Espresso", description: "Strong Italian coffee", price: 3.95, category: "Coffee" },
          {
            id: 4,
            name: "Cappuccino",
            description: "Espresso with steamed milk and foam",
            price: 4.95,
            category: "Coffee",
          },
          {
            id: 5,
            name: "San Pellegrino",
            description: "Sparkling mineral water",
            price: 3.95,
            category: "Non-Alcoholic",
          },
          { id: 6, name: "Limonata", description: "Italian lemonade", price: 3.95, category: "Non-Alcoholic" },
        ])
      }
    }

    fetchData()
  }, [])

  // Group dishes by menu
  const getDishesByMenuId = (menuId: number) => {
    return dishes.filter((dish) => dish.menuId === menuId)
  }

  // Group drinks by category
  const drinkCategories = [...new Set(drinks.map((drink) => drink.category))]
  const getDrinksByCategory = (category: string) => {
    return drinks.filter((drink) => drink.category === category)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement du menu...</span>
      </div>
    )
  }

  if (error && !menus.length) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md mx-auto">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Notre Menu</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explorez nos plats italiens authentiques préparés avec les meilleurs ingrédients et des recettes
          traditionnelles.
        </p>
      </div>

      <Tabs defaultValue="food" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="food">Plats</TabsTrigger>
          <TabsTrigger value="drinks">Boissons</TabsTrigger>
        </TabsList>

        <TabsContent value="food" className="mt-8">
          {menus.map((menu) => (
            <div key={menu.id} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{menu.name}</h2>
              <p className="text-muted-foreground mb-6">{menu.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getDishesByMenuId(menu.id).map((dish) => (
                  <Card key={dish.id} className="menu-card">
                    <AIImage
                      prompt={`Un plat de ${dish.name} italien authentique`}
                      alt={dish.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{dish.name}</CardTitle>
                        <span className="font-bold text-lg">{dish.price.toFixed(2)} €</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{dish.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="drinks" className="mt-8">
          {drinkCategories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getDrinksByCategory(category).map((drink) => (
                  <Card key={drink.id} className="menu-card">
                    <AIImage
                      prompt={`Une boisson ${drink.name} dans un verre approprié`}
                      alt={drink.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{drink.name}</CardTitle>
                        <span className="font-bold text-lg">{drink.price.toFixed(2)} €</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{drink.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

