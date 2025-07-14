import { motion } from "framer-motion";

const Loading = ({ type = "products" }) => {
  const renderProductSkeleton = () => (
    <div className="bg-surface rounded-lg border border-white/10 overflow-hidden">
      <div className="aspect-square bg-gray-800 gradient-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-800 rounded gradient-shimmer" />
        <div className="h-4 bg-gray-800 rounded w-3/4 gradient-shimmer" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-800 rounded w-16 gradient-shimmer" />
          <div className="h-6 bg-gray-800 rounded w-12 gradient-shimmer" />
        </div>
        <div className="h-8 bg-gray-800 rounded gradient-shimmer" />
      </div>
    </div>
  );

  const renderCategorySkeleton = () => (
    <div className="bg-surface rounded-lg border border-white/10 h-32">
      <div className="h-full bg-gray-800 rounded-lg gradient-shimmer" />
    </div>
  );

  const renderListSkeleton = () => (
    <div className="flex gap-4 p-4 bg-surface rounded-lg border border-white/10">
      <div className="w-20 h-20 bg-gray-800 rounded-lg gradient-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-800 rounded gradient-shimmer" />
        <div className="h-4 bg-gray-800 rounded w-3/4 gradient-shimmer" />
        <div className="h-6 bg-gray-800 rounded w-16 gradient-shimmer" />
      </div>
    </div>
  );

  const getSkeletonGrid = () => {
    switch (type) {
      case "products":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {renderProductSkeleton()}
              </motion.div>
            ))}
          </div>
        );
      case "categories":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {renderCategorySkeleton()}
              </motion.div>
            ))}
          </div>
        );
      case "list":
        return (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {renderListSkeleton()}
              </motion.div>
            ))}
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {getSkeletonGrid()}
    </div>
  );
};

export default Loading;