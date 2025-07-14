import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { useApp } from "@/App";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, cart, user } = useApp();
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const menuItems = [
    { label: language === "ur" ? "ہوم" : "Home", href: "/", icon: "Home" },
    { label: language === "ur" ? "کیٹگریز" : "Categories", href: "/categories", icon: "Grid3X3" },
    { label: language === "ur" ? "پسندیدہ" : "Wishlist", href: "/wishlist", icon: "Heart" },
    { label: language === "ur" ? "اکاؤنٹ" : "Account", href: "/account", icon: "User" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-display font-bold">
              <span className="text-primary">Ali</span>
              <span className="text-secondary">Bix</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

{/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-xs"
            >
              {language === "ur" ? "EN" : "اردو"}
            </Button>

            {/* Camera Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/search")}
              className="hover:text-accent transition-colors"
              title={language === "ur" ? "کیمرہ سے تلاش کریں" : "Search with camera"}
            >
              <ApperIcon name="Camera" className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ApperIcon name="ShoppingCart" className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Button>

            {/* Account */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/account")}
            >
              <ApperIcon name="User" className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="container mx-auto px-4 py-6"
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center p-4 bg-surface rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <ApperIcon name={item.icon} className="w-6 h-6 mb-2 text-accent" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="text-sm"
                >
                  {language === "ur" ? "English" : "اردو"}
                </Button>
<div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/search");
                      setIsMenuOpen(false);
                    }}
                    className="text-accent"
                    title={language === "ur" ? "کیمرہ سے تلاش کریں" : "Camera search"}
                  >
                    <ApperIcon name="Camera" className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigate("/cart");
                      setIsMenuOpen(false);
                    }}
                    className="relative"
                  >
                    <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
                    {language === "ur" ? "کارٹ" : "Cart"}
                    {cartItemsCount > 0 && (
                      <span className="ml-2 bg-accent text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;