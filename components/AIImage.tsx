"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface AIImageProps {
  prompt: string
  alt: string
  width: number
  height: number
  className?: string
}

export function AIImage({ prompt, alt, width, height, className }: AIImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateImage = async () => {
      try {
        // Generate a random color
        const randomColor = Math.floor(Math.random() * 16777215).toString(16)

        // Generate a contrasting text color (black or white)
        const contrastColor = Number.parseInt(randomColor, 16) > 0xffffff / 2 ? "000" : "fff"

        // Create a colorful placeholder image URL
        //const placeholderUrl = `https://via.placeholder.com/${width}x${height}/${randomColor}/${contrastColor}?text=${encodeURIComponent(prompt)}`
          const placeholderUrl = `https://i.pinimg.com/736x/06/38/67/063867cf8d1d37714dc6513e26198941.jpg`
        setImageSrc(placeholderUrl)
        setIsLoading(false)
      } catch (err) {
        console.error("Error generating image:", err)
        setError("Failed to load image")
        setIsLoading(false)
      }
    }

    generateImage()
  }, [prompt, width, height])

  if (isLoading) {
    return <div className="animate-pulse bg-gray-300" style={{ width, height }}></div>
  }

  if (error) {
    return <div className="bg-red-100 text-red-500 p-4">{error}</div>
  }

  return (
    <Image
      src={imageSrc || `/placeholder.svg?height=${height}&width=${width}`}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}

