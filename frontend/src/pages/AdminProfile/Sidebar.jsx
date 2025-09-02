import { useState } from "react";
import { BarChart3, FileText, Users, Map } from "lucide-react";

const menu = [
  { name: "Dashboard", icon: BarChart3 },
  { name: "Reports", icon: FileText },
  { name: "Users", icon: Users },
  { name: "Regions", icon: Map },
];

export default function Sidebar({ onMenuClick }) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleMenuClick = (itemName) => {
    const lowerCaseName = itemName.toLowerCase();
    setActiveItem(lowerCaseName);
    onMenuClick(lowerCaseName);
  };

  return (
    <aside className="w-full h-fit bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-blue-100 p-6 mx-4 lg:mx-6 mb-6 lg:mb-0 mt-10 sm:mt-0">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"></div>
          <h2 className="font-bold text-xl text-gray-800 tracking-tight">
            Admin Panel
          </h2>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-blue-200 via-blue-300 to-transparent"></div>
      </div>

      <nav className="flex flex-col gap-3">
        {menu.map((item) => {
          const isActive = activeItem === item.name.toLowerCase();
          return (
            <button
              key={item.name}
              onClick={() => handleMenuClick(item.name)}
              className={`
                flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ease-out
                text-left font-medium relative overflow-hidden group
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200/50 scale-[1.02]"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:scale-[1.01] hover:shadow-md"
                }
              `}
            >
              {/* Background gradient for hover effect */}
              <div
                className={`
                absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 
                transition-opacity duration-300 rounded-xl
                ${isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"}
              `}
              ></div>

              {/* Icon with enhanced styling */}
              <item.icon
                className={`
                w-5 h-5 relative z-10 transition-all duration-300
                ${
                  isActive
                    ? "text-white scale-110"
                    : "text-gray-600 group-hover:text-blue-700 group-hover:scale-110"
                }
              `}
              />

              {/* Text with better typography */}
              <span
                className={`
                relative z-10 tracking-wide
                ${isActive ? "font-semibold" : "font-medium"}
              `}
              >
                {item.name}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-3 w-2 h-2 bg-white rounded-full opacity-80"></div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
