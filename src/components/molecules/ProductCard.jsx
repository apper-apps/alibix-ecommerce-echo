import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { useApp } from "@/App";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { language, addToCart, addToWishlist, isInWishlist } = useApp();
  
  const discountPercentage = product.discountedPrice 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    addToWishlist(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.Id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden group">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images?.[0] || "/api/placeholder/300/300"}
            alt={language === "ur" ? product.titleUrdu : product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge 
              variant="discount" 
              className="absolute top-2 right-2 font-bold shadow-lg"
            >
              -{discountPercentage}%
            </Badge>
          )}

          {/* Chinese Product Flag */}
          {product.isChineseProduct && (
            <div className="absolute top-2 left-2 text-lg">
              🇨🇳
            </div>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 left-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70"
            onClick={handleWishlistToggle}
          >
            <ApperIcon 
              name={isInWishlist(product.Id) ? "Heart" : "Heart"} 
              className={`w-4 h-4 ${isInWishlist(product.Id) ? "fill-red-500 text-red-500" : "text-white"}`} 
            />
          </Button>

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Badge variant="error" className="text-sm font-bold">
                {language === "ur" ? "ختم" : "SOLD OUT"}
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 text-white group-hover:text-secondary transition-colors">
            {language === "ur" ? product.titleUrdu : product.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-accent">
              Rs. {product.discountedPrice || product.price}
            </span>
            {product.discountedPrice && (
              <span className="text-sm text-gray-400 line-through">
                Rs. {product.price}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button 
            className="w-full" 
            size="sm"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
            {language === "ur" ? "کارٹ میں شامل کریں" : "Add to Cart"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;