import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import QuantitySelector from "@/components/molecules/QuantitySelector"

const QuickViewModal = ({ 
  product, 
  isOpen, 
  onClose,
  onAddToCart 
}) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedBand, setSelectedBand] = useState("")
  
  useEffect(() => {
    if (product) {
      setSelectedImage(0)
      setQuantity(1)
      setSelectedBand(product.bandOptions?.[0] || "")
    }
  }, [product])
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])
  
  if (!product) return null
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      quantity,
      selectedBand
    })
    onClose()
  }
  
  const specifications = [
    { label: "Movement", value: product.movement },
    { label: "Case Size", value: `${product.caseSize}mm` },
    { label: "Case Material", value: product.caseMaterial },
    { label: "Water Resistance", value: product.waterResistance },
    { label: "Band Material", value: product.bandMaterial }
  ]
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="font-display text-xl font-semibold text-primary">
                  Quick View
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <ApperIcon name="X" size={24} />
                </Button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-8 p-6">
                  {/* Images */}
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={product.images[selectedImage]}
                        alt={`${product.brand} ${product.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {product.images.length > 1 && (
                      <div className="flex gap-2">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-150 ${
                              selectedImage === index ? "border-gold" : "border-gray-200"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`View ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-gold uppercase tracking-wide mb-1">
                        {product.brand}
                      </p>
                      <h3 className="font-display text-2xl font-semibold text-primary mb-2">
                        {product.model}
                      </h3>
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    
                    {/* Stock Status */}
                    <div>
                      {product.inStock ? (
                        <Badge variant="success">In Stock</Badge>
                      ) : (
                        <Badge variant="error">Out of Stock</Badge>
                      )}
                    </div>
                    
                    {/* Description */}
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    
                    {/* Specifications */}
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Specifications</h4>
                      <div className="space-y-2">
                        {specifications.map((spec) => (
                          <div key={spec.label} className="flex justify-between py-1">
                            <span className="text-gray-600">{spec.label}</span>
                            <span className="font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Band Options */}
                    {product.bandOptions && product.bandOptions.length > 1 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-3">Band Options</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {product.bandOptions.map((band) => (
                            <label
                              key={band}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="band"
                                value={band}
                                checked={selectedBand === band}
                                onChange={(e) => setSelectedBand(e.target.value)}
                                className="text-gold focus:ring-gold focus:ring-opacity-50"
                              />
                              <span className="text-sm">{band}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Quantity & Add to Cart */}
                    {product.inStock && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                          </label>
                          <QuantitySelector
                            value={quantity}
                            onChange={setQuantity}
                            max={product.stockCount || 10}
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            className="flex-1"
                            onClick={handleAddToCart}
                          >
                            <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to={`/product/${product.Id}`} onClick={onClose}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default QuickViewModal