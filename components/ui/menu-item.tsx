"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";

interface MenuItemProps {
  title: string;
  price: number | null | undefined;
  image: string | null | undefined;
  onAddToCart: () => void;
}

export default function MenuItem({ title, price, image, onAddToCart }: MenuItemProps) {
  const [imgSrc, setImgSrc] = useState(image || "/placeholder.svg");
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="relative h-48">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => {
            setImageError(true);
            setImgSrc("/placeholder.svg");
          }}
          unoptimized={image?.startsWith('http') ? true : false} // Désactive l'optimisation pour les images externes
          priority={false}
        />
        {imageError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Image non disponible</span>
          </div>
        )}
      </div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-lg font-semibold">
            {typeof price === "number" ? `${price.toFixed(2)} €` : "Prix non disponible"}
          </p>
        </div>
        <button
          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-110 active:scale-95"
          onClick={onAddToCart}
          aria-label={`Ajouter ${title} au panier`}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}