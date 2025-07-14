import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryCard from "@/components/molecules/CategoryCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { language } = useApp();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [featured, trending, cats] = await Promise.all([
        productService.getFeatured(),
        productService.getTrending(),
        categoryService.getAll()
      ]);

      setFeaturedProducts(featured);
      setTrendingProducts(trending);
      setCategories(cats.slice(0, 6));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-8">
        <Loading type="categories" />
        <Loading type="products" />
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6 space-y-8"
    >
      {/* Hero Banner */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-secondary via-accent to-secondary p-8 md:p-12 text-center"
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-black mb-4">
            {language === "ur" ? "الی بکس میں خوش آمدید" : "Welcome to AliBix"}
          </h1>
          <p className="text-lg md:text-xl text-black/80 mb-6 max-w-2xl mx-auto">
            {language === "ur" 
              ? "پاکستان کا بہترین آن لائن شاپنگ پلیٹ فارم" 
              : "Pakistan's Premium Online Shopping Experience"
            }
          </p>
          <Button variant="accent" size="lg" className="bg-black text-white hover:bg-black/80">
            <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
            {language === "ur" ? "خریداری شروع کریں" : "Start Shopping"}
          </Button>
        </div>
      </motion.div>

      {/* Categories Section */}
      <section>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl font-display font-bold text-white">
            {language === "ur" ? "کیٹگریز" : "Shop by Category"}
          </h2>
          <Link to="/categories">
            <Button variant="ghost" size="sm">
              {language === "ur" ? "تمام دیکھیں" : "View All"}
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {categories.length === 0 ? (
          <Empty 
            icon="Grid3X3"
            title={language === "ur" ? "کوئی کیٹگری نہیں" : "No Categories"}
            message={language === "ur" ? "ابھی کوئی کیٹگری دستیاب نہیں" : "No categories available right now"}
          />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.Id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Featured Products Section */}
      <section>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              {language === "ur" ? "خصوصی پیشکش" : "Featured Deals"}
            </h2>
            <p className="text-gray-400">
              {language === "ur" ? "بہترین رعایت کے ساتھ" : "Best prices guaranteed"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Fire" className="w-5 h-5 text-secondary" />
            <span className="text-sm text-secondary font-medium">
              {language === "ur" ? "محدود وقت" : "Limited Time"}
            </span>
          </div>
        </motion.div>

        {featuredProducts.length === 0 ? (
          <Empty 
            icon="Tag"
            title={language === "ur" ? "کوئی خصوصی پیشکش نہیں" : "No Featured Deals"}
            message={language === "ur" ? "ابھی کوئی خصوصی پیشکش دستیاب نہیں" : "No featured deals available right now"}
          />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Trending Products Section */}
      <section>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              {language === "ur" ? "مقبول اشیاء" : "Trending Now"}
            </h2>
            <p className="text-gray-400">
              {language === "ur" ? "سب سے زیادہ پسند کیا جانے والا" : "Most popular items"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-accent" />
            <span className="text-sm text-accent font-medium">
              {language === "ur" ? "رجحان میں" : "Trending"}
            </span>
          </div>
        </motion.div>

        {trendingProducts.length === 0 ? (
          <Empty 
            icon="TrendingUp"
            title={language === "ur" ? "کوئی مقبول چیز نہیں" : "No Trending Items"}
            message={language === "ur" ? "ابھی کوئی مقبول چیز دستیاب نہیں" : "No trending items available right now"}
          />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Trust Indicators */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Shield" className="w-6 h-6 text-success" />
          </div>
          <h3 className="font-semibold text-white mb-2">
            {language === "ur" ? "محفوظ ادائیگی" : "Secure Payment"}
          </h3>
          <p className="text-gray-400 text-sm">
            {language === "ur" ? "100% محفوظ لین دین" : "100% secure transactions"}
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Truck" className="w-6 h-6 text-info" />
          </div>
          <h3 className="font-semibold text-white mb-2">
            {language === "ur" ? "تیز ڈیلیوری" : "Fast Delivery"}
          </h3>
          <p className="text-gray-400 text-sm">
            {language === "ur" ? "پاکستان بھر میں" : "Nationwide delivery"}
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Star" className="w-6 h-6 text-warning" />
          </div>
          <h3 className="font-semibold text-white mb-2">
            {language === "ur" ? "بہترین معیار" : "Quality Guaranteed"}
          </h3>
          <p className="text-gray-400 text-sm">
            {language === "ur" ? "اعلیٰ معیار کی ضمانت" : "Premium quality products"}
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;