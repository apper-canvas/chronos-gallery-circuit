import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  value, 
  onChange, 
  onSubmit,
  placeholder = "Search watches...",
  className 
}) => {
  const [isFocused, setIsFocused] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(value)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-base placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-50 transition-all duration-200",
            isFocused && "shadow-luxury"
          )}
        />
      </div>
    </form>
  )
}

export default SearchBar