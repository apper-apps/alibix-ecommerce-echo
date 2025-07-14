import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ProductCard from "@/components/molecules/ProductCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
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
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
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

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      setUploading(true);
      setError("");
      
      // Simulate image processing and search
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock search results based on image
      const imageSearchResults = await productService.searchByImage(imageFile);
      setProducts(imageSearchResults);
      
      toast.success(language === "ur" ? "تصویر کی بنیاد پر پروڈکٹس ملے!" : "Products found based on your image!");
    } catch (err) {
      setError(err.message);
      toast.error(language === "ur" ? "تصویر اپ لوڈ کرنے میں خرابی" : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setError("");
    } else {
      toast.error(language === "ur" ? "براہ کرم صرف تصویر کا فائل منتخب کریں" : "Please select an image file only");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const clearImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

        {/* Camera Upload Interface */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-6 bg-surface rounded-lg border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="Camera" className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-medium text-white">
              {language === "ur" ? "تصویر سے تلاش کریں" : "Search with Image"}
            </h3>
          </div>

          {!imageFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-secondary bg-secondary/10' 
                  : 'border-white/20 hover:border-white/30'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <ApperIcon name="Upload" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">
                {language === "ur" 
                  ? "تصویر یہاں ڈراپ کریں یا کلک کر کے منتخب کریں" 
                  : "Drop your image here or click to select"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {language === "ur" ? "PNG, JPG، JPEG (زیادہ سے زیادہ 10MB)" : "PNG, JPG, JPEG (Max 10MB)"}
              </p>
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto"
              >
                <ApperIcon name="ImagePlus" className="w-4 h-4 mr-2" />
                {language === "ur" ? "تصویر منتخب کریں" : "Select Image"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Image" className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{imageFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearImage}
                  className="text-gray-400 hover:text-white"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="accent"
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      {language === "ur" ? "تلاش جاری ہے..." : "Searching..."}
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Search" className="w-4 h-4 mr-2" />
                      {language === "ur" ? "تصویر سے تلاش کریں" : "Search with Image"}
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </motion.div>

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

        {imageFile && !uploading && products.length > 0 && (
          <p className="text-gray-400 mb-4">
            {language === "ur" ? "تصویر کی بنیاد پر ملنے والے نتائج" : "Results based on your image"}
            <span className="ml-2">
              ({products.length} {language === "ur" ? "آئٹمز ملے" : "items found"})
            </span>
          </p>
        )}
      </motion.div>

{(loading || uploading) ? (
        <Loading type="products" />
      ) : error ? (
        <Error message={error} onRetry={loadSearchResults} />
      ) : !query.trim() && !imageFile ? (
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