import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "farms", label: "Farms", icon: "MapPin" },
    { path: "crops", label: "Crops", icon: "Sprout" },
    { path: "tasks", label: "Tasks", icon: "CheckSquare" },
    { path: "weather", label: "Weather", icon: "CloudSun" },
    { path: "finances", label: "Finances", icon: "DollarSign" }
  ];

  const isActive = (path) => {
    if (path === "") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(`/${path}`);
  };

  return (
    <header className="bg-white shadow-card sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <ApperIcon name="Sprout" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FarmTrack</h1>
              <p className="text-xs text-gray-500">Agriculture Management</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={`/${item.path}`}
                className={cn(
                  "flex items-center px-4 py-2 rounded-button text-sm font-medium transition-all duration-200",
                  "hover:bg-primary-50 hover:text-primary",
                  isActive(item.path)
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700"
                )}
              >
                <ApperIcon name={item.icon} size={18} className="mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-button text-gray-700 hover:bg-gray-100"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden py-4 border-t border-gray-200"
          >
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={`/${item.path}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-button text-sm font-medium transition-all duration-200",
                    "hover:bg-primary-50 hover:text-primary",
                    isActive(item.path)
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700"
                  )}
                >
                  <ApperIcon name={item.icon} size={18} className="mr-3" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;