import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  asChild,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-gold hover:bg-gradient-gold-hover text-white shadow-luxury hover:shadow-luxury-hover hover:-translate-y-0.5",
    outline: "border border-gold text-gold hover:bg-gold hover:text-white",
    ghost: "text-gold hover:bg-gold/10",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  }
  
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-12 px-8 text-lg",
    icon: "h-11 w-11"
  }
  
  // Filter out React-specific props that shouldn't be passed to DOM
  const { 
    onAddToCart,
    onQuickView, 
    onUpdateQuantity,
    onRemove,
    onFilterChange,
    onClearFilters,
    ...domProps 
  } = props
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...domProps}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button