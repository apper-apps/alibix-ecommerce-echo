import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useApp } from "@/App";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  icon = "AlertCircle",
  title
}) => {
  const { language } = useApp();

  const defaultTitle = language === "ur" ? "خرابی ہوئی" : "Oops! Something went wrong";
  const defaultMessage = language === "ur" ? "دوبارہ کوشش کریں" : "Please try again later";
  const retryText = language === "ur" ? "دوبارہ کوشش کریں" : "Try Again";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {title || defaultTitle}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md">
        {message || defaultMessage}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          {retryText}
        </Button>
      )}
    </motion.div>
  );
};

export default Error;