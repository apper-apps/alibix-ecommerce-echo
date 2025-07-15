import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/App';
import productService from '@/services/api/productService';
import categoryService from '@/services/api/categoryService';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { language } = useApp();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSoldOut, setShowSoldOut] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    titleUrdu: '',
    description: '',
    descriptionUrdu: '',
    price: '',
    discount: '',
    category: '',
    sizes: [],
    colors: [],
    stock: '',
    images: [],
    paymentMethods: ['COD', 'Online'],
    shippedFromChina: false
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        stock: parseInt(formData.stock),
        discountedPrice: formData.discount ? 
          formData.price - (formData.price * formData.discount / 100) : null
      };

      if (editingProduct) {
        await productService.update(editingProduct.Id, productData);
        toast.success('Product updated successfully');
      } else {
        await productService.create(productData);
        toast.success('Product created successfully');
      }

      setShowAddForm(false);
      setEditingProduct(null);
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        toast.success('Product deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      titleUrdu: product.titleUrdu || '',
      description: product.description,
      descriptionUrdu: product.descriptionUrdu || '',
      price: product.price.toString(),
      discount: product.discount?.toString() || '',
      category: product.category,
      sizes: product.sizes || [],
      colors: product.colors || [],
      stock: product.stock.toString(),
      images: product.images || [],
      paymentMethods: product.paymentMethods || ['COD', 'Online'],
      shippedFromChina: product.shippedFromChina || false
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleUrdu: '',
      description: '',
      descriptionUrdu: '',
      price: '',
      discount: '',
      category: '',
      sizes: [],
      colors: [],
      stock: '',
      images: [],
      paymentMethods: ['COD', 'Online'],
      shippedFromChina: false
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.titleUrdu?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSoldOut = !showSoldOut || product.stock === 0;
    
    return matchesSearch && matchesCategory && matchesSoldOut;
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
              Product Management
            </h1>
            <p className="text-gray-400">
              Add, edit, and manage your products
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-accent hover:bg-accent/80"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border-white/20"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-background border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.Id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>

          <Button
            variant={showSoldOut ? "default" : "ghost"}
            onClick={() => setShowSoldOut(!showSoldOut)}
            size="sm"
          >
            <ApperIcon name="AlertCircle" className="w-4 h-4 mr-2" />
            Sold Out Only
          </Button>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.Id} className="p-4">
            <div className="aspect-square bg-gray-800 rounded-lg mb-4 relative overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ApperIcon name="Image" className="w-12 h-12 text-gray-600" />
                </div>
              )}
              
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <Badge variant="destructive">SOLD OUT</Badge>
                </div>
              )}
              
              {product.shippedFromChina && (
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-black text-xs">
                  🇨🇳 China
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white truncate">
                {language === 'ur' ? product.titleUrdu || product.title : product.title}
              </h3>
              
              <div className="flex items-center gap-2">
                <span className="text-accent font-bold">
                  Rs. {product.discountedPrice || product.price}
                </span>
                {product.discountedPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    Rs. {product.price}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Stock: {product.stock}</span>
                <span>•</span>
                <span>{product.category}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(product.Id)}
                  className="flex-1 text-red-400 hover:text-red-300"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddForm && (
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
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Name (English)
                    </label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-background border-white/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Name (Urdu)
                    </label>
                    <Input
                      value={formData.titleUrdu}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleUrdu: e.target.value }))}
                      className="bg-background border-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (English)
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-background border border-white/20 rounded-lg px-4 py-2 text-white h-24 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (Urdu)
                    </label>
                    <textarea
                      value={formData.descriptionUrdu}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionUrdu: e.target.value }))}
                      className="w-full bg-background border border-white/20 rounded-lg px-4 py-2 text-white h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price (Rs.)
                    </label>
                    <Input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="bg-background border-white/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Discount (%)
                    </label>
                    <Input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                      className="bg-background border-white/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stock
                    </label>
                    <Input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      className="bg-background border-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.Id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                  {formData.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative w-16 h-16">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <ApperIcon name="X" size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.shippedFromChina}
                      onChange={(e) => setFormData(prev => ({ ...prev, shippedFromChina: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-300">Shipped from China 🇨🇳</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-accent hover:bg-accent/80"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminProducts;