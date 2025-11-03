import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  className, 
  hover = false,
  children,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface border border-gray-100 shadow-sm",
        hover && "hover:shadow-luxury-hover hover:scale-[1.02] cursor-pointer transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card