import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
const [stats, setStats] = useState({
    totalSales: 125000,
    totalProducts: 89,
    pendingOrders: 12,
    totalCustomers: 156
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

const quickActions = [
    {
      title: 'Product Management',
      description: 'Add, edit products with bilingual support',
      icon: 'Package',
      color: 'bg-green-500/20 text-green-400',
      action: () => navigate('/admin/products')
    },
    {
      title: 'Order Management',
      description: 'Update order status and track payments',
      icon: 'ShoppingCart',
      color: 'bg-orange-500/20 text-orange-400',
      action: () => navigate('/admin/orders')
    },
    {
      title: 'Sales Analytics',
      description: 'View sales by category and performance',
      icon: 'BarChart3',
      color: 'bg-purple-500/20 text-purple-400',
      action: () => navigate('/admin/analytics')
    },
    {
      title: 'Customer Management',
      description: 'Manage customer accounts and data',
      icon: 'Users',
      color: 'bg-blue-500/20 text-blue-400',
      action: () => navigate('/admin/customers')
    }
  ];

const recentOrders = [
    { id: 'ORD-001', customer: 'Ahmed Khan', amount: 15600, status: 'Pending', paymentMethod: 'COD' },
    { id: 'ORD-002', customer: 'Sara Ali', amount: 8900, status: 'Shipped', paymentMethod: 'Bank' },
    { id: 'ORD-003', customer: 'Hassan Shah', amount: 4500, status: 'Delivered', paymentMethod: 'JazzCash' },
    { id: 'ORD-004', customer: 'Fatima Malik', amount: 12300, status: 'Packed', paymentMethod: 'COD' },
    { id: 'ORD-005', customer: 'Omar Siddiqui', amount: 6700, status: 'Pending', paymentMethod: 'Bank' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back, {user?.name}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="success" className="px-3 py-1">
            <ApperIcon name="Shield" className="w-4 h-4 mr-1" />
            Admin
          </Badge>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300"
          >
            <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
<Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-white">Rs. {stats.totalSales.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

<Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

<Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </Card>

<Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={action.action}
                  className="p-4 bg-background rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                      <ApperIcon name={action.icon} className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white group-hover:text-accent transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              <Button variant="ghost" size="sm">
                <ApperIcon name="ExternalLink" className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <div>
                    <p className="font-medium text-white text-sm">{order.id}</p>
                    <p className="text-xs text-gray-400">{order.customer}</p>
                    <p className="text-xs text-accent">{order.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-accent text-sm">
                      Rs. {order.amount.toLocaleString()}
                    </p>
                    <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'info' : order.status === 'Packed' ? 'warning' : 'secondary'} className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;