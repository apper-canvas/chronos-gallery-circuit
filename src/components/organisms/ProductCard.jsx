import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import { cn } from "@/utils/cn"

const ProductCard = ({ 
  product, 
  onAddToCart,
  onQuickView,
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
  
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart(product)
  }
  
  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView(product)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group", className)}
    >
      <Card hover className="overflow-hidden">
        <Link to={`/product/${product.Id}`}>
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <img
              src={product.images[0]}
              alt={`${product.brand} ${product.model}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-3 left-3">
                <Badge variant="gold" className="text-xs">
                  Featured
                </Badge>
              </div>
            )}
            
            {/* Stock Badge */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="error">
                  Out of Stock
                </Badge>
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleQuickView}
                  className="bg-white/90 backdrop-blur-sm border-white text-primary hover:bg-white"
                >
                  <ApperIcon name="Eye" size={18} />
                </Button>
                
                {product.inStock && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddToCart}
                    className="backdrop-blur-sm"
                  >
                    <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {/* Brand & Model */}
            <div>
              <p className="text-sm font-medium text-gold uppercase tracking-wide">
                {product.brand}
              </p>
              <h3 className="font-display text-lg font-semibold text-primary line-clamp-2">
                {product.model}
              </h3>
            </div>
            
            {/* Specifications */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {product.movement}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {product.caseSize}mm
              </Badge>
              <Badge variant="outline" className="text-xs">
                {product.waterResistance}
              </Badge>
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {product.inStock && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddToCart}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <ApperIcon name="Plus" size={20} />
                </Button>
              )}
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  )
}

export default ProductCard