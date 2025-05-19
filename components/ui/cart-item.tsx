"use client"

import { Trash2 } from "lucide-react"
import { useState } from "react"

interface CartItemProps {
  title: string
  quantity: number
  price: number
  onRemove: () => void
}

export default function CartItem({ title, quantity, price, onRemove }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove()
    }, 300)
  }

  return (
    <div
      className={`bg-red-50 rounded-lg p-4 flex justify-between items-center transition-all duration-300 ${
        isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <p className="font-medium">{title}</p>
        <span className="text-gray-500">×{quantity}</span>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-medium">${price.toFixed(2)}</p>
        <button className="text-red-500 hover:text-red-700 transition-colors duration-300" onClick={handleRemove}>
          <Trash2 size={18} className="hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
    </div>
  )
}
