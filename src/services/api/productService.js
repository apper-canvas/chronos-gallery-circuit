import { toast } from "react-toastify"

class ProductService {
  constructor() {
    // Initialize ApperClient
    this.getApperClient()
    this.tableName = 'product_c'
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

  // Transform database record to frontend format
  transformProduct(record) {
    if (!record) return null
    
    // Parse images and band options from multiline text
    let images = []
    let bandOptions = []
    
    try {
      if (record.images_c) {
        images = record.images_c.split('\n').filter(img => img.trim())
      }
      if (record.band_options_c) {
        bandOptions = record.band_options_c.split('\n').filter(opt => opt.trim())
      }
    } catch (e) {
      console.warn('Error parsing product images or band options:', e)
    }

    return {
      Id: record.Id,
      Name: record.Name || '',
      brand: record.brand_c || '',
      model: record.model_c || '',
      price: parseFloat(record.price_c) || 0,
      originalPrice: parseFloat(record.original_price_c) || null,
      category: record.category_c || '',
      description: record.description_c || '',
      movement: record.movement_c || '',
      caseSize: parseInt(record.case_size_c) || 0,
      caseMaterial: record.case_material_c || '',
      bandMaterial: record.band_material_c || '',
      waterResistance: record.water_resistance_c || '',
      inStock: record.in_stock_c || false,
      stockCount: parseInt(record.stock_count_c) || 0,
      featured: record.featured_c || false,
      images: images.length > 0 ? images : ['https://via.placeholder.com/400x400?text=No+Image'],
      bandOptions: bandOptions.length > 0 ? bandOptions : [],
      Tags: record.Tags || ''
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.getApperClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "movement_c"}},
          {"field": {"Name": "case_size_c"}},
          {"field": {"Name": "case_material_c"}},
          {"field": {"Name": "band_material_c"}},
          {"field": {"Name": "water_resistance_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "band_options_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data?.map(this.transformProduct.bind(this)) || []
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error)
      toast.error("Failed to load products")
      return []
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.getApperClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "movement_c"}},
          {"field": {"Name": "case_size_c"}},
          {"field": {"Name": "case_material_c"}},
          {"field": {"Name": "band_material_c"}},
          {"field": {"Name": "water_resistance_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "band_options_c"}},
          {"field": {"Name": "Tags"}}
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return this.transformProduct(response.data)
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async getByCategory(category) {
    try {
      if (!this.apperClient) this.getApperClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "movement_c"}},
          {"field": {"Name": "case_size_c"}},
          {"field": {"Name": "case_material_c"}},
          {"field": {"Name": "band_material_c"}},
          {"field": {"Name": "water_resistance_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "band_options_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "Contains", "Values": [category]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data?.map(this.transformProduct.bind(this)) || []
    } catch (error) {
      console.error("Error fetching category products:", error?.response?.data?.message || error)
      return []
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.getApperClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "movement_c"}},
          {"field": {"Name": "case_size_c"}},
          {"field": {"Name": "case_material_c"}},
          {"field": {"Name": "band_material_c"}},
          {"field": {"Name": "water_resistance_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "band_options_c"}},
          {"field": {"Name": "Tags"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "brand_c", "operator": "Contains", "values": [query]},
                {"fieldName": "model_c", "operator": "Contains", "values": [query]},
                {"fieldName": "description_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data?.map(this.transformProduct.bind(this)) || []
    } catch (error) {
      console.error("Error searching products:", error?.response?.data?.message || error)
      return []
    }
  }

  async getFeatured() {
    try {
      if (!this.apperClient) this.getApperClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "movement_c"}},
          {"field": {"Name": "case_size_c"}},
          {"field": {"Name": "case_material_c"}},
          {"field": {"Name": "band_material_c"}},
          {"field": {"Name": "water_resistance_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "band_options_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "featured_c", "Operator": "EqualTo", "Values": [true]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 8, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data?.map(this.transformProduct.bind(this)) || []
    } catch (error) {
      console.error("Error fetching featured products:", error?.response?.data?.message || error)
      return []
    }
  }

  async getRelated(productId, limit = 4) {
    try {
      if (!this.apperClient) this.getApperClient()
      
      // First get the current product to find similar ones
      const currentProduct = await this.getById(productId)
      if (!currentProduct) return []
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "movement_c"}},
          {"field": {"Name": "case_size_c"}},
          {"field": {"Name": "case_material_c"}},
          {"field": {"Name": "band_material_c"}},
          {"field": {"Name": "water_resistance_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "band_options_c"}},
          {"field": {"Name": "Tags"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "brand_c", "operator": "EqualTo", "values": [currentProduct.brand]},
                {"fieldName": "category_c", "operator": "EqualTo", "values": [currentProduct.category]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit + 2, "offset": 0} // Get extra in case current product is in results
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data
        ?.map(this.transformProduct.bind(this))
        .filter(p => p.Id !== parseInt(productId))
        .slice(0, limit) || []
    } catch (error) {
      console.error("Error fetching related products:", error?.response?.data?.message || error)
      return []
    }
  }

  async filter(filters) {
    try {
      if (!this.apperClient) this.getApperClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "movement_c"}},
          {"field": {"Name": "case_size_c"}},
          {"field": {"Name": "case_material_c"}},
          {"field": {"Name": "band_material_c"}},
          {"field": {"Name": "water_resistance_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "band_options_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [],
        orderBy: [],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      // Add brand filter
      if (filters.brands && filters.brands.length > 0) {
        params.where.push({"FieldName": "brand_c", "Operator": "ExactMatch", "Values": filters.brands})
      }
      
      // Add category filter
      if (filters.categories && filters.categories.length > 0) {
        params.where.push({"FieldName": "category_c", "Operator": "ExactMatch", "Values": filters.categories})
      }
      
      // Add movement filter
      if (filters.movements && filters.movements.length > 0) {
        params.where.push({"FieldName": "movement_c", "Operator": "ExactMatch", "Values": filters.movements})
      }
      
      // Add price range filter
      if (filters.priceRange && filters.priceRange.length === 2) {
        const [min, max] = filters.priceRange
        if (max < 50000) { // Only apply if not default max
          params.where.push({"FieldName": "price_c", "Operator": "GreaterThanOrEqualTo", "Values": [min]})
          params.where.push({"FieldName": "price_c", "Operator": "LessThanOrEqualTo", "Values": [max]})
        }
      }
      
      // Add sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            params.orderBy = [{"fieldName": "price_c", "sorttype": "ASC"}]
            break
          case "price-high":
            params.orderBy = [{"fieldName": "price_c", "sorttype": "DESC"}]
            break
          case "name":
            params.orderBy = [{"fieldName": "brand_c", "sorttype": "ASC"}]
            break
          default:
            params.orderBy = [{"fieldName": "Id", "sorttype": "DESC"}]
            break
        }
      } else {
        params.orderBy = [{"fieldName": "Id", "sorttype": "DESC"}]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      let results = response.data?.map(this.transformProduct.bind(this)) || []
      
      // Apply case size filter (client-side due to complex logic)
      if (filters.caseSizes && filters.caseSizes.length > 0) {
        results = results.filter(p => {
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
      
      return results
    } catch (error) {
      console.error("Error filtering products:", error?.response?.data?.message || error)
      return []
    }
  }

  async getBrands() {
    try {
      if (!this.apperClient) this.getApperClient()
      
      const params = {
        fields: [{"field": {"Name": "brand_c"}}],
        pagingInfo: {"limit": 200, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      const brands = [...new Set(response.data?.map(p => p.brand_c).filter(Boolean))]
      return brands.sort()
    } catch (error) {
      console.error("Error fetching brands:", error?.response?.data?.message || error)
      return []
    }
  }

  async getCategories() {
    try {
      if (!this.apperClient) this.getApperClient()
      
      const params = {
        fields: [{"field": {"Name": "category_c"}}],
        pagingInfo: {"limit": 200, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      const categories = [...new Set(response.data?.map(p => p.category_c).filter(Boolean))]
      return categories.sort()
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error)
      return []
    }
  }
}

export default new ProductService()