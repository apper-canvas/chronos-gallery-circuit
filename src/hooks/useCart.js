import { useState, useEffect } from "react"
import cartService from "@/services/api/cartService"
import { toast } from "react-toastify"

export const useCart = () => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadCart = async () => {
    try {
      setLoading(true)
      setError("")
      const cartData = await cartService.getCart()
      setCart(cartData)
    } catch (err) {
      setError("Failed to load cart")
      console.error("Error loading cart:", err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product, quantity = 1, selectedBand = "") => {
    try {
      setError("")
      const updatedCart = await cartService.addItem(product, quantity, selectedBand)
      setCart(updatedCart)
      toast.success(`Added ${product.brand} ${product.model} to cart`)
    } catch (err) {
      setError("Failed to add item to cart")
      toast.error("Failed to add item to cart")
      console.error("Error adding to cart:", err)
    }
  }

  const updateQuantity = async (productId, quantity, selectedBand = "") => {
    try {
      setError("")
      const updatedCart = await cartService.updateQuantity(productId, quantity, selectedBand)
      setCart(updatedCart)
    } catch (err) {
      setError("Failed to update quantity")
      toast.error("Failed to update quantity")
      console.error("Error updating quantity:", err)
    }
  }

  const removeItem = async (productId, selectedBand = "") => {
    try {
      setError("")
      const updatedCart = await cartService.removeItem(productId, selectedBand)
      setCart(updatedCart)
      toast.success("Item removed from cart")
    } catch (err) {
      setError("Failed to remove item")
      toast.error("Failed to remove item")
      console.error("Error removing item:", err)
    }
  }

  const clearCart = async () => {
    try {
      setError("")
      const updatedCart = await cartService.clearCart()
      setCart(updatedCart)
      toast.success("Cart cleared")
    } catch (err) {
      setError("Failed to clear cart")
      toast.error("Failed to clear cart")
      console.error("Error clearing cart:", err)
    }
  }

  const getItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  useEffect(() => {
    loadCart()
  }, [])

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    reloadCart: loadCart
  }
}