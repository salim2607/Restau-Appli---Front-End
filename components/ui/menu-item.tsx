"use client"

import Image from "next/image"
import { Plus } from "lucide-react"

interface MenuItemProps {
  title: string
  price: number
  image: string
  onAddToCart: () => void
}

export default function MenuItem({ title, price, image, onAddToCart }: MenuItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="relative h-48">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-lg font-semibold">${price.toFixed(2)}</p>
        </div>
        <button
          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-110 active:scale-95"
          onClick={onAddToCart}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}
