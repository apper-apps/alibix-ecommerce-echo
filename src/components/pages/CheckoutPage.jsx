import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, language, setCart } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cod"
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 200;
  const total = subtotal + shipping;

  // Check if any item is Chinese product (requires online payment)
  const hasChineseProducts = cart.some(item => item.product?.isChineseProduct);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast.error(language === "ur" ? "براہ کرم تمام فیلڈز بھریں" : "Please fill all required fields");
      return;
    }

    if (hasChineseProducts && formData.paymentMethod === "cod") {
      toast.error(language === "ur" ? "چینی پروڈکٹس کے لیے آن لائن ادائیگی ضروری ہے" : "Chinese products require online payment");
      return;
    }

    setLoading(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart
      setCart([]);
      
      toast.success(language === "ur" ? "آرڈر کامیابی سے ہو گیا!" : "Order placed successfully!");
      navigate("/account");
    } catch (error) {
      toast.error(language === "ur" ? "آرڈر میں خرابی ہوئی" : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
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
            {language === "ur" ? "چیک آؤٹ" : "Checkout"}
          </h1>
          <p className="text-gray-400">
            {language === "ur" ? "اپنا آرڈر مکمل کریں" : "Complete your order"}
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="text-gray-400 hover:text-white"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          {language === "ur" ? "کارٹ" : "Back to Cart"}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              {language === "ur" ? "ڈیلیوری کی تفصیلات" : "Delivery Details"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === "ur" ? "نام" : "Full Name"} *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={language === "ur" ? "آپ کا نام" : "Your full name"}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === "ur" ? "فون نمبر" : "Phone Number"} *
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={language === "ur" ? "03xx-xxxxxxx" : "03xx-xxxxxxx"}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === "ur" ? "ای میل" : "Email"} (اختیاری)
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={language === "ur" ? "آپ کا ای میل" : "your@email.com"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === "ur" ? "مکمل پتہ" : "Complete Address"} *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={language === "ur" ? "مکمل پتہ" : "House/Street, Area, Landmark"}
                  className="w-full h-20 px-4 py-2 bg-surface border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === "ur" ? "شہر" : "City"} *
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder={language === "ur" ? "آپ کا شہر" : "Your city"}
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  {language === "ur" ? "ادائیگی کا طریقہ" : "Payment Method"} *
                </label>
                
                {hasChineseProducts && (
                  <div className="mb-4 p-3 bg-warning/20 border border-warning/30 rounded-lg">
                    <div className="flex items-center gap-2 text-warning text-sm">
                      <ApperIcon name="AlertTriangle" className="w-4 h-4" />
                      <span>
                        {language === "ur" 
                          ? "چینی پروڈکٹس کے لیے آن لائن ادائیگی ضروری ہے"
                          : "Online payment required for Chinese products"
                        }
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {!hasChineseProducts && (
                    <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.paymentMethod === "cod" ? "border-secondary bg-secondary" : "border-gray-400"}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Package" className="w-5 h-5 text-success" />
                          <span className="font-medium text-white">
                            {language === "ur" ? "ڈیلیوری پر ادائیگی" : "Cash on Delivery"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {language === "ur" ? "آرڈر ملنے پر پیسے دیں" : "Pay when you receive your order"}
                        </p>
                      </div>
                    </label>
                  )}

                  <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa"
                      checked={formData.paymentMethod === "easypaisa"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.paymentMethod === "easypaisa" ? "border-secondary bg-secondary" : "border-gray-400"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Smartphone" className="w-5 h-5 text-info" />
                        <span className="font-medium text-white">Easypaisa</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {language === "ur" ? "ایزی پیسہ سے ادائیگی" : "Pay with Easypaisa"}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jazzcash"
                      checked={formData.paymentMethod === "jazzcash"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.paymentMethod === "jazzcash" ? "border-secondary bg-secondary" : "border-gray-400"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Smartphone" className="w-5 h-5 text-info" />
                        <span className="font-medium text-white">JazzCash</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {language === "ur" ? "جاز کیش سے ادائیگی" : "Pay with JazzCash"}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-white/20 rounded-lg cursor-pointer hover:border-secondary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.paymentMethod === "bank" ? "border-secondary bg-secondary" : "border-gray-400"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="CreditCard" className="w-5 h-5 text-accent" />
                        <span className="font-medium text-white">
                          {language === "ur" ? "بینک ٹرانسفر" : "Bank Transfer"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {language === "ur" ? "بینک کے ذریعے ادائیگی" : "Direct bank transfer"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {language === "ur" ? "آرڈر ہو رہا ہے..." : "Placing Order..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="CheckCircle" className="w-5 h-5 mr-2" />
                    {language === "ur" ? "آرڈر کریں" : "Place Order"}
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              {language === "ur" ? "آرڈر کا خلاصہ" : "Order Summary"}
            </h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.selectedVariant}`} className="flex gap-3">
                  <img
                    src={item.product?.images?.[0] || "/api/placeholder/60/60"}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-gray-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {language === "ur" ? item.product?.titleUrdu : item.product?.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>
                        {item.quantity} × Rs. {item.price.toLocaleString()}
                      </span>
                      <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    {item.product?.isChineseProduct && (
                      <Badge variant="warning" className="text-xs mt-1">
                        🇨🇳 {language === "ur" ? "22 دن ڈیلیوری" : "22 days delivery"}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-4 border-t border-white/10">
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

              <div className="flex justify-between text-white font-semibold text-lg pt-3 border-t border-white/10">
                <span>{language === "ur" ? "کل" : "Total"}</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ApperIcon name="Shield" className="w-4 h-4 text-success" />
                <span>
                  {language === "ur" 
                    ? "آپ کی معلومات محفوظ ہے" 
                    : "Your information is secure"
                  }
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;