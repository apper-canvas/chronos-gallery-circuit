import { useState, useEffect } from "react"
import productService from "@/services/api/productService"

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    brands: [],
    categories: [],
    movements: [],
    caseSizes: [],
    priceRange: [0, 50000],
    sortBy: "relevance",
    ...initialFilters
  })

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      
      // If no filters are active, get all products
      const hasActiveFilters = 
        filters.brands.length > 0 || 
        filters.categories.length > 0 || 
        filters.movements.length > 0 || 
        filters.caseSizes.length > 0 || 
        filters.priceRange[1] < 50000

      let productsData
      if (hasActiveFilters) {
        productsData = await productService.filter(filters)
      } else {
        productsData = await productService.getAll()
      }
      
      setProducts(productsData)
    } catch (err) {
      setError("Failed to load products")
      console.error("Error loading products:", err)
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = async (query) => {
    try {
      setLoading(true)
      setError("")
      const searchResults = await productService.search(query)
      setProducts(searchResults)
    } catch (err) {
      setError("Failed to search products")
      console.error("Error searching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const getProductsByCategory = async (category) => {
    try {
      setLoading(true)
      setError("")
      const categoryProducts = await productService.getByCategory(category)
      setProducts(categoryProducts)
    } catch (err) {
      setError("Failed to load category products")
      console.error("Error loading category products:", err)
    } finally {
      setLoading(false)
    }
  }

  const getFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const featuredProducts = await productService.getFeatured()
      setProducts(featuredProducts)
    } catch (err) {
      setError("Failed to load featured products")
      console.error("Error loading featured products:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      movements: [],
      caseSizes: [],
      priceRange: [0, 50000],
      sortBy: "relevance"
    })
  }

  const retryLoad = () => {
    loadProducts()
  }

  useEffect(() => {
    loadProducts()
  }, [filters])

  return {
    products,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    searchProducts,
    getProductsByCategory,
    getFeaturedProducts,
    retryLoad
  }
}