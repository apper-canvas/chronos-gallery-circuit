import React, { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Header from "@/components/organisms/Header"
import CartDrawer from "@/components/organisms/CartDrawer"
import HomePage from "@/components/pages/HomePage"
import ProductsPage from "@/components/pages/ProductsPage"
import ProductDetailPage from "@/components/pages/ProductDetailPage"
import CartPage from "@/components/pages/CartPage"
import { useCart } from "@/hooks/useCart"

function App() {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const { cart, updateQuantity, removeItem } = useCart()
  
  const getCartItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }
  
  useEffect(() => {
    // Close cart drawer when clicking cart link in header
    const handleCartClick = (e) => {
      if (e.target.closest('a[href="/cart"]')) {
        setIsCartDrawerOpen(false)
      }
    }
    
    document.addEventListener('click', handleCartClick)
    return () => document.removeEventListener('click', handleCartClick)
  }, [])
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header 
          cartItemCount={getCartItemCount()} 
          onCartClick={() => setIsCartDrawerOpen(true)}
        />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        
        <CartDrawer
          isOpen={isCartDrawerOpen}
          onClose={() => setIsCartDrawerOpen(false)}
          cartItems={cart.items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App