import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { useApp } from "@/App";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { language } = useApp();

  const handleClick = () => {
    navigate(`/category/${category.slug}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden h-32 relative group">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 group-hover:from-secondary/30 group-hover:to-accent/30 transition-all duration-300" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
          <ApperIcon 
            name={category.icon} 
            className="w-8 h-8 text-accent mb-2 group-hover:scale-110 transition-transform duration-300" 
          />
          <h3 className="font-medium text-sm text-white group-hover:text-accent transition-colors">
            {language === "ur" ? category.nameUrdu : category.name}
          </h3>
          {category.productCount && (
            <p className="text-xs text-gray-400 mt-1">
              {category.productCount} {language === "ur" ? "اشیاء" : "items"}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;