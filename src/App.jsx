import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, useContext, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNav from "@/components/organisms/BottomNav";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import AdminDashboard from "@/components/pages/AdminDashboard";
import AdminProducts from "@/components/pages/AdminProducts";
import AdminOrders from "@/components/pages/AdminOrders";
import CheckoutPage from "@/components/pages/CheckoutPage";
import LoginPage from "@/components/pages/LoginPage";
import SearchPage from "@/components/pages/SearchPage";
import WishlistPage from "@/components/pages/WishlistPage";
import CategoriesPage from "@/components/pages/CategoriesPage";
import ProfilePage from "@/components/pages/ProfilePage";
import AccountPage from "@/components/pages/AccountPage";
import CartPage from "@/components/pages/CartPage";
import HomePage from "@/components/pages/HomePage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import { AuthProvider } from "@/contexts/AuthContext";

// Context Providers

// Layout Components

// Pages

// Context for global state
const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

function App() {
  const [language, setLanguage] = useState("en");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ur" : "en");
  };

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setCart(prev => {
      const existingItem = prev.find(item => 
        item.productId === product.Id && item.selectedVariant === selectedVariant
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.Id && item.selectedVariant === selectedVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, {
        productId: product.Id,
        quantity,
        selectedVariant,
        price: product.discountedPrice || product.price,
        product
      }];
    });
  };

  const removeFromCart = (productId, selectedVariant = null) => {
    setCart(prev => prev.filter(item => 
      !(item.productId === productId && item.selectedVariant === selectedVariant)
    ));
  };

  const updateCartQuantity = (productId, selectedVariant, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.productId === productId && item.selectedVariant === selectedVariant
        ? { ...item, quantity }
        : item
    ));
  };

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.some(item => item.Id === product.Id)) {
        return prev.filter(item => item.Id !== product.Id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.Id === productId);
  };

  const contextValue = {
    language,
    toggleLanguage,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    wishlist,
    addToWishlist,
    isInWishlist,
    user,
    setUser
};

return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppContext.Provider value={contextValue}>
          <BrowserRouter>
          <div className={`min-h-screen bg-background text-white font-body ${language === "ur" ? "rtl" : ""}`}>
            <Header />
<main className="pb-20 pt-16">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/category/:categoryName" element={<CategoriesPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/search/camera" element={<SearchPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
<Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/products" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminProducts />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/orders" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminOrders />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </main>

            <BottomNav />

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={language === "ur"}
              pauseOnFocusLoss
              draggable
pauseOnHover
              className="z-[9999]"
            />
          </div>
          </BrowserRouter>
        </AppContext.Provider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;