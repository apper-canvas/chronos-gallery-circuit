import { toast } from "react-toastify"

class CartService {
  constructor() {
    // Initialize ApperClient
    this.getApperClient()
    this.tableName = 'cart_c'
    this.loadCart()
  }

  getApperClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  loadCart() {
    const savedCart = localStorage.getItem("chronos-cart")
    if (savedCart) {
      this.cart = JSON.parse(savedCart)
    } else {
      this.cart = {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0
      }
    }
  }

  saveCart() {
    localStorage.setItem("chronos-cart", JSON.stringify(this.cart))
    // Also save to database for totals
    this.saveCartToDatabase()
  }

  async saveCartToDatabase() {
    try {
      if (!this.apperClient) this.getApperClient()
      
      const params = {
        records: [{
          Name: `Cart-${Date.now()}`,
          subtotal_c: this.cart.subtotal,
          tax_c: this.cart.tax,
          total_c: this.cart.total
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Failed to save cart to database:", response.message)
      }
    } catch (error) {
      console.error("Error saving cart to database:", error?.response?.data?.message || error)
    }
  }

  async getCart() {
    this.loadCart()
    return { ...this.cart }
  }

  async addItem(product, quantity = 1, selectedBand = "") {
    this.loadCart()
    
    const existingItem = this.cart.items.find(
      item => item.productId === product.Id && item.selectedBand === selectedBand
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.cart.items.push({
        productId: product.Id,
        quantity: quantity,
        selectedBand: selectedBand || "",
        // Store product details for easy access with updated field names
        Id: product.Id,
        brand: product.brand,
        model: product.model,
        price: product.price,
        images: product.images,
        inStock: product.inStock,
        stockCount: product.stockCount
      })
    }

    this.updateTotals()
    this.saveCart()
    return { ...this.cart }
  }

  async updateQuantity(productId, quantity, selectedBand = "") {
    this.loadCart()
    
    const itemIndex = this.cart.items.findIndex(
      item => item.productId === parseInt(productId) && item.selectedBand === selectedBand
    )

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        this.cart.items.splice(itemIndex, 1)
      } else {
        this.cart.items[itemIndex].quantity = quantity
      }
      
      this.updateTotals()
      this.saveCart()
    }

    return { ...this.cart }
  }

  async removeItem(productId, selectedBand = "") {
    this.loadCart()
    
    this.cart.items = this.cart.items.filter(
      item => !(item.productId === parseInt(productId) && item.selectedBand === selectedBand)
    )
    
    this.updateTotals()
    this.saveCart()
    return { ...this.cart }
  }

  async clearCart() {
    this.cart = {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    }
    this.saveCart()
    return { ...this.cart }
  }

  updateTotals() {
    this.cart.subtotal = this.cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    )
    this.cart.tax = this.cart.subtotal * 0.08 // 8% tax
    this.cart.total = this.cart.subtotal + this.cart.tax
  }

  getItemCount() {
    this.loadCart()
    return this.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }
}

export default new CartService()