import React, { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import QuantitySelector from "@/components/molecules/QuantitySelector"
import ProductGrid from "@/components/organisms/ProductGrid"
import QuickViewModal from "@/components/organisms/QuickViewModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { useProduct } from "@/hooks/useProduct"
import { useCart } from "@/hooks/useCart"

const ProductDetailPage = () => {
  const { id } = useParams()
  const { product, relatedProducts, loading, error, retryLoad } = useProduct(id)
  const { addToCart } = useCart()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedBand, setSelectedBand] = useState("")
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  
  React.useEffect(() => {
    if (product) {
      setSelectedImage(0)
      setQuantity(1)
      setSelectedBand(product.bandOptions?.[0] || "")
    }
  }, [product])
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedBand)
    }
  }
  
  const handleRelatedAddToCart = (relatedProduct) => {
    addToCart(relatedProduct, 1, "")
  }
  
  const handleQuickView = (relatedProduct) => {
    setQuickViewProduct(relatedProduct)
    setIsQuickViewOpen(true)
  }
  
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading type="product" />
        </div>
      </div>
    )
  }
  
  if (error || !product) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error
            title="Product not found"
            message={error || "The watch you're looking for doesn't exist or has been removed."}
            onRetry={retryLoad}
          />
        </div>
      </div>
    )
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  const specifications = [
    { label: "Brand", value: product.brand },
    { label: "Model", value: product.model },
    { label: "Movement", value: product.movement },
    { label: "Case Size", value: `${product.caseSize}mm` },
    { label: "Case Material", value: product.caseMaterial },
    { label: "Band Material", value: product.bandMaterial },
    { label: "Water Resistance", value: product.waterResistance },
    { label: "Caliber", value: product.specifications?.caliber || "N/A" },
    { label: "Power Reserve", value: product.specifications?.powerReserve || "N/A" }
  ]
  
  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-gold">Home</Link></li>
            <li><ApperIcon name="ChevronRight" size={16} /></li>
            <li><Link to="/products" className="hover:text-gold">Watches</Link></li>
            <li><ApperIcon name="ChevronRight" size={16} /></li>
            <li><Link to={`/products?category=${product.category.toLowerCase()}`} className="hover:text-gold">{product.category}</Link></li>
            <li><ApperIcon name="ChevronRight" size={16} /></li>
            <li className="text-primary font-medium">{product.brand} {product.model}</li>
          </ol>
        </nav>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div 
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.images[selectedImage]}
                alt={`${product.brand} ${product.model}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-150 ${
                      selectedImage === index ? "border-gold" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-gold font-medium uppercase tracking-wide mb-2">
                {product.brand}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
                {product.model}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge variant="error">
                      SALE
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            {/* Stock Status */}
            <div>
              {product.inStock ? (
                <Badge variant="success" className="text-sm">
                  <ApperIcon name="Check" size={16} className="mr-1" />
                  In Stock ({product.stockCount} available)
                </Badge>
              ) : (
                <Badge variant="error" className="text-sm">
                  <ApperIcon name="X" size={16} className="mr-1" />
                  Out of Stock
                </Badge>
              )}
            </div>
            
            {/* Key Specifications */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{product.movement}</Badge>
              <Badge variant="outline">{product.caseSize}mm</Badge>
              <Badge variant="outline">{product.waterResistance}</Badge>
              <Badge variant="outline">{product.caseMaterial}</Badge>
            </div>
            
            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
            
            {/* Band Options */}
            {product.bandOptions && product.bandOptions.length > 1 && (
              <div>
                <h3 className="font-semibold text-primary mb-3">Band Options</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.bandOptions.map((band) => (
                    <label
                      key={band}
                      className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="band"
                        value={band}
                        checked={selectedBand === band}
                        onChange={(e) => setSelectedBand(e.target.value)}
                        className="text-gold focus:ring-gold focus:ring-opacity-50"
                      />
                      <span className="font-medium">{band}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity & Add to Cart */}
            {product.inStock && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    max={product.stockCount || 10}
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button variant="outline" size="lg">
                    <ApperIcon name="Heart" size={20} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Detailed Specifications */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold text-primary mb-8">
            Detailed Specifications
          </h2>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {specifications.map((spec, index) => (
                <div 
                  key={spec.label}
                  className={`p-4 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} md:bg-white`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{spec.label}</span>
                    <span className="text-primary font-semibold">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-primary">
                You Might Also Like
              </h2>
              <Button variant="outline" asChild>
                <Link to="/products">
                  View All
                  <ApperIcon name="ArrowRight" size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
            
            <ProductGrid
              products={relatedProducts}
              onAddToCart={handleRelatedAddToCart}
              onQuickView={handleQuickView}
            />
          </div>
        )}
      </div>
      
      {/* Quick View Modal for Related Products */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false)
          setQuickViewProduct(null)
        }}
        onAddToCart={handleRelatedAddToCart}
      />
    </div>
  )
}

export default ProductDetailPage