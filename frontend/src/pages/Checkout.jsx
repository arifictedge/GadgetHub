import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineUser, HiOutlineCash, HiOutlineCreditCard } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error('Your cart is empty');

    const items = cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    setLoading(true);
    try {
      await api.post('/orders', {
        items,
        shippingAddress,
        paymentMethod,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/dashboard?tab=orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No items to checkout</h2>
          <p className="text-gray-500 mb-6">Return to the shop to add some products.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Form */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HiOutlineLocationMarker className="w-5 h-5 text-primary-400" />
              Shipping Information
            </h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
                  <div className="relative">
                    <input type="text" name="name" value={shippingAddress.name} onChange={handleChange} required className="input-field pl-10" placeholder="John Doe" />
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleChange} required className="input-field pl-10" placeholder="+880 1XXX-XXXXXX" />
                    <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Street Address</label>
                <textarea name="address" value={shippingAddress.address} onChange={handleChange} required rows="2" className="input-field" placeholder="House/Apt, Road, Block"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">City</label>
                <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} required className="input-field" placeholder="Dhaka" />
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HiOutlineCreditCard className="w-5 h-5 text-primary-400" />
              Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-primary-500/10 border-primary-500' : 'bg-white border-gray-300 hover:border-gray-300'}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-primary-500 bg-white border-gray-300 focus:ring-primary-500/30" />
                <div className="flex items-center gap-2 text-gray-900">
                  <HiOutlineCash className="w-5 h-5 text-emerald-400" />
                  <span>Cash on Delivery</span>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'online' ? 'bg-primary-500/10 border-primary-500' : 'bg-white border-gray-300 hover:border-gray-300'}`}>
                <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} disabled className="w-4 h-4 text-primary-500 bg-white border-gray-300 focus:ring-primary-500/30" />
                <div className="flex items-center gap-2 text-gray-500">
                  <HiOutlineCreditCard className="w-5 h-5 text-gray-400" />
                  <span>Online Payment (Coming Soon)</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-20">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-4 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-200">
                    <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-primary-400 mt-0.5">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700">৳{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">Total</span>
                <span className="text-xl font-bold text-gray-900">৳{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" disabled={loading} className="btn-primary w-full !py-3.5 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Processing...
                </span>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
