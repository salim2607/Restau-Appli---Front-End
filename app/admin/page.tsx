"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

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

export default function AdminPage() {
  // State for data
  const [menus, setMenus] = useState<Menu[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)

  // State for form data
  const [menuForm, setMenuForm] = useState<Partial<Menu>>({ name: "", description: "" })
  const [dishForm, setDishForm] = useState<Partial<Dish>>({ name: "", description: "", price: 0, menuId: 0 })
  const [drinkForm, setDrinkForm] = useState<Partial<Drink>>({ name: "", description: "", price: 0, category: "" })

  // State for edit mode
  const [editingMenu, setEditingMenu] = useState<number | null>(null)
  const [editingDish, setEditingDish] = useState<number | null>(null)
  const [editingDrink, setEditingDrink] = useState<number | null>(null)

  // State for dialogs
  const [menuDialogOpen, setMenuDialogOpen] = useState(false)
  const [dishDialogOpen, setDishDialogOpen] = useState(false)
  const [drinkDialogOpen, setDrinkDialogOpen] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Function to fetch all data
  const fetchData = async () => {
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
      toast({
        title: "Error",
        description: "Failed to load data. Using sample data instead.",
        variant: "destructive",
      })

      // Set sample data for preview
      setMenus([
        { id: 1, name: "Appetizers", description: "Start your meal with our delicious appetizers" },
        { id: 2, name: "Pasta", description: "Authentic Italian pasta dishes" },
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
          name: "Spaghetti Carbonara",
          description: "Classic Roman pasta with eggs, cheese, pancetta, and black pepper",
          price: 16.95,
          menuId: 2,
        },
      ])

      setDrinks([
        { id: 1, name: "Chianti", description: "Classic Tuscan red wine", price: 9.95, category: "Wine" },
        { id: 2, name: "Espresso", description: "Strong Italian coffee", price: 3.95, category: "Coffee" },
      ])

      setLoading(false)
    }
  }

  // Menu CRUD operations
  const addMenu = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuForm),
      })

      if (!response.ok) throw new Error("Failed to add menu")

      const newMenu = await response.json()
      setMenus([...menus, newMenu])
      setMenuForm({ name: "", description: "" })
      setMenuDialogOpen(false)
      toast({ title: "Success", description: "Menu added successfully" })
    } catch (err) {
      console.error("Error adding menu:", err)
      toast({
        title: "Error",
        description: "Failed to add menu. Please try again.",
        variant: "destructive",
      })

      // For preview, add to local state
      const newMenu = {
        id: menus.length ? Math.max(...menus.map((m) => m.id)) + 1 : 1,
        name: menuForm.name || "",
        description: menuForm.description || "",
      }
      setMenus([...menus, newMenu])
      setMenuForm({ name: "", description: "" })
      setMenuDialogOpen(false)
    }
  }

  const updateMenu = async () => {
    if (!editingMenu) return

    try {
      const response = await fetch(`http://localhost:8080/api/menus/${editingMenu}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuForm),
      })

      if (!response.ok) throw new Error("Failed to update menu")

      const updatedMenu = await response.json()
      setMenus(menus.map((menu) => (menu.id === editingMenu ? updatedMenu : menu)))
      setMenuForm({ name: "", description: "" })
      setEditingMenu(null)
      setMenuDialogOpen(false)
      toast({ title: "Success", description: "Menu updated successfully" })
    } catch (err) {
      console.error("Error updating menu:", err)
      toast({
        title: "Error",
        description: "Failed to update menu. Please try again.",
        variant: "destructive",
      })

      // For preview, update local state
      setMenus(menus.map((menu) => (menu.id === editingMenu ? { ...menu, ...menuForm } : menu)))
      setMenuForm({ name: "", description: "" })
      setEditingMenu(null)
      setMenuDialogOpen(false)
    }
  }

  const deleteMenu = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/menus/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete menu")

      setMenus(menus.filter((menu) => menu.id !== id))
      toast({ title: "Success", description: "Menu deleted successfully" })
    } catch (err) {
      console.error("Error deleting menu:", err)
      toast({
        title: "Error",
        description: "Failed to delete menu. Please try again.",
        variant: "destructive",
      })

      // For preview, remove from local state
      setMenus(menus.filter((menu) => menu.id !== id))
    }
  }

  // Dish CRUD operations
  const addDish = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/plats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dishForm),
      })

      if (!response.ok) throw new Error("Failed to add dish")

      const newDish = await response.json()
      setDishes([...dishes, newDish])
      setDishForm({ name: "", description: "", price: 0, menuId: 0 })
      setDishDialogOpen(false)
      toast({ title: "Success", description: "Dish added successfully" })
    } catch (err) {
      console.error("Error adding dish:", err)
      toast({
        title: "Error",
        description: "Failed to add dish. Please try again.",
        variant: "destructive",
      })

      // For preview, add to local state
      const newDish = {
        id: dishes.length ? Math.max(...dishes.map((d) => d.id)) + 1 : 1,
        name: dishForm.name || "",
        description: dishForm.description || "",
        price: dishForm.price || 0,
        menuId: dishForm.menuId || 0,
      }
      setDishes([...dishes, newDish])
      setDishForm({ name: "", description: "", price: 0, menuId: 0 })
      setDishDialogOpen(false)
    }
  }

  const updateDish = async () => {
    if (!editingDish) return

    try {
      const response = await fetch(`http://localhost:8080/api/plats/${editingDish}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dishForm),
      })

      if (!response.ok) throw new Error("Failed to update dish")

      const updatedDish = await response.json()
      setDishes(dishes.map((dish) => (dish.id === editingDish ? updatedDish : dish)))
      setDishForm({ name: "", description: "", price: 0, menuId: 0 })
      setEditingDish(null)
      setDishDialogOpen(false)
      toast({ title: "Success", description: "Dish updated successfully" })
    } catch (err) {
      console.error("Error updating dish:", err)
      toast({
        title: "Error",
        description: "Failed to update dish. Please try again.",
        variant: "destructive",
      })

      // For preview, update local state
      setDishes(dishes.map((dish) => (dish.id === editingDish ? { ...dish, ...dishForm } : dish)))
      setDishForm({ name: "", description: "", price: 0, menuId: 0 })
      setEditingDish(null)
      setDishDialogOpen(false)
    }
  }

  const deleteDish = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/plats/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete dish")

      setDishes(dishes.filter((dish) => dish.id !== id))
      toast({ title: "Success", description: "Dish deleted successfully" })
    } catch (err) {
      console.error("Error deleting dish:", err)
      toast({
        title: "Error",
        description: "Failed to delete dish. Please try again.",
        variant: "destructive",
      })

      // For preview, remove from local state
      setDishes(dishes.filter((dish) => dish.id !== id))
    }
  }

  // Drink CRUD operations
  const addDrink = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/boissons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drinkForm),
      })

      if (!response.ok) throw new Error("Failed to add drink")

      const newDrink = await response.json()
      setDrinks([...drinks, newDrink])
      setDrinkForm({ name: "", description: "", price: 0, category: "" })
      setDrinkDialogOpen(false)
      toast({ title: "Success", description: "Drink added successfully" })
    } catch (err) {
      console.error("Error adding drink:", err)
      toast({
        title: "Error",
        description: "Failed to add drink. Please try again.",
        variant: "destructive",
      })

      // For preview, add to local state
      const newDrink = {
        id: drinks.length ? Math.max(...drinks.map((d) => d.id)) + 1 : 1,
        name: drinkForm.name || "",
        description: drinkForm.description || "",
        price: drinkForm.price || 0,
        category: drinkForm.category || "",
      }
      setDrinks([...drinks, newDrink])
      setDrinkForm({ name: "", description: "", price: 0, category: "" })
      setDrinkDialogOpen(false)
    }
  }

  const updateDrink = async () => {
    if (!editingDrink) return

    try {
      const response = await fetch(`http://localhost:8080/api/boissons/${editingDrink}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drinkForm),
      })

      if (!response.ok) throw new Error("Failed to update drink")

      const updatedDrink = await response.json()
      setDrinks(drinks.map((drink) => (drink.id === editingDrink ? updatedDrink : drink)))
      setDrinkForm({ name: "", description: "", price: 0, category: "" })
      setEditingDrink(null)
      setDrinkDialogOpen(false)
      toast({ title: "Success", description: "Drink updated successfully" })
    } catch (err) {
      console.error("Error updating drink:", err)
      toast({
        title: "Error",
        description: "Failed to update drink. Please try again.",
        variant: "destructive",
      })

      // For preview, update local state
      setDrinks(drinks.map((drink) => (drink.id === editingDrink ? { ...drink, ...drinkForm } : drink)))
      setDrinkForm({ name: "", description: "", price: 0, category: "" })
      setEditingDrink(null)
      setDrinkDialogOpen(false)
    }
  }

  const deleteDrink = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/boissons/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete drink")

      setDrinks(drinks.filter((drink) => drink.id !== id))
      toast({ title: "Success", description: "Drink deleted successfully" })
    } catch (err) {
      console.error("Error deleting drink:", err)
      toast({
        title: "Error",
        description: "Failed to delete drink. Please try again.",
        variant: "destructive",
      })

      // For preview, remove from local state
      setDrinks(drinks.filter((drink) => drink.id !== id))
    }
  }

  // Helper functions for forms
  const handleEditMenu = (menu: Menu) => {
    setMenuForm({ name: menu.name, description: menu.description })
    setEditingMenu(menu.id)
    setMenuDialogOpen(true)
  }

  const handleEditDish = (dish: Dish) => {
    setDishForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      menuId: dish.menuId,
    })
    setEditingDish(dish.id)
    setDishDialogOpen(true)
  }

  const handleEditDrink = (drink: Drink) => {
    setDrinkForm({
      name: drink.name,
      description: drink.description,
      price: drink.price,
      category: drink.category,
    })
    setEditingDrink(drink.id)
    setDrinkDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement du tableau de bord d'administration...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Tableau de Bord d'Administration</h1>
        <p className="text-muted-foreground">Gérez les menus, plats et boissons de votre restaurant.</p>
      </div>

      <Tabs defaultValue="menus" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="menus">Menus</TabsTrigger>
          <TabsTrigger value="dishes">Plats</TabsTrigger>
          <TabsTrigger value="drinks">Boissons</TabsTrigger>
        </TabsList>

        {/* Menus Tab */}
        <TabsContent value="menus" className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Menus</CardTitle>
                  <CardDescription>Gérez les menus de votre restaurant</CardDescription>
                </div>
                <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setMenuForm({ name: "", description: "" })
                        setEditingMenu(null)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Ajouter Menu
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingMenu ? "Modifier Menu" : "Ajouter Menu"}</DialogTitle>
                      <DialogDescription>
                        {editingMenu
                          ? "Mettez à jour les détails du menu ci-dessous."
                          : "Remplissez les détails pour le nouveau menu."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="menu-name">Nom</Label>
                        <Input
                          id="menu-name"
                          value={menuForm.name}
                          onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="menu-description">Description</Label>
                        <Textarea
                          id="menu-description"
                          value={menuForm.description}
                          onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMenuDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={editingMenu ? updateMenu : addMenu}>
                        {editingMenu ? "Mettre à jour" : "Ajouter"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Aucun menu trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    menus.map((menu) => (
                      <TableRow key={menu.id}>
                        <TableCell>{menu.id}</TableCell>
                        <TableCell>{menu.name}</TableCell>
                        <TableCell>{menu.description}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditMenu(menu)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteMenu(menu.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dishes Tab */}
        <TabsContent value="dishes" className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Plats</CardTitle>
                  <CardDescription>Gérez les plats de votre restaurant</CardDescription>
                </div>
                <Dialog open={dishDialogOpen} onOpenChange={setDishDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setDishForm({ name: "", description: "", price: 0, menuId: menus[0]?.id || 0 })
                        setEditingDish(null)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Ajouter Plat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingDish ? "Modifier Plat" : "Ajouter Plat"}</DialogTitle>
                      <DialogDescription>
                        {editingDish
                          ? "Mettez à jour les détails du plat ci-dessous."
                          : "Remplissez les détails pour le nouveau plat."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dish-name">Nom</Label>
                        <Input
                          id="dish-name"
                          value={dishForm.name}
                          onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dish-description">Description</Label>
                        <Textarea
                          id="dish-description"
                          value={dishForm.description}
                          onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dish-price">Prix</Label>
                        <Input
                          id="dish-price"
                          type="number"
                          step="0.01"
                          value={dishForm.price}
                          onChange={(e) => setDishForm({ ...dishForm, price: Number.parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dish-menu">Menu</Label>
                        <select
                          id="dish-menu"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={dishForm.menuId}
                          onChange={(e) => setDishForm({ ...dishForm, menuId: Number.parseInt(e.target.value) })}
                        >
                          {menus.map((menu) => (
                            <option key={menu.id} value={menu.id}>
                              {menu.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDishDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={editingDish ? updateDish : addDish}>
                        {editingDish ? "Mettre à jour" : "Ajouter"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Menu</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dishes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Aucun plat trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    dishes.map((dish) => (
                      <TableRow key={dish.id}>
                        <TableCell>{dish.id}</TableCell>
                        <TableCell>{dish.name}</TableCell>
                        <TableCell>{dish.description}</TableCell>
                        <TableCell>${dish.price.toFixed(2)}</TableCell>
                        <TableCell>{menus.find((m) => m.id === dish.menuId)?.name || "Inconnu"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditDish(dish)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteDish(dish.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drinks Tab */}
        <TabsContent value="drinks" className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Boissons</CardTitle>
                  <CardDescription>Gérez les boissons de votre restaurant</CardDescription>
                </div>
                <Dialog open={drinkDialogOpen} onOpenChange={setDrinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setDrinkForm({ name: "", description: "", price: 0, category: "" })
                        setEditingDrink(null)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Ajouter Boisson
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingDrink ? "Modifier Boisson" : "Ajouter Boisson"}</DialogTitle>
                      <DialogDescription>
                        {editingDrink
                          ? "Mettez à jour les détails de la boisson ci-dessous."
                          : "Remplissez les détails pour la nouvelle boisson."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="drink-name">Nom</Label>
                        <Input
                          id="drink-name"
                          value={drinkForm.name}
                          onChange={(e) => setDrinkForm({ ...drinkForm, name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="drink-description">Description</Label>
                        <Textarea
                          id="drink-description"
                          value={drinkForm.description}
                          onChange={(e) => setDrinkForm({ ...drinkForm, description: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="drink-price">Prix</Label>
                        <Input
                          id="drink-price"
                          type="number"
                          step="0.01"
                          value={drinkForm.price}
                          onChange={(e) => setDrinkForm({ ...drinkForm, price: Number.parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="drink-category">Catégorie</Label>
                        <Input
                          id="drink-category"
                          value={drinkForm.category}
                          onChange={(e) => setDrinkForm({ ...drinkForm, category: e.target.value })}
                          placeholder="Vin, Bière, Café, etc."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDrinkDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={editingDrink ? updateDrink : addDrink}>
                        {editingDrink ? "Mettre à jour" : "Ajouter"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drinks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Aucune boisson trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    drinks.map((drink) => (
                      <TableRow key={drink.id}>
                        <TableCell>{drink.id}</TableCell>
                        <TableCell>{drink.name}</TableCell>
                        <TableCell>{drink.description}</TableCell>
                        <TableCell>${drink.price.toFixed(2)}</TableCell>
                        <TableCell>{drink.category}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditDrink(drink)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteDrink(drink.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

