import React from "react"
import { cn } from "@/utils/cn"

const PriceRange = ({ 
  min, 
  max, 
  value, 
  onChange,
  className 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="px-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
        />
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{formatPrice(value[0])}</span>
        <span>{formatPrice(value[1])}</span>
      </div>
    </div>
  )
}

export default PriceRange