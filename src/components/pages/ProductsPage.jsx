import React, { useState, useEffect } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FilterSidebar from "@/components/organisms/FilterSidebar"
import ProductGrid from "@/components/organisms/ProductGrid"
import QuickViewModal from "@/components/organisms/QuickViewModal"
import FilterChip from "@/components/molecules/FilterChip"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { useProducts } from "@/hooks/useProducts"
import { useCart } from "@/hooks/useCart"

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  
  // Initialize filters from URL parameters
  const getInitialFilters = () => {
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    
    return {
      brands: brand ? [brand] : [],
      categories: category ? [category] : [],
      movements: [],
      caseSizes: [],
      priceRange: [0, 50000],
      sortBy: "relevance",
      searchQuery: search || "",
      featuredOnly: featured === "true"
    }
  }
  
  const { 
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
  } = useProducts(getInitialFilters())
  
  const { addToCart } = useCart()
  
  useEffect(() => {
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    
    if (search) {
      searchProducts(search)
    } else if (category) {
      getProductsByCategory(category)
    } else if (featured === "true") {
      getFeaturedProducts()
    }
  }, [location.search])
  
  const handleQuickView = (product) => {
    setQuickViewProduct(product)
    setIsQuickViewOpen(true)
  }
  
  const handleAddToCart = (product) => {
    addToCart(product, product.quantity || 1, product.selectedBand || "")
  }
  
  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters)
    
    // Update URL parameters
    const params = new URLSearchParams()
    if (newFilters.categories.length > 0) {
      params.set("category", newFilters.categories[0])
    }
    if (newFilters.brands.length > 0) {
      params.set("brand", newFilters.brands[0])
    }
    setSearchParams(params)
  }
  
  const handleClearFilters = () => {
    clearFilters()
    setSearchParams({})
  }
  
  const getActiveFilterChips = () => {
    const chips = []
    
    filters.brands.forEach(brand => {
      chips.push({
        key: `brand-${brand}`,
        label: brand,
        onRemove: () => {
          const newBrands = filters.brands.filter(b => b !== brand)
          handleFilterChange({ ...filters, brands: newBrands })
        }
      })
    })
    
    filters.categories.forEach(category => {
      chips.push({
        key: `category-${category}`,
        label: category,
        onRemove: () => {
          const newCategories = filters.categories.filter(c => c !== category)
          handleFilterChange({ ...filters, categories: newCategories })
        }
      })
    })
    
    filters.movements.forEach(movement => {
      chips.push({
        key: `movement-${movement}`,
        label: movement,
        onRemove: () => {
          const newMovements = filters.movements.filter(m => m !== movement)
          handleFilterChange({ ...filters, movements: newMovements })
        }
      })
    })
    
    if (filters.priceRange[1] < 50000) {
      chips.push({
        key: "price-range",
        label: `Under $${filters.priceRange[1].toLocaleString()}`,
        onRemove: () => {
          handleFilterChange({ ...filters, priceRange: [0, 50000] })
        }
      })
    }
    
    return chips
  }
  
  const activeChips = getActiveFilterChips()
  const hasActiveFilters = activeChips.length > 0
  
  const getPageTitle = () => {
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const brand = searchParams.get("brand")
    const featured = searchParams.get("featured")
    
    if (search) return `Search results for "${search}"`
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)} Watches`
    if (brand) return `${brand} Watches`
    if (featured) return "Featured Watches"
    return "All Watches"
  }
  
  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600">
            {loading ? "Loading..." : `${products.length} ${products.length === 1 ? "watch" : "watches"} found`}
          </p>
        </div>
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="w-full"
          >
            <ApperIcon name="Filter" size={18} className="mr-2" />
            Filters {hasActiveFilters && `(${activeChips.length})`}
          </Button>
        </div>
        
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-24">
              <FilterSidebar
                filters={filters}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearFilters}
              />
            </div>
          </aside>
          
          {/* Mobile Filters Overlay */}
          {isMobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)}>
              <div className="fixed left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-semibold">Filters</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileFiltersOpen(false)}
                    >
                      <ApperIcon name="X" size={20} />
                    </Button>
                  </div>
                  <FilterSidebar
                    filters={filters}
                    activeFilters={filters}
                    onFilterChange={handleFilterChange}
                    onClearAll={handleClearFilters}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <main className="flex-1">
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                  {activeChips.map(chip => (
                    <FilterChip
                      key={chip.key}
                      label={chip.label}
                      onRemove={chip.onRemove}
                    />
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-gold hover:text-gold-light ml-2"
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}
            
            {/* Products Grid */}
            {loading ? (
              <Loading type="products" />
            ) : error ? (
              <Error
                title="Failed to load products"
                message={error}
                onRetry={retryLoad}
              />
            ) : products.length === 0 ? (
              <Empty
                icon="Search"
                title="No watches found"
                message="We couldn't find any watches matching your criteria. Try adjusting your filters or browse our full collection."
                actionText="Clear Filters"
                onAction={hasActiveFilters ? handleClearFilters : undefined}
                showAction={hasActiveFilters}
              />
            ) : (
              <ProductGrid
                products={products}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
              />
            )}
          </main>
        </div>
      </div>
      
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false)
          setQuickViewProduct(null)
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

export default ProductsPage