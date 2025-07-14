import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useApp } from "@/App";

const CartItem = ({ item }) => {
  const { language, updateCartQuantity, removeFromCart } = useApp();
  
  const handleQuantityChange = (newQuantity) => {
    updateCartQuantity(item.productId, item.selectedVariant, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.productId, item.selectedVariant);
  };

  const total = item.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 p-4 bg-surface rounded-lg border border-white/10"
    >
      {/* Product Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
        <img
          src={item.product?.images?.[0] || "/api/placeholder/80/80"}
          alt={language === "ur" ? item.product?.titleUrdu : item.product?.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm mb-1 text-white line-clamp-2">
          {language === "ur" ? item.product?.titleUrdu : item.product?.title}
        </h3>
        
        {item.selectedVariant && (
          <p className="text-xs text-gray-400 mb-2">
            {language === "ur" ? "قسم:" : "Variant:"} {item.selectedVariant}
          </p>
        )}

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <ApperIcon name="Minus" className="w-4 h-4" />
            </Button>
            
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-accent">
              Rs. {total.toLocaleString()}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-400">
                Rs. {item.price} {language === "ur" ? "ہر" : "each"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0 text-error hover:bg-error/20"
        onClick={handleRemove}
      >
        <ApperIcon name="Trash2" className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default CartItem;