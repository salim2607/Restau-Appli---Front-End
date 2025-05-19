"use client"

import { useState } from "react"
import { ShoppingBag } from "lucide-react"
import MenuItem from "@/components/ui/menu-item"
import CartItem from "@/components/ui/cart-item"
import { useToast } from "@/hooks/use-toast"

// Types
interface CartItemType {
  id: number
  title: string
  price: number
  quantity: number
}

interface MenuItemType {
  id: number
  title: string
  price: number
  image: string
  category: string
}

// Sample menu data
const menuItems: MenuItemType[] = [
  // Plats
  {
    id: 1,
    title: "Pizza Margherita",
    price: 18.5,
    image: "https://i.pinimg.com/736x/5a/f0/f9/5af0f988645c8aadf291cc82222d14eb.jpg",
    category: "Plats",
  },
  {
    id: 2,
    title: "pizza peperoni",
    price: 18.5,
    image: "https://i.pinimg.com/736x/9f/07/ca/9f07ca45829cd07b6fee2c9506822496.jpg",
    category: "Plats",
  },
  {
    id: 3,
    title: "Pizza Végétarienne",
    price: 18.5,
    image: "https://i.pinimg.com/736x/4b/6b/17/4b6b177b133679bf9f5b234d00f19f88.jpg",
    category: "Plats",
  },
  // Boissons
  {
    id: 4,
    title: "Vin Rouge (75cl)",
    price: 24.9,
    image: "https://i.pinimg.com/736x/0d/b1/91/0db191b7ee7886e2e64d322af8683c53.jpg",
    category: "Boissons",
  },
  {
    id: 5,
    title: "Eau Minérale",
    price: 3.5,
    image: "https://i.pinimg.com/736x/d3/26/96/d3269629c0d93b8cf16bcd0fc7c387ef.jpg",
    category: "Boissons",
  },
  {
    id: 6,
    title: "Coca-Cola (33cl)",
    price: 4.2,
    image: "https://i.pinimg.com/736x/71/2f/22/712f228cf0f80bc3d725325b5e2cf734.jpg",
    category: "Boissons",
  },
  {
    id: 7,
    title: "Spritz Aperol",
    price: 8.9,
    image: "https://i.pinimg.com/736x/85/9e/bd/859ebdae8ab6c0858246a0821b9a65b0.jpg",
    category: "Boissons",
  },
  // Desserts
  {
    id: 8,
    title: "Tiramisu",
    price: 7.5,
    image: "https://i.pinimg.com/736x/b7/46/ee/b746ee2653c180da2c34f6cfb3df2570.jpg",
    category: "Desserts",
  },
  {
    id: 9,
    title: "Panna Cotta",
    price: 6.9,
    image: "https://i.pinimg.com/736x/f3/54/09/f35409765f7559e86fa7000fd511f043.jpg",
    category: "Desserts",
  },
  {
    id: 10,
    title: "Gelato (3 boules)",
    price: 8.5,
    image: "https://i.pinimg.com/736x/3b/62/a8/3b62a81f5362dd1ba13df3ada938761a.jpg",
    category: "Desserts",
  },
]

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [activeCategory, setActiveCategory] = useState("Plats")
  const [cartAnimation, setCartAnimation] = useState(false)
  const { toast } = useToast()

  // Add item to cart
  const addToCart = (item: MenuItemType) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        // Increment quantity if item exists
        return prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        // Add new item to cart
        return [...prevItems, { id: item.id, title: item.title, price: item.price, quantity: 1 }]
      }
    })

    // Trigger cart animation
    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 700)

    // Show toast notification
    toast({
      title: "Article ajouté",
      description: `${item.title} a été ajouté à votre commande`,
    })
  }

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))

    toast({
      title: "Article supprimé",
      description: "L'article a été retiré de votre commande",
      variant: "destructive",
    })
  }

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <main className="min-h-screen">
      
   

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Section */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Menu category</h2>

            {/* Category Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === "Plats" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setActiveCategory("Plats")}
              >
                Plats
              </button>
              <button
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === "Boissons"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setActiveCategory("Boissons")}
              >
                Boissons
              </button>
              <button
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === "Desserts"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setActiveCategory("Desserts")}
              >
                Desserts
              </button>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                .filter((item) => item.category === activeCategory)
                .map((item) => (
                  <div key={item.id} className="transform transition-all duration-300 hover:scale-105">
                    <MenuItem
                      title={item.title}
                      price={item.price}
                      image={item.image}
                      onAddToCart={() => addToCart(item)}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Order Section */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="sticky top-4">
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
              <div className="border-b border-gray-200 mb-4"></div>

              {/* Order Items */}
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Votre panier est vide</div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 transform transition-all duration-300">
                      {/* Image */}
                      <img
                        src={menuItems.find((menuItem) => menuItem.id === item.id)?.image || "/placeholder.svg"}
                        alt={item.title}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                      {/* Commande Details */}
                      <CartItem
                        title={item.title}
                        quantity={item.quantity}
                        price={item.price * item.quantity}
                        onRemove={() => removeFromCart(item.id)}
                      />
                    </div>
                  ))}

                  {/* Total */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Button */}
              <div className="mt-8">
                <button
                  className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${
                    cartItems.length > 0
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={cartItems.length === 0}
                >
                  Commander
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
