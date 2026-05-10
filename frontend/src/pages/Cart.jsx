import { Link } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus, HiOutlineArrowRight, HiOutlineShoppingCart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center">
            <HiOutlineShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products yet.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart <span className="text-gray-500 text-lg font-normal">({cartCount} items)</span></h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 transition-colors">Clear All</button>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="glass-card p-4 flex gap-4">
              <Link to={`/products/${item._id}`} className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-white">
                <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div><p className="text-xs text-primary-400 font-medium uppercase">{item.brand}</p><Link to={`/products/${item._id}`} className="text-sm font-semibold text-gray-900 hover:text-primary-400 line-clamp-1">{item.name}</Link></div>
                  <button onClick={() => removeFromCart(item._id)} className="p-1.5 text-gray-400 hover:text-red-400 flex-shrink-0"><HiOutlineTrash className="w-4 h-4" /></button>
                </div>
                <div className="flex items-end justify-between mt-3">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30"><HiOutlineMinus className="w-3.5 h-3.5" /></button>
                    <span className="w-8 text-center text-sm text-gray-900 font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 text-gray-500 hover:text-gray-900"><HiOutlinePlus className="w-3.5 h-3.5" /></button>
                  </div>
                  <p className="text-lg font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-20">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal ({cartCount} items)</span><span className="text-gray-700">৳{cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="text-emerald-400 font-medium">Free</span></div>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between"><span className="text-gray-900 font-semibold">Total</span><span className="text-xl font-bold text-gray-900">৳{cartTotal.toLocaleString()}</span></div>
            </div>
            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5">Proceed to Checkout <HiOutlineArrowRight className="w-4 h-4" /></Link>
            <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-primary-400 mt-4">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
