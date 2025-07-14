import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";
import { useAuth } from "@/contexts/AuthContext";
const AccountPage = () => {
  const { language } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect based on authentication status
  const handleGetStarted = () => {
    if (isAuthenticated()) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

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
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          {language === "ur" ? "اکاؤنٹ" : "Account"}
        </h1>
        <p className="text-gray-400">
          {language === "ur" ? "اپنے اکاؤنٹ میں داخل ہوں یا نیا بنائیں" : "Sign in to your account or create a new one"}
        </p>
      </motion.div>

      {/* Account Access Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-md mx-auto"
      >
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="User" className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === "ur" ? "اکاؤنٹ کی رسائی" : "Account Access"}
          </h2>
          
          <p className="text-gray-400 mb-6">
            {language === "ur" 
              ? "اپنے آرڈرز، پسندیدہ اشیاء اور پروفائل کا انتظام کرنے کے لیے لاگ ان کریں"
              : "Sign in to manage your orders, wishlist, and profile"
            }
          </p>

          <Button 
            variant="secondary" 
            className="w-full"
            onClick={handleGetStarted}
          >
            <ApperIcon name="LogIn" className="w-5 h-5 mr-2" />
            {language === "ur" ? "شروع کریں" : "Get Started"}
          </Button>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500">
              {language === "ur" 
                ? "Google کے ذریعے محفوظ لاگ ان"
                : "Secure login with Google"
              }
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
export default AccountPage;