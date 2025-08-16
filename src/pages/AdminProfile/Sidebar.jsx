const menu = [
  { name: "Dashboard", icon: "📊" },
  { name: "Reports", icon: "📝" },
  { name: "Users", icon: "👤" },
];

export default function Sidebar({ onMenuClick }) {
  return (
    <aside className="w-full md:w-1/4 h-fit bg-slate-100 shadow-lg rounded-lg p-6 mx-auto mb-4 mt-10 sm:mt-0">
      <h2 className="font-bold text-lg mb-4">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <button
            key={item.name}
            onClick={() => onMenuClick(item.name.toLowerCase())}
            className="flex items-center gap-2 p-2 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-200 hover:scale-[1.02] hover:shadow-md"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
