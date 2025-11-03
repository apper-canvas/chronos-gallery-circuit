import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const QuantitySelector = ({ 
  value = 1, 
  onChange,
  min = 1,
  max = 10,
  className 
}) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }
  
  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={value <= min}
      >
        <ApperIcon name="Minus" size={16} />
      </Button>
      
      <span className="font-medium text-lg min-w-[2rem] text-center">
        {value}
      </span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={value >= max}
      >
        <ApperIcon name="Plus" size={16} />
      </Button>
    </div>
  )
}

export default QuantitySelector