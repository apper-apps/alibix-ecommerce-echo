import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { language, cart, wishlist } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(language === "ur" ? "لاگ آؤٹ کامیاب" : "Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(language === "ur" ? "لاگ آؤٹ ناکام" : "Logout failed");
    }
  };

  // Mock orders data
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      total: 15600,
      status: "Delivered",
      items: 3
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      total: 8900,
      status: "Shipped",
      items: 2
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      total: 4500,
      status: "Packed",
      items: 1
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "success";
      case "Shipped": return "info";
      case "Packed": return "warning";
      default: return "default";
    }
  };

  const getStatusText = (status) => {
    if (language === "ur") {
      switch (status) {
        case "Delivered": return "پہنچ گیا";
        case "Shipped": return "بھیجا گیا";
        case "Packed": return "پیک ہو گیا";
        default: return status;
      }
    }
    return status;
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
          {language === "ur" ? "میرا پروفائل" : "My Profile"}
        </h1>
        <p className="text-gray-400">
          {language === "ur" ? "اپنی تفصیلات اور آرڈرز دیکھیں" : "Manage your profile and orders"}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <ApperIcon name="User" className="w-10 h-10 text-white" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-white mb-1">{user?.name}</h2>
              <p className="text-gray-400 text-sm">
                {language === "ur" ? "کسٹمر" : "Customer"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <ApperIcon name="Mail" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">
                    {language === "ur" ? "ای میل" : "Email"}
                  </p>
                  <p className="text-white text-sm">{user?.email}</p>
                </div>
              </div>
            </div>

            <Button 
              variant="ghost" 
              className="w-full mt-6 text-red-400 hover:text-red-300"
              onClick={handleLogout}
            >
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              {language === "ur" ? "لاگ آؤٹ" : "Logout"}
            </Button>
          </Card>

          {/* Quick Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 mt-6"
          >
            <Card className="p-4 text-center">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <ApperIcon name="ShoppingCart" className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-white">{cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
              <p className="text-xs text-gray-400">
                {language === "ur" ? "کارٹ میں" : "In Cart"}
              </p>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <ApperIcon name="Heart" className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-white">{wishlist.length}</p>
              <p className="text-xs text-gray-400">
                {language === "ur" ? "پسندیدہ" : "Wishlist"}
              </p>
            </Card>
          </motion.div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {language === "ur" ? "حالیہ آرڈرز" : "Recent Orders"}
              </h2>
              <Button variant="ghost" size="sm">
                <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
                {language === "ur" ? "تمام دیکھیں" : "View All"}
              </Button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Package" className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400">
                  {language === "ur" ? "کوئی آرڈر نہیں ملا" : "No orders found"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center">
                        <ApperIcon name="Package" className="w-6 h-6 text-accent" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-white">{order.id}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(order.date).toLocaleDateString()} • {order.items} {language === "ur" ? "اشیاء" : "items"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-accent">
                        Rs. {order.total.toLocaleString()}
                      </p>
                      <Badge variant={getStatusColor(order.status)} className="text-xs">
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
          >
            <Card className="p-6 text-center hover:bg-surface/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="MapPin" className="w-6 h-6 text-info" />
              </div>
              <h3 className="font-medium text-white mb-2">
                {language === "ur" ? "پتے کا انتظام" : "Manage Addresses"}
              </h3>
              <p className="text-sm text-gray-400">
                {language === "ur" ? "اپنے ڈیلیوری ایڈریس اپڈیٹ کریں" : "Update your delivery addresses"}
              </p>
            </Card>

            <Card className="p-6 text-center hover:bg-surface/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="MessageCircle" className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-medium text-white mb-2">
                {language === "ur" ? "سپورٹ" : "Customer Support"}
              </h3>
              <p className="text-sm text-gray-400">
                {language === "ur" ? "ہم سے رابطہ کریں" : "Get help with your orders"}
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;