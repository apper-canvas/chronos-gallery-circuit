import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const Header = ({ cartItemCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  const categories = [
    { name: "Shop All", path: "/products" },
    { name: "Luxury", path: "/products?category=luxury" },
    { name: "Sport", path: "/products?category=sport" },
    { name: "Dress", path: "/products?category=dress" },
    { name: "Brands", path: "/brands" },
    { name: "New Arrivals", path: "/products?new=true" }
  ]
  
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
      setIsMobileMenuOpen(false)
    }
  }
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-header border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ApperIcon name="Watch" className="h-8 w-8 text-gold" />
            <span className="font-display text-xl font-semibold text-primary">
              Chronos Gallery
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="text-gray-700 hover:text-gold font-medium transition-colors duration-150 relative group"
              >
                {category.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          
          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              className="w-80"
            />
          </div>
          
          {/* Cart & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-gold transition-colors duration-150"
            >
              <ApperIcon name="ShoppingCart" size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gold text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse-soft">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden overflow-hidden transition-all duration-300 ease-out bg-white border-t border-gray-200",
        isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 py-6 space-y-6">
          {/* Mobile Search */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
          />
          
          {/* Mobile Navigation */}
          <nav className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-gold font-medium transition-colors duration-150 py-2"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header