import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { useAuth } from '@/contexts/AuthContext';
import orderService from '@/services/api/orderService';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orderStatuses = ['Pending', 'Packed', 'Shipped', 'Delivered'];
  const paymentMethods = ['COD', 'Bank', 'JazzCash'];

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadOrders();
  }, [isAdmin, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getAll();
      setOrders(ordersData);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.update(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Packed': return 'warning';
      case 'Shipped': return 'info';
      case 'Delivered': return 'success';
      default: return 'secondary';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'COD': return 'Banknote';
      case 'Bank': return 'CreditCard';
      case 'JazzCash': return 'Smartphone';
      default: return 'CreditCard';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Order Management
            </h1>
            <p className="text-gray-400">
              Track and manage customer orders
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="info" className="px-3 py-1">
            {filteredOrders.length} Orders
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border-white/20"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Status</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <Card key={order.Id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-semibold text-white text-lg">
                    {order.orderNumber}
                  </h3>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-gray-400">
                    <ApperIcon name={getPaymentMethodIcon(order.paymentMethod)} size={16} />
                    <span className="text-sm">{order.paymentMethod}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Customer</p>
                    <p className="text-white font-medium">{order.customerName}</p>
                    <p className="text-gray-400">{order.customerEmail}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">Order Date</p>
                    <p className="text-white">{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">Total Amount</p>
                    <p className="text-accent font-bold text-lg">Rs. {order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                  View
                </Button>
                
                {order.status !== 'Delivered' && (
                  <div className="flex items-center gap-1">
                    {orderStatuses.map(status => {
                      const currentIndex = orderStatuses.indexOf(order.status);
                      const statusIndex = orderStatuses.indexOf(status);
                      
                      if (statusIndex <= currentIndex) return null;
                      
                      return (
                        <Button
                          key={status}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.Id, status)}
                          className="text-accent hover:text-accent/80"
                        >
                          {status}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Items Preview */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{order.items.length} items</span>
                <span>•</span>
                <span>Ordered {new Date(order.orderDate).toLocaleDateString()}</span>
                {order.shippingAddress && (
                  <>
                    <span>•</span>
                    <span>{order.shippingAddress.city}</span>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-surface rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Order Details - {selectedOrder.orderNumber}
              </h2>
              <Button
                variant="ghost"
                onClick={() => setSelectedOrder(null)}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-white mb-4">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Name: </span>
                    <span className="text-white">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email: </span>
                    <span className="text-white">{selectedOrder.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone: </span>
                    <span className="text-white">{selectedOrder.customerPhone}</span>
                  </div>
                </div>
              </Card>

              {/* Order Information */}
              <Card className="p-4">
                <h3 className="font-semibold text-white mb-4">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Status: </span>
                    <Badge variant={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-400">Payment Method: </span>
                    <span className="text-white">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Order Date: </span>
                    <span className="text-white">{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Amount: </span>
                    <span className="text-accent font-bold">Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Shipping Address */}
            {selectedOrder.shippingAddress && (
              <Card className="p-4 mt-6">
                <h3 className="font-semibold text-white mb-4">Shipping Address</h3>
                <div className="text-sm text-gray-300">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </Card>
            )}

            {/* Order Items */}
            <Card className="p-4 mt-6">
              <h3 className="font-semibold text-white mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Package" className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.productName}</p>
                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-accent">Rs. {item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Status Update Actions */}
            {selectedOrder.status !== 'Delivered' && (
              <div className="flex gap-2 mt-6">
                {orderStatuses.map(status => {
                  const currentIndex = orderStatuses.indexOf(selectedOrder.status);
                  const statusIndex = orderStatuses.indexOf(status);
                  
                  if (statusIndex <= currentIndex) return null;
                  
                  return (
                    <Button
                      key={status}
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.Id, status);
                        setSelectedOrder(null);
                      }}
                      className="bg-accent hover:bg-accent/80"
                    >
                      Update to {status}
                    </Button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminOrders;