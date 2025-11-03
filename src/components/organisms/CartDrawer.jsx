import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import QuantitySelector from "@/components/molecules/QuantitySelector"
import { cn } from "@/utils/cn"

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity,
  onRemoveItem 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax
  
  // Prevent body scroll when drawer is open
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
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-display text-xl font-semibold text-primary">
                Shopping Cart ({cartItems.length})
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ApperIcon name="X" size={24} />
              </Button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <ApperIcon name="ShoppingCart" size={64} className="text-gray-300 mb-4" />
                  <h3 className="font-display text-lg font-semibold text-primary mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Discover our amazing watch collection
                  </p>
                  <Button asChild onClick={onClose}>
                    <Link to="/products">
                      Start Shopping
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {cartItems.map((item) => (
                    <CartItem
                      key={`${item.Id}-${item.selectedBand || "default"}`}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemoveItem}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-gold">{formatPrice(total)}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <ApperIcon name="CreditCard" size={20} className="mr-2" />
                    Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    asChild
                    onClick={onClose}
                  >
                    <Link to="/cart">
                      View Full Cart
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  const itemTotal = item.price * item.quantity
  
  return (
    <div className="flex gap-4">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.images[0]}
          alt={`${item.brand} ${item.model}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 space-y-2">
        <div>
          <h4 className="font-medium text-primary line-clamp-1">
            {item.brand} {item.model}
          </h4>
          <p className="text-sm text-gray-600">
            {formatPrice(item.price)}
            {item.selectedBand && (
              <span className="ml-2">• {item.selectedBand}</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <QuantitySelector
            value={item.quantity}
            onChange={(quantity) => onUpdateQuantity(item.Id, quantity, item.selectedBand)}
            min={1}
            max={item.stockCount || 10}
          />
          
          <div className="flex items-center gap-3">
            <span className="font-semibold text-primary">
              {formatPrice(itemTotal)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.Id, item.selectedBand)}
              className="text-gray-400 hover:text-error"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer