import cartData from "@/services/mockData/cart.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CartService {
  constructor() {
    this.loadCart()
  }

  loadCart() {
    const savedCart = localStorage.getItem("chronos-cart")
    if (savedCart) {
      this.cart = JSON.parse(savedCart)
    } else {
      this.cart = { ...cartData }
    }
  }

  saveCart() {
    localStorage.setItem("chronos-cart", JSON.stringify(this.cart))
  }

  async getCart() {
    await delay(100)
    this.loadCart()
    return { ...this.cart }
  }

  async addItem(product, quantity = 1, selectedBand = "") {
    await delay(200)
    this.loadCart()
    
    const itemKey = `${product.Id}-${selectedBand}`
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
        // Store product details for easy access
        ...product
      })
    }

    this.updateTotals()
    this.saveCart()
    return { ...this.cart }
  }

  async updateQuantity(productId, quantity, selectedBand = "") {
    await delay(150)
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
    await delay(150)
    this.loadCart()
    
    this.cart.items = this.cart.items.filter(
      item => !(item.productId === parseInt(productId) && item.selectedBand === selectedBand)
    )
    
    this.updateTotals()
    this.saveCart()
    return { ...this.cart }
  }

  async clearCart() {
    await delay(100)
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