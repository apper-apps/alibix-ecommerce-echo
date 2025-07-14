import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
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

const CategoriesPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const { language } = useApp();

  const isShowingCategory = !!categoryName;

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (categoryName) {
        // Load specific category and its products
        const [category, categoryProducts] = await Promise.all([
          categoryService.getBySlug(categoryName),
          productService.getByCategory(categoryName.replace("-", " "))
        ]);
        setCurrentCategory(category);
        setProducts(categoryProducts);
      } else {
        // Load all categories
        const allCategories = await categoryService.getAll();
        setCategories(allCategories);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryName]);

  useEffect(() => {
    if (products.length > 0) {
      let sortedProducts = [...products];
      
      switch (sortBy) {
        case "price-low":
          sortedProducts.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
          break;
        case "price-high":
          sortedProducts.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
          break;
        case "discount":
          sortedProducts.sort((a, b) => {
            const discountA = a.discountedPrice ? ((a.price - a.discountedPrice) / a.price) * 100 : 0;
            const discountB = b.discountedPrice ? ((b.price - b.discountedPrice) / b.price) * 100 : 0;
            return discountB - discountA;
          });
          break;
        default:
          // Keep original order
          break;
      }
      
      setProducts(sortedProducts);
    }
  }, [sortBy]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Loading type={isShowingCategory ? "products" : "categories"} />
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

  if (isShowingCategory) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-6"
      >
        {/* Category Header */}
        {currentCategory && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-secondary/20 to-accent/20 p-8 text-center">
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                {language === "ur" ? currentCategory.nameUrdu : currentCategory.name}
              </h1>
              <p className="text-gray-300">
                {currentCategory.productCount} {language === "ur" ? "اشیاء دستیاب" : "items available"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Filters and Sort */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-xl font-semibold text-white">
            {language === "ur" ? "تمام پروڈکٹس" : "All Products"}
          </h2>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="default">
                {language === "ur" ? "ترتیب دیں" : "Sort by"}
              </option>
              <option value="price-low">
                {language === "ur" ? "قیمت: کم سے زیادہ" : "Price: Low to High"}
              </option>
              <option value="price-high">
                {language === "ur" ? "قیمت: زیادہ سے کم" : "Price: High to Low"}
              </option>
              <option value="discount">
                {language === "ur" ? "سب سے زیادہ رعایت" : "Highest Discount"}
              </option>
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Empty 
            icon="Package"
            title={language === "ur" ? "کوئی پروڈکٹ نہیں ملا" : "No Products Found"}
            message={language === "ur" ? "اس کیٹگری میں ابھی کوئی پروڈکٹ دستیاب نہیں" : "No products available in this category right now"}
            actionText={language === "ur" ? "دوسری کیٹگری دیکھیں" : "Browse Other Categories"}
            actionHref="/categories"
          />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {products.map((product, index) => (
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
      </motion.div>
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
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-white mb-4">
          {language === "ur" ? "تمام کیٹگریز" : "Shop by Categories"}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {language === "ur" 
            ? "اپنی پسندیدہ کیٹگری منتخب کریں اور بہترین پروڈکٹس تلاش کریں"
            : "Choose your favorite category and discover amazing products"
          }
        </p>
      </motion.div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Empty 
          icon="Grid3X3"
          title={language === "ur" ? "کوئی کیٹگری نہیں ملی" : "No Categories Found"}
          message={language === "ur" ? "ابھی کوئی کیٹگری دستیاب نہیں" : "No categories available right now"}
        />
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
    </motion.div>
  );
};

export default CategoriesPage;