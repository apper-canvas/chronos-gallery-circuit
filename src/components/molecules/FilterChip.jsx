import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const FilterChip = ({ 
  label, 
  onRemove,
  className 
}) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-gold rounded-full text-sm font-medium text-gold",
      className
    )}>
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-gold hover:text-white rounded-full p-0.5 transition-colors duration-150"
      >
        <ApperIcon name="X" size={12} />
      </button>
    </div>
  )
}

export default FilterChip