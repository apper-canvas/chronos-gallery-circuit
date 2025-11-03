import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import PriceRange from "@/components/molecules/PriceRange"
import { cn } from "@/utils/cn"

const FilterSidebar = ({ 
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  className 
}) => {
  const brands = ["Rolex", "Omega", "TAG Heuer", "Seiko", "Citizen", "Casio", "Tudor", "Breitling"]
  const movements = ["Automatic", "Quartz", "Chronograph", "Manual"]
  const categories = ["Luxury", "Sport", "Dress", "Casual", "Diving"]
  const caseSizes = ["<38mm", "38-42mm", "42-46mm", ">46mm"]
  
  const handleBrandToggle = (brand) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter(b => b !== brand)
      : [...activeFilters.brands, brand]
    onFilterChange({ ...activeFilters, brands: newBrands })
  }
  
  const handleMovementToggle = (movement) => {
    const newMovements = activeFilters.movements.includes(movement)
      ? activeFilters.movements.filter(m => m !== movement)
      : [...activeFilters.movements, movement]
    onFilterChange({ ...activeFilters, movements: newMovements })
  }
  
  const handleCategoryToggle = (category) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter(c => c !== category)
      : [...activeFilters.categories, category]
    onFilterChange({ ...activeFilters, categories: newCategories })
  }
  
  const handleCaseSizeToggle = (size) => {
    const newSizes = activeFilters.caseSizes.includes(size)
      ? activeFilters.caseSizes.filter(s => s !== size)
      : [...activeFilters.caseSizes, size]
    onFilterChange({ ...activeFilters, caseSizes: newSizes })
  }
  
  const filterSections = [
    {
      title: "Price Range",
      content: (
        <PriceRange
          min={0}
          max={50000}
          value={activeFilters.priceRange}
          onChange={(range) => onFilterChange({ ...activeFilters, priceRange: range })}
        />
      )
    },
    {
      title: "Brands",
      content: (
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={activeFilters.brands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="rounded border-gray-300 text-gold focus:ring-gold focus:ring-opacity-50"
              />
              <span className="text-sm text-gray-700 group-hover:text-gold transition-colors duration-150">
                {brand}
              </span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Movement Type",
      content: (
        <div className="space-y-2">
          {movements.map((movement) => (
            <label
              key={movement}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={activeFilters.movements.includes(movement)}
                onChange={() => handleMovementToggle(movement)}
                className="rounded border-gray-300 text-gold focus:ring-gold focus:ring-opacity-50"
              />
              <span className="text-sm text-gray-700 group-hover:text-gold transition-colors duration-150">
                {movement}
              </span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Category",
      content: (
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={activeFilters.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="rounded border-gray-300 text-gold focus:ring-gold focus:ring-opacity-50"
              />
              <span className="text-sm text-gray-700 group-hover:text-gold transition-colors duration-150">
                {category}
              </span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Case Size",
      content: (
        <div className="space-y-2">
          {caseSizes.map((size) => (
            <label
              key={size}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={activeFilters.caseSizes.includes(size)}
                onChange={() => handleCaseSizeToggle(size)}
                className="rounded border-gray-300 text-gold focus:ring-gold focus:ring-opacity-50"
              />
              <span className="text-sm text-gray-700 group-hover:text-gold transition-colors duration-150">
                {size}
              </span>
            </label>
          ))}
        </div>
      )
    }
  ]
  
  const hasActiveFilters = 
    activeFilters.brands.length > 0 || 
    activeFilters.movements.length > 0 || 
    activeFilters.categories.length > 0 || 
    activeFilters.caseSizes.length > 0 || 
    activeFilters.priceRange[1] < 50000
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-primary">
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-gold hover:text-gold-light"
          >
            Clear All
          </Button>
        )}
      </div>
      
      {/* Filter Sections */}
      <div className="space-y-6">
        {filterSections.map((section, index) => (
          <FilterSection
            key={section.title}
            title={section.title}
            initialOpen={index === 0}
          >
            {section.content}
          </FilterSection>
        ))}
      </div>
    </div>
  )
}

const FilterSection = ({ title, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(initialOpen)
  
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h4 className="font-medium text-primary">{title}</h4>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-gray-400"
        />
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="pt-3">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export default FilterSidebar