import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ 
  className, 
  variant = "default", 
  children,
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    gold: "bg-gold text-white",
    outline: "border border-gray-200 text-gray-700",
    success: "bg-success text-white",
    error: "bg-error text-white"
  }
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge