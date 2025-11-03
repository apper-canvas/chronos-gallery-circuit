import { useState, useEffect } from "react"
import productService from "@/services/api/productService"

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadProduct = async () => {
    if (!productId) return

    try {
      setLoading(true)
      setError("")
      
      const [productData, relatedData] = await Promise.all([
        productService.getById(productId),
        productService.getRelated(productId, 4)
      ])
      
      if (!productData) {
        setError("Product not found")
        return
      }
      
      setProduct(productData)
      setRelatedProducts(relatedData)
    } catch (err) {
      setError("Failed to load product")
      console.error("Error loading product:", err)
    } finally {
      setLoading(false)
    }
  }

  const retryLoad = () => {
    loadProduct()
  }

  useEffect(() => {
    loadProduct()
  }, [productId])

  return {
    product,
    relatedProducts,
    loading,
    error,
    retryLoad
  }
}