import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineSwitchHorizontal, HiOutlineShoppingCart, HiOutlineHeart, HiOutlineUser } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { cart } = useCart();
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const updateCompareCount = () => {
      try {
        const list = JSON.parse(localStorage.getItem('compareList') || '[]');
        setCompareCount(list.length);
      } catch (err) {
        setCompareCount(0);
      }
    };

    updateCompareCount();
    window.addEventListener('compareUpdated', updateCompareCount);
    return () => window.removeEventListener('compareUpdated', updateCompareCount);
  }, []);

  const navItems = [
    { icon: HiOutlineShoppingBag, label: 'Products', path: '/products' },
    { icon: HiOutlineSwitchHorizontal, label: 'Compare', path: '/compare', badge: compareCount },
    { icon: HiOutlineShoppingCart, label: 'Cart', path: '/cart', badge: cart?.length || 0 },
    { icon: HiOutlineHeart, label: 'Wishlist', path: user ? '/dashboard?tab=wishlist' : '/login?redirect=wishlist' },
    { icon: HiOutlineUser, label: 'Account', path: user ? '/dashboard' : '/login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-[56px] px-2">
        {navItems.map((item, index) => {
          const isActive = (() => {
            const [itemPathname, itemSearch] = item.path.split('?');
            
            if (itemSearch) {
              return location.pathname === itemPathname && location.search.includes(itemSearch);
            }
            
            if (itemPathname === '/dashboard') {
              return location.pathname === '/dashboard' && !location.search.includes('tab=wishlist');
            }
            
            if (itemPathname === '/login') {
              return location.pathname === '/login' && !location.search.includes('redirect=wishlist');
            }
            
            if (itemPathname !== '/') {
              return location.pathname.startsWith(itemPathname);
            }
            
            return location.pathname === '/';
          })();
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-[22px] h-[22px] ${isActive ? 'stroke-2' : ''}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
