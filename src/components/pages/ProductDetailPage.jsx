import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";
import productService from "@/services/api/productService";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { language, addToCart, addToWishlist, isInWishlist } = useApp();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const productData = await productService.getById(id);
      setProduct(productData);
      
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }

      // Load related products
      const related = await productService.getRelated(id, productData.category);
      setRelatedProducts(related);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error(language === "ur" ? "یہ پروڈکٹ ختم ہو گیا ہے" : "This product is out of stock");
      return;
    }

    addToCart(product, quantity, selectedVariant);
    toast.success(language === "ur" ? "کارٹ میں شامل کر دیا گیا" : "Added to cart successfully");
  };

  const handleWishlistToggle = () => {
    addToWishlist(product);
    const message = isInWishlist(product.Id)
      ? (language === "ur" ? "پسندیدہ سے ہٹا دیا گیا" : "Removed from wishlist")
      : (language === "ur" ? "پسندیدہ میں شامل کر دیا گیا" : "Added to wishlist");
    toast.success(message);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Error 
          message={language === "ur" ? "پروڈکٹ نہیں ملا" : "Product not found"} 
          icon="Package"
        />
      </div>
    );
  }

  const discountPercentage = product.discountedPrice 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Back Button */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          {language === "ur" ? "واپس" : "Back"}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-surface">
              <img
                src={product.images?.[selectedImage] || "/api/placeholder/600/600"}
                alt={language === "ur" ? product.titleUrdu : product.title}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <Badge variant="discount" className="text-lg font-bold">
                    -{discountPercentage}%
                  </Badge>
                )}
                {product.isChineseProduct && (
                  <div className="text-2xl">🇨🇳</div>
                )}
              </div>

              {/* Stock Status */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Badge variant="error" className="text-lg font-bold px-4 py-2">
                    {language === "ur" ? "ختم" : "SOLD OUT"}
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? "border-secondary" 
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Title and Category */}
          <div>
            <p className="text-secondary text-sm font-medium mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-display font-bold text-white mb-4">
              {language === "ur" ? product.titleUrdu : product.title}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-accent">
              Rs. {(product.discountedPrice || product.price).toLocaleString()}
            </span>
            {product.discountedPrice && (
              <span className="text-xl text-gray-400 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed">
            {language === "ur" ? product.descriptionUrdu : product.description}
          </p>

          {/* Delivery Info */}
          <div className="flex items-center gap-2 p-4 bg-surface rounded-lg border border-white/10">
            <ApperIcon name="Truck" className="w-5 h-5 text-info" />
            <span className="text-sm text-gray-300">
              {language === "ur" 
                ? `${product.deliveryDays} دن میں ڈیلیوری${product.isChineseProduct ? " (چینی پروڈکٹ)" : ""}`
                : `Delivery in ${product.deliveryDays} days${product.isChineseProduct ? " (Chinese Product)" : ""}`
              }
            </span>
          </div>

          {/* Payment Methods */}
          <div className="p-4 bg-surface rounded-lg border border-white/10">
            <h3 className="font-medium text-white mb-2">
              {language === "ur" ? "ادائیگی کے طریقے" : "Payment Methods"}
            </h3>
            <div className="flex gap-2 text-xs">
              {!product.isChineseProduct && (
                <Badge variant="success">
                  {language === "ur" ? "آف لائن" : "COD"}
                </Badge>
              )}
              <Badge variant="info">
                {language === "ur" ? "ایزی پیسہ" : "Easypaisa"}
              </Badge>
              <Badge variant="info">
                {language === "ur" ? "جاز کیش" : "JazzCash"}
              </Badge>
              <Badge variant="default">
                {language === "ur" ? "بینک" : "Bank"}
              </Badge>
            </div>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="font-medium text-white mb-3">
                {language === "ur" ? "اختیارات" : "Options"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedVariant === variant
                        ? "border-secondary bg-secondary text-white"
                        : "border-white/20 text-gray-300 hover:border-white/40"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4">
            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">
                {language === "ur" ? "تعداد:" : "Quantity:"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <ApperIcon name="Minus" className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium text-white">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-400">
                {product.stock} {language === "ur" ? "دستیاب" : "in stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                {language === "ur" ? "کارٹ میں شامل کریں" : "Add to Cart"}
              </Button>
              
              <Button
                variant="accent"
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                <ApperIcon name="Zap" className="w-5 h-5 mr-2" />
                {language === "ur" ? "ابھی خریدیں" : "Buy Now"}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="px-4"
                onClick={handleWishlistToggle}
              >
                <ApperIcon 
                  name="Heart" 
                  className={`w-5 h-5 ${
                    isInWishlist(product.Id) ? "fill-red-500 text-red-500" : "text-white"
                  }`} 
                />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            {language === "ur" ? "ملتے جلتے پروڈکٹس" : "Related Products"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.Id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard product={relatedProduct} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
};

export default ProductDetailPage;