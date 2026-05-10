import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineViewGrid, HiOutlineHeart } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const categoryLinks = [
  { name: 'Mobile', path: '/products?category=Mobile' },
  { name: 'Laptop', path: '/products?category=Laptop' },
  { name: 'Headphones', path: '/products?category=Headphones' },
  { name: 'Smartwatch', path: '/products?category=Smartwatch' },
  { name: 'Accessories', path: '/products?category=Accessories' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    navigate('/');
  };

  const tickerText = 'New Arrivals Every Week!';

  return (
    <>
      {/* ===== ANNOUNCEMENT TICKER ===== */}
      {isHomePage && (
        <div className="bg-primary-600 text-white overflow-hidden flex whitespace-nowrap select-none h-8 items-center group">
          <div className="custom-marquee-scroll group-hover:pause-marquee flex shrink-0 w-max">
            {[...Array(15)].map((_, i) => (
              <span key={`ticker-1-${i}`} className="text-xs font-medium tracking-wide px-8">
                {tickerText}
              </span>
            ))}
          </div>
          <div className="custom-marquee-scroll group-hover:pause-marquee flex shrink-0 w-max" aria-hidden="true">
            {[...Array(15)].map((_, i) => (
              <span key={`ticker-2-${i}`} className="text-xs font-medium tracking-wide px-8">
                {tickerText}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===== MAIN NAVBAR (Top Row) ===== */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        {/* Top Row: Logo + Search + Icons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side: Logo + Nav Links */}
            <div className="flex items-center gap-8 shrink-0">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-1 group">
                <span className="text-2xl font-bold gradient-text group-hover:opacity-80 transition-opacity">Gadget<span className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">Hub</span></span>

              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  All Products
                </Link>

                {/* Categories Dropdown */}
                <div className="relative group">
                  <Link to="/categories" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-6">
                    Categories
                  </Link>
                  <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left -translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                    {categoryLinks.map((cat) => (
                      <Link
                        key={cat.name}
                        to={cat.path}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 focus:bg-white transition-all"
                />
                <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors">
                  Search
                </button>
              </div>
            </form>

            {/* Right Icons - Desktop */}
            <div className="hidden md:flex items-center gap-1">

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
                <HiOutlineShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline font-medium">{user.name.split(' ')[0]}</span>
                  </button>

                  {userDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserDropdown(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-slide-down overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                            <HiOutlineViewGrid className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link to="/dashboard?tab=wishlist" onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                            <HiOutlineHeart className="w-4 h-4" /> Wishlist
                          </Link>
                          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <HiOutlineLogout className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-sm !px-4 !py-2">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Link to="/cart" className="relative p-2 text-gray-600">
                <HiOutlineShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-600 hover:text-gray-900">
                {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>



        {/* ===== MOBILE MENU ===== */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 px-4 bg-white animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </form>

            {/* Category links in mobile */}
            <div className="mb-3 pb-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Categories</p>
              {categoryLinks.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <Link to="/products" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium">All Products</Link>
              {user ? (
                <>
                  <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">Login / Register</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
