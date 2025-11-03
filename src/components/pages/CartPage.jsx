import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import QuantitySelector from "@/components/molecules/QuantitySelector"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { useCart } from "@/hooks/useCart"

const CartPage = () => {
  const { cart, loading, error, updateQuantity, removeItem, clearCart } = useCart()
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error
            title="Failed to load cart"
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }
  
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Empty
            icon="ShoppingCart"
            title="Your cart is empty"
            message="Looks like you haven't added any watches to your cart yet. Discover our amazing collection and find your perfect timepiece."
            actionText="Start Shopping"
            actionLink="/products"
          />
        </div>
      </div>
    )
  }
  
  const handleQuantityChange = (productId, newQuantity, selectedBand) => {
    updateQuantity(productId, newQuantity, selectedBand)
  }
  
  const handleRemoveItem = (productId, selectedBand) => {
    removeItem(productId, selectedBand)
  }
  
  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">
              Shopping Cart
            </h1>
            <p className="text-gray-600 mt-1">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
            </p>
          </div>
          
          {cart.items.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-error hover:text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={18} className="mr-2" />
              Clear Cart
            </Button>
          )}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={`${item.Id || item.productId}-${item.selectedBand || "default"}`}
                item={item}
                onUpdateQuantity={handleQuantityChange}
                onRemove={handleRemoveItem}
                formatPrice={formatPrice}
              />
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-primary mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-success font-medium">Free</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(cart.tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-primary">Total</span>
                    <span className="font-bold text-xl text-primary">
                      {formatPrice(cart.total)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button size="lg" className="w-full">
                  <ApperIcon name="CreditCard" size={20} className="mr-2" />
                  Proceed to Checkout
                </Button>
                
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/products">
                    <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
              
              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="Shield" size={16} className="text-success" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const CartItem = ({ item, onUpdateQuantity, onRemove, formatPrice }) => {
  const productId = item.Id || item.productId
  const selectedBand = item.selectedBand || ""
  const itemTotal = item.price * item.quantity
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6">
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={item.images?.[0] || item.image}
              alt={`${item.brand} ${item.model}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <div>
              <Link
                to={`/product/${productId}`}
                className="font-display text-lg font-semibold text-primary hover:text-gold transition-colors"
              >
                {item.brand} {item.model}
              </Link>
              <p className="text-gray-600 text-sm">
                {formatPrice(item.price)}
                {selectedBand && (
                  <span className="ml-2">• {selectedBand}</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <QuantitySelector
                value={item.quantity}
                onChange={(quantity) => onUpdateQuantity(productId, quantity, selectedBand)}
                min={1}
                max={item.stockCount || 10}
              />
              
              <div className="flex items-center gap-4">
                <span className="font-semibold text-primary text-lg">
                  {formatPrice(itemTotal)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(productId, selectedBand)}
                  className="text-gray-400 hover:text-error"
                >
                  <ApperIcon name="Trash2" size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default CartPage