import { Link } from 'react-router-dom';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { HiOutlineArrowsRightLeft } from 'react-icons/hi2';
import { useCart } from '../../context/CartContext';

const FloatingActions = () => {
  const { cartCount } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Compare Button */}
      <Link
        to="/products"
        className="group relative flex flex-col items-center justify-center w-[60px] h-[60px] bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        title="Compare"
      >
        <HiOutlineArrowsRightLeft className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] font-semibold uppercase tracking-wide">Compare</span>
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          0
        </span>
      </Link>

      {/* Cart Button */}
      <Link
        to="/cart"
        className="group relative flex flex-col items-center justify-center w-[60px] h-[60px] bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        title="Cart"
      >
        <HiOutlineShoppingCart className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] font-semibold uppercase tracking-wide">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-subtle">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default FloatingActions;
