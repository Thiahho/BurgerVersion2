import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCatalog } from "../../hooks/useCatalog";

const Footer: React.FC = () => {
  const { businessInfo } = useCatalog();
  const location = useLocation();

  if (!businessInfo) {
    return null;
  }

  const navItems = [
    { path: "/", label: "Menú", icon: "🍔" },
    { path: "/info", label: "Info", icon: "ℹ️" },
  ];

    return (
    <footer className="sticky bottom-0 bg-black border-t border-gray-800 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-gray-400 hover:text-white hover:-translate-y-0.5 hover:bg-gray-900/60"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
