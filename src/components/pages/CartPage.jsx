import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, language } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? (subtotal > 2000 ? 0 : 200) : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {language === "ur" ? "شاپنگ کارٹ" : "Shopping Cart"}
          </h1>
        </motion.div>

        <Empty 
          icon="ShoppingCart"
          title={language === "ur" ? "کارٹ خالی ہے" : "Your cart is empty"}
          message={language === "ur" ? "ابھی آپ کے کارٹ میں کوئی چیز نہیں ہے" : "You haven't added any items to your cart yet"}
          actionText={language === "ur" ? "خریداری شروع کریں" : "Start Shopping"}
          actionHref="/"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {language === "ur" ? "شاپنگ کارٹ" : "Shopping Cart"}
          </h1>
          <p className="text-gray-400">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} {language === "ur" ? "اشیاء" : "items"}
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          {language === "ur" ? "واپس" : "Back"}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {cart.map((item) => (
                <CartItem key={`${item.productId}-${item.selectedVariant}`} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              {language === "ur" ? "آرڈر کا خلاصہ" : "Order Summary"}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>{language === "ur" ? "ذیلی کل" : "Subtotal"}</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>
                  {language === "ur" ? "ڈیلیوری" : "Delivery"}
                  {shipping === 0 && (
                    <span className="text-success text-xs ml-1">
                      ({language === "ur" ? "مفت" : "Free"})
                    </span>
                  )}
                </span>
                <span>Rs. {shipping.toLocaleString()}</span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  {language === "ur" 
                    ? "Rs. 2,000 کی خریداری پر مفت ڈیلیوری" 
                    : "Free delivery on orders over Rs. 2,000"
                  }
                </p>
              )}

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>{language === "ur" ? "کل" : "Total"}</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mb-4" 
              size="lg"
              onClick={handleCheckout}
            >
              <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
              {language === "ur" ? "چیک آؤٹ" : "Proceed to Checkout"}
            </Button>

            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => navigate("/")}
            >
              <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
              {language === "ur" ? "خریداری جاری رکھیں" : "Continue Shopping"}
            </Button>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-white mb-3">
                {language === "ur" ? "محفوظ خریداری" : "Secure Shopping"}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <ApperIcon name="Shield" className="w-4 h-4 text-success" />
                  <span>{language === "ur" ? "100% محفوظ ادائیگی" : "100% Secure Payment"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <ApperIcon name="Truck" className="w-4 h-4 text-info" />
                  <span>{language === "ur" ? "تیز ڈیلیوری" : "Fast Delivery"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <ApperIcon name="RotateCcw" className="w-4 h-4 text-warning" />
                  <span>{language === "ur" ? "آسان واپسی" : "Easy Returns"}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CartPage;