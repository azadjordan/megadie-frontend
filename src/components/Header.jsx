import { useRef, useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaStore } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { clearCart } from "../slices/cartSlice";
import { USERS_URL } from "../constants.js";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const { totalQuantity } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (totalQuantity > 0) {
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
    }
  }, [totalQuantity]);

  // ✅ Close menu on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  // ✅ Logout handler
  const logoutHandler = () => {
    fetch(`${USERS_URL}/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      dispatch(logout());
      dispatch(clearCart());
      navigate("/");
      setMenuOpen(false); // ✅ Close mobile menu after logout
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-3xl font-extrabold text-purple-500 hover:text-purple-600 transition">
          Megadie.com
        </Link>

        {/* ✅ Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks userInfo={userInfo} totalQuantity={totalQuantity} bounce={bounce} onLogout={logoutHandler} />
        </div>

        {/* ✅ Mobile Menu Button */}
<div className="md:hidden relative">
  <button
    className="text-gray-600 text-3xl"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
  </button>

  {totalQuantity > 0 && (
    <span
      key={totalQuantity}
      className={`absolute -top-3 -right-3 bg-purple-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full 
      transition-transform transform scale-100 ${bounce ? "animate-bounce" : ""}`}
    >
      {totalQuantity}
    </span>
  )}
</div>

      </nav>

      {/* ✅ Mobile Sidebar Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden fixed top-0 right-0 w-2/3 h-full bg-white shadow-lg transition-transform duration-300"
        >
          <button
            className="cursor-pointer absolute top-4 right-4 text-gray-600 text-3xl hover:text-red-500"
            onClick={() => setMenuOpen(false)}
          >
            <FaTimes size={28} />
          </button>
          <div className="p-8 space-y-6">
            <NavLinks
              userInfo={userInfo}
              totalQuantity={totalQuantity}
              bounce={bounce}
              onLogout={logoutHandler}
              mobile
              onClick={() => setMenuOpen(false)} // ✅ Close on link click
            />
          </div>
        </div>
      )}
    </header>
  );
};

// ✅ Navigation Links
const NavLinks = ({ mobile, onClick, userInfo, totalQuantity, bounce, onLogout }) => {
  const firstName = userInfo?.name?.split(" ")[0] || "Account";

  return (
    <div className={`flex ${mobile ? "flex-col space-y-6" : "space-x-9"}`}>
      <NavLink to="/shop" className={navLinkClass} onClick={onClick}>
        <FaStore size={24} /> Shop
      </NavLink>

      <NavLink to="/cart" className={navLinkClass} onClick={onClick} style={{ position: "relative" }}>
        <div className="relative flex items-center">
          <FaShoppingCart size={24} />
          {totalQuantity > 0 && (
            <span
              key={totalQuantity}
              className={`absolute -top-2.5 -right-2.5 bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full 
              transition-transform transform scale-100 ${bounce ? "animate-bounce" : ""}`}
            >
              {totalQuantity}
            </span>
          )}
        </div>
        <span>Cart</span>
      </NavLink>

      {userInfo ? (
        <>
          <NavLink to="/account" className={navLinkClass} onClick={onClick}>
            <FaUser size={22} /> {firstName}
          </NavLink>

          <button
            onClick={() => {
              onLogout(); // ✅ Also closes mobile menu from inside logoutHandler
            }}
            className={`${navLinkBase} text-red-300 hover:text-red-600 transition`}
          >
            <FaSignOutAlt size={22} /> Logout
          </button>
        </>
      ) : (
        <NavLink to="/login" className={navLinkClass} onClick={onClick}>
          <FaUser size={20} /> Sign In
        </NavLink>
      )}
    </div>
  );
};

// ✅ Styles
const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 font-medium transition relative ${
    isActive ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-500"
  }`;

const navLinkBase = "flex items-center gap-2 font-medium transition cursor-pointer";

export default Header;
