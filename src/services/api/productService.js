import productsData from "@/services/mockData/products.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ProductService {
  constructor() {
    this.products = [...productsData]
  }

  async getAll() {
    await delay(300)
    return [...this.products]
  }

  async getById(id) {
    await delay(200)
    const product = this.products.find(p => p.Id === parseInt(id))
    return product ? { ...product } : null
  }

  async getByCategory(category) {
    await delay(300)
    return this.products
      .filter(p => p.category.toLowerCase() === category.toLowerCase())
      .map(p => ({ ...p }))
  }

  async search(query) {
    await delay(250)
    const searchTerm = query.toLowerCase()
    return this.products
      .filter(p => 
        p.brand.toLowerCase().includes(searchTerm) ||
        p.model.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      )
      .map(p => ({ ...p }))
  }

  async getFeatured() {
    await delay(200)
    return this.products
      .filter(p => p.featured)
      .slice(0, 8)
      .map(p => ({ ...p }))
  }

  async getRelated(productId, limit = 4) {
    await delay(200)
    const currentProduct = this.products.find(p => p.Id === parseInt(productId))
    if (!currentProduct) return []

    return this.products
      .filter(p => 
        p.Id !== parseInt(productId) && 
        (p.brand === currentProduct.brand || p.category === currentProduct.category)
      )
      .slice(0, limit)
      .map(p => ({ ...p }))
  }

  async filter(filters) {
    await delay(400)
    let filtered = [...this.products]

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand))
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(p => 
        filters.categories.some(cat => 
          p.category.toLowerCase().includes(cat.toLowerCase())
        )
      )
    }

    // Movement filter
    if (filters.movements && filters.movements.length > 0) {
      filtered = filtered.filter(p => 
        filters.movements.some(movement => 
          p.movement.toLowerCase().includes(movement.toLowerCase())
        )
      )
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [min, max] = filters.priceRange
      filtered = filtered.filter(p => p.price >= min && p.price <= max)
    }

    // Case size filter
    if (filters.caseSizes && filters.caseSizes.length > 0) {
      filtered = filtered.filter(p => {
        const size = p.caseSize
        return filters.caseSizes.some(range => {
          if (range === "<38mm") return size < 38
          if (range === "38-42mm") return size >= 38 && size <= 42
          if (range === "42-46mm") return size >= 42 && size <= 46
          if (range === ">46mm") return size > 46
          return false
        })
      })
    }

    // Sort by price, name, or relevance
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filtered.sort((a, b) => b.price - a.price)
          break
        case "name":
          filtered.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`))
          break
        default:
          // Keep original order
          break
      }
    }

    return filtered.map(p => ({ ...p }))
  }

  async getBrands() {
    await delay(100)
    const brands = [...new Set(this.products.map(p => p.brand))]
    return brands.sort()
  }

  async getCategories() {
    await delay(100)
    const categories = [...new Set(this.products.map(p => p.category))]
    return categories.sort()
  }
}

export default new ProductService()