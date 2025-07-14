import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";

const WishlistPage = () => {
  const { wishlist, language } = useApp();

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
          {language === "ur" ? "پسندیدہ فہرست" : "My Wishlist"}
        </h1>
        <p className="text-gray-400">
          {wishlist.length} {language === "ur" ? "اشیاء محفوظ" : "items saved"}
        </p>
      </motion.div>

      {wishlist.length === 0 ? (
        <Empty 
          icon="Heart"
          title={language === "ur" ? "پسندیدہ فہرست خالی ہے" : "Your wishlist is empty"}
          message={language === "ur" ? "آپ نے ابھی کوئی چیز پسند نہیں کی" : "You haven't added any items to your wishlist yet"}
          actionText={language === "ur" ? "پروڈکٹس دیکھیں" : "Browse Products"}
          actionHref="/"
        />
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <AnimatePresence>
            {wishlist.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.1 * index }}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Quick Actions */}
      {wishlist.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex gap-4">
            <Button variant="secondary" onClick={() => window.location.href = "/"}>
              <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
              {language === "ur" ? "مزید خریداری" : "Continue Shopping"}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WishlistPage;