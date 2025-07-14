import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";

const BottomNav = () => {
  const location = useLocation();
  const { language, cart } = useApp();
  
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      label: language === "ur" ? "ہوم" : "Home",
      icon: "Home",
      href: "/",
      isActive: location.pathname === "/"
    },
    {
      label: language === "ur" ? "کیٹگریز" : "Categories",
      icon: "Grid3X3",
      href: "/categories",
      isActive: location.pathname.startsWith("/categories") || location.pathname.startsWith("/category")
    },
    {
      label: language === "ur" ? "کارٹ" : "Cart",
      icon: "ShoppingCart",
      href: "/cart",
      isActive: location.pathname === "/cart",
      badge: cartItemsCount
    },
    {
      label: language === "ur" ? "پسندیدہ" : "Wishlist",
      icon: "Heart",
      href: "/wishlist",
      isActive: location.pathname === "/wishlist"
    },
    {
      label: language === "ur" ? "اکاؤنٹ" : "Account",
      icon: "User",
      href: "/account",
      isActive: location.pathname === "/account"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-white/10 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="relative flex flex-col items-center py-2 px-3 min-w-0 flex-1"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`relative p-2 rounded-full transition-colors duration-200 ${
                item.isActive 
                  ? "bg-secondary text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              
              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold min-w-[20px]">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </motion.div>
            
            <span className={`text-xs mt-1 truncate max-w-full transition-colors duration-200 ${
              item.isActive ? "text-secondary font-medium" : "text-gray-400"
            }`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;