import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { useApp } from "@/App";

const SearchBar = ({ className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { language } = useApp();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={language === "ur" ? "تلاش کریں..." : "Search products..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <ApperIcon 
          name="Search" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
      </div>
      <Button type="submit" size="lg" className="px-4">
        <ApperIcon name="Search" className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default SearchBar;