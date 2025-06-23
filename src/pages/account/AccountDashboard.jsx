import { NavLink, Outlet } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaShoppingCart,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { useGetUserProfileQuery } from "../../slices/usersApiSlice";

const navItems = [
  { label: "Profile", path: "profile", icon: <FaUser /> },
  { label: "Requests", path: "requests", icon: <FaClipboardList /> },
  { label: "Orders", path: "orders", icon: <FaShoppingCart /> },
  { label: "Invoices", path: "invoices", icon: <FaFileInvoiceDollar /> },
];

const AccountDashboard = () => {
  const { data: user, isLoading, error } = useGetUserProfileQuery();

  const greeting =
    isLoading
      ? "Hi..."
      : error
      ? "Hi there!"
      : `${user?.name?.split(" ")[0] || "Hello"} 👋`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col p-6">
        <h2 className="text-xl font-bold mb-6 text-center text-purple-500 rounded">
          {greeting}
        </h2>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
                ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 pb-16 md:pb-0 p-6 md:p-10 bg-white rounded-tl-2xl shadow-inner">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 md:hidden bg-white border-t border-gray-200 shadow-sm flex justify-around py-2">
        {navItems.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition ${
                isActive ? "text-purple-600" : "text-gray-500"
              }`
            }
          >
            <div className="text-lg">{icon}</div>
            <span className="text-[11px]">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AccountDashboard;
