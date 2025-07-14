import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";
import productService from "@/services/api/productService";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const { language } = useApp();

  const loadSearchResults = async () => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const results = await productService.search(query);
      setProducts(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSearchResults();
  }, [query]);

  useEffect(() => {
    if (products.length > 0) {
      let filteredProducts = [...products];

      // Apply price filter
      if (priceRange.min || priceRange.max) {
        filteredProducts = filteredProducts.filter(product => {
          const price = product.discountedPrice || product.price;
          const min = priceRange.min ? parseInt(priceRange.min) : 0;
          const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
          return price >= min && price <= max;
        });
      }

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          filteredProducts.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
          break;
        case "price-high":
          filteredProducts.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
          break;
        case "discount":
          filteredProducts.sort((a, b) => {
            const discountA = a.discountedPrice ? ((a.price - a.discountedPrice) / a.price) * 100 : 0;
            const discountB = b.discountedPrice ? ((b.price - b.discountedPrice) / b.price) * 100 : 0;
            return discountB - discountA;
          });
          break;
        default:
          break;
      }

      setProducts(filteredProducts);
    }
  }, [sortBy, priceRange]);

  const clearFilters = () => {
    setSortBy("default");
    setPriceRange({ min: "", max: "" });
    loadSearchResults();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Search Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-display font-bold text-white mb-4">
          {language === "ur" ? "تلاش کے نتائج" : "Search Results"}
        </h1>
        
        <div className="mb-4">
          <SearchBar />
        </div>

        {query && (
          <p className="text-gray-400">
            {language === "ur" ? `"${query}" کے لیے نتائج` : `Results for "${query}"`}
            {!loading && (
              <span className="ml-2">
                ({products.length} {language === "ur" ? "آئٹمز ملے" : "items found"})
              </span>
            )}
          </p>
        )}
      </motion.div>

      {loading ? (
        <Loading type="products" />
      ) : error ? (
        <Error message={error} onRetry={loadSearchResults} />
      ) : !query.trim() ? (
        <Empty 
          icon="Search"
          title={language === "ur" ? "کچھ تلاش کریں" : "Start your search"}
          message={language === "ur" ? "اپنی پسندیدہ چیز تلاش کریں" : "Search for your favorite products"}
        />
      ) : products.length === 0 ? (
        <Empty 
          icon="SearchX"
          title={language === "ur" ? "کوئی نتیجہ نہیں ملا" : "No results found"}
          message={language === "ur" ? `"${query}" کے لیے کوئی پروڈکٹ نہیں ملا` : `No products found for "${query}"`}
          actionText={language === "ur" ? "تمام پروڈکٹس دیکھیں" : "Browse All Products"}
          actionHref="/"
        />
      ) : (
        <>
          {/* Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-surface rounded-lg border border-white/10"
          >
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
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

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {language === "ur" ? "قیمت:" : "Price:"}
              </span>
              <input
                type="number"
                placeholder={language === "ur" ? "کم سے کم" : "Min"}
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-20 bg-background border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder={language === "ur" ? "زیادہ سے زیادہ" : "Max"}
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-20 bg-background border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            {/* Clear Filters */}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-400 hover:text-white"
            >
              <ApperIcon name="X" className="w-4 h-4 mr-1" />
              {language === "ur" ? "صاف کریں" : "Clear"}
            </Button>
          </motion.div>

          {/* Products Grid */}
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
        </>
      )}
    </motion.div>
  );
};

export default SearchPage;