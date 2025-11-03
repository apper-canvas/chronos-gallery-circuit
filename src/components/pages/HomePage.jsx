import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ProductGrid from "@/components/organisms/ProductGrid"
import QuickViewModal from "@/components/organisms/QuickViewModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { useProducts } from "@/hooks/useProducts"
import { useCart } from "@/hooks/useCart"

const HomePage = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const { products: featuredProducts, loading, error, getFeaturedProducts } = useProducts()
  const { addToCart } = useCart()

  useEffect(() => {
    getFeaturedProducts()
  }, [])

  const handleQuickView = (product) => {
    setQuickViewProduct(product)
    setIsQuickViewOpen(true)
  }

  const handleAddToCart = (product) => {
    addToCart(product, product.quantity || 1, product.selectedBand || "")
  }

  const categories = [
    {
      name: "Luxury Watches",
      description: "Premium timepieces from prestigious brands",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      path: "/products?category=luxury",
      icon: "Crown"
    },
    {
      name: "Sport Watches",
      description: "Durable timepieces for active lifestyles",
      image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=300&fit=crop",
      path: "/products?category=sport",
      icon: "Zap"
    },
    {
      name: "Dress Watches",
      description: "Elegant timepieces for formal occasions",
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=300&fit=crop",
      path: "/products?category=dress",
      icon: "Star"
    }
  ]

  const brands = [
    { name: "Rolex", logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=60&fit=crop" },
    { name: "Omega", logo: "https://images.unsplash.com/photo-1509048191080-d2e2678e3424?w=120&h=60&fit=crop" },
    { name: "TAG Heuer", logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=60&fit=crop" },
    { name: "Seiko", logo: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=120&h=60&fit=crop" },
    { name: "Citizen", logo: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=120&h=60&fit=crop" },
    { name: "Breitling", logo: "https://images.unsplash.com/photo-1627736421615-1d6b0d5b3e32?w=120&h=60&fit=crop" }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-gray-900 to-primary">
        <div className="absolute inset-0 bg-black/30" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=1080&fit=crop')"
          }}
        />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold mb-6"
          >
            Discover Timeless
            <span className="text-gradient block mt-2">Elegance</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            Curated collection of luxury and premium watches from world-renowned brands
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild>
              <Link to="/products">
                <ApperIcon name="Eye" size={20} className="mr-2" />
                Explore Collection
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link to="/products?featured=true">
                <ApperIcon name="Star" size={20} className="mr-2" />
                Featured Watches
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find the perfect timepiece for every occasion and lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={category.path}>
                  <Card hover className="overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ApperIcon name={category.icon} className="text-gold" size={24} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold text-primary mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">
                        {category.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
                Featured Collection
              </h2>
              <p className="text-gray-600 text-lg">
                Handpicked timepieces from our premium selection
              </p>
            </div>
            
            <Button variant="outline" asChild className="hidden sm:block">
              <Link to="/products">
                View All
                <ApperIcon name="ArrowRight" size={18} className="ml-2" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <Loading type="cards" />
          ) : error ? (
            <Error 
              title="Failed to load featured products"
              message={error}
              onRetry={() => getFeaturedProducts()}
            />
          ) : (
            <ProductGrid
              products={featuredProducts}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
            />
          )}
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
              Trusted Brands
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We feature timepieces from the most prestigious watchmakers in the world
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/products?brand=${encodeURIComponent(brand.name)}`}>
                  <Card hover className="p-6 text-center group">
                    <div className="w-20 h-10 mx-auto mb-3 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-200"
                      />
                    </div>
                    <h3 className="font-medium text-gray-700 group-hover:text-gold transition-colors duration-200">
                      {brand.name}
                    </h3>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-6">
              Find Your Perfect Timepiece
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're looking for a luxury statement piece or an everyday companion, 
              our curated collection has something for every wrist and occasion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/products">
                  <ApperIcon name="Search" size={20} className="mr-2" />
                  Browse All Watches
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link to="/products?category=luxury">
                  <ApperIcon name="Crown" size={20} className="mr-2" />
                  View Luxury Collection
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

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

export default HomePage