"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, User } from "lucide-react"

interface PhotoPreviewProps {
  photo: string
  firstName: string
  lastName: string
  className?: string
}

export function PhotoPreview({ photo, firstName, lastName, className = "" }: PhotoPreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  if (!photo.trim()) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Avatar className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500">
          <AvatarFallback className="text-white font-semibold">
            {firstName[0] || "?"}
            {lastName[0] || "?"}
          </AvatarFallback>
        </Avatar>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <Avatar className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500">
        {!imageError && (
          <AvatarImage
            src={photo || "/placeholder.svg"}
            alt={`${firstName} ${lastName}`}
            className="object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        <AvatarFallback className="text-white font-semibold">
          {imageError ? (
            <AlertCircle className="h-6 w-6" />
          ) : imageLoading ? (
            <User className="h-6 w-6 animate-pulse" />
          ) : (
            <>
              {firstName[0] || "?"}
              {lastName[0] || "?"}
            </>
          )}
        </AvatarFallback>
      </Avatar>
      {imageError && <p className="text-xs text-red-500 text-center">Failed to load image</p>}
      {imageLoading && photo && <p className="text-xs text-gray-500 text-center">Loading image...</p>}
    </div>
  )
}
