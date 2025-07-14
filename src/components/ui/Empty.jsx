import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useApp } from "@/App";
import { useNavigate } from "react-router-dom";

const Empty = ({ 
  title,
  message,
  icon = "Package",
  actionText,
  actionHref = "/",
  onAction
}) => {
  const { language } = useApp();
  const navigate = useNavigate();

  const defaultTitle = language === "ur" ? "کوئی چیز نہیں ملی" : "Nothing found here";
  const defaultMessage = language === "ur" ? "ابھی یہاں کوئی چیز دستیاب نہیں" : "There's nothing to show right now";
  const defaultActionText = language === "ur" ? "خریداری شروع کریں" : "Start Shopping";

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate(actionHref);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-accent" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">
        {title || defaultTitle}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md">
        {message || defaultMessage}
      </p>
      
      <Button onClick={handleAction} className="px-8">
        <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
        {actionText || defaultActionText}
      </Button>
    </motion.div>
  );
};

export default Empty;