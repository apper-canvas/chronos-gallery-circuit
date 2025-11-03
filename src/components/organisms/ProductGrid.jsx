import React from "react"
import { motion } from "framer-motion"
import ProductCard from "@/components/organisms/ProductCard"
import { cn } from "@/utils/cn"

const ProductGrid = ({ 
  products = [], 
  onAddToCart,
  onQuickView,
  className 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
    >
      {products.map((product) => (
        <motion.div key={product.Id} variants={itemVariants}>
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProductGrid