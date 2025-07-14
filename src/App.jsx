import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useState, createContext, useContext } from "react";

// Layout Components
import Header from "@/components/organisms/Header";
import BottomNav from "@/components/organisms/BottomNav";

// Pages
import HomePage from "@/components/pages/HomePage";
import CategoriesPage from "@/components/pages/CategoriesPage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import CartPage from "@/components/pages/CartPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import SearchPage from "@/components/pages/SearchPage";
import WishlistPage from "@/components/pages/WishlistPage";
import AccountPage from "@/components/pages/AccountPage";

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
    <AppContext.Provider value={contextValue}>
      <Router>
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
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/account" element={<AccountPage />} />
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
      </Router>
    </AppContext.Provider>
  );
}

export default App;