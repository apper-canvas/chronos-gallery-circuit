import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const Empty = ({ 
  className,
  icon = "Search",
  title = "No results found",
  message = "We couldn't find any watches matching your criteria. Try adjusting your filters or browse our full collection.",
  actionText = "Browse All Watches",
  actionLink = "/products",
  onAction,
  showAction = true 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
      
      <h3 className="font-display text-2xl font-semibold text-primary mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {showAction && (
        <div className="flex flex-col sm:flex-row gap-3">
          {onAction ? (
            <Button onClick={onAction}>
              {actionText}
            </Button>
          ) : (
            <Button asChild>
              <Link to={actionLink}>
                {actionText}
              </Link>
            </Button>
          )}
          
          <Button variant="outline" asChild>
            <Link to="/products">
              <ApperIcon name="Grid3X3" size={18} className="mr-2" />
              View All Categories
            </Link>
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default Empty