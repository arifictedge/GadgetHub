import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineSwitchHorizontal, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

const UserDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [newName, setNewName] = useState('');

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return toast.error('Name cannot be empty');
    try {
      await api.put('/users/profile', { name: newName });
      toast.success('Profile updated successfully!');
      setEditingProfile(false);
      // Fast hard reload to sync context and navbar
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'orders') {
          const { data } = await api.get('/orders/my-orders');
          setOrders(data);
        } else if (activeTab === 'wishlist') {
          const { data } = await api.get('/users/wishlist');
          setWishlist(data);
        } else if (activeTab === 'compare') {
          const { data } = await api.get('/users/compare');
          setCompareList(data);
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const removeCompare = async (id) => {
    try {
      await api.put('/users/compare', { productId: id });
      setCompareList(compareList.filter(p => p._id !== id));
      toast.success('Removed from compare');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'shipped': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'delivered': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-600 bg-gray-100/50 border-gray-200';
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiOutlineUser },
    { id: 'orders', label: 'My Orders', icon: HiOutlineShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: HiOutlineHeart },
    { id: 'compare', label: 'Compare', icon: HiOutlineSwitchHorizontal },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="glass-card p-4 sticky top-20">
            <div className="flex items-center gap-4 mb-6 p-2">
              <div className="w-12 h-12 rounded-full  bg-primary-500 flex items-center justify-center text-gray-900 text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold">{user?.name}</h3>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' 
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 border border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="glass-card p-6 lg:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Account Details</h2>
                    {!editingProfile ? (
                      <button onClick={() => { setEditingProfile(true); setNewName(user?.name); }} className="text-sm bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl transition-colors border border-gray-300">
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setEditingProfile(false)} className="text-sm bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl transition-colors border border-gray-300">
                          Cancel
                        </button>
                        <button onClick={handleUpdateProfile} className="text-sm bg-primary-600 hover:bg-primary-500 text-gray-900 px-4 py-2 rounded-xl transition-colors">
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                      {editingProfile ? (
                        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field !py-3" autoFocus />
                      ) : (
                        <p className="text-gray-900 font-medium bg-white/50 px-4 py-3 rounded-xl border border-gray-200">{user?.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                      <p className="text-gray-900 font-medium bg-white/50 px-4 py-3 rounded-xl border border-gray-200 cursor-not-allowed opacity-70">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Account Role</label>
                      <p className="text-primary-400 font-medium bg-primary-500/10 px-4 py-3 rounded-xl border border-primary-500/20 uppercase text-sm tracking-wider w-max">{user?.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="glass-card p-8 text-center">
                      <HiOutlineShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-900 font-medium mb-2">No orders yet</p>
                      <Link to="/products" className="text-primary-400 hover:underline text-sm">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="glass-card p-6">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Order ID: <span className="font-mono text-gray-600">{order._id}</span></p>
                              <p className="text-sm text-gray-900 flex items-center gap-2">
                                <HiOutlineClock className="w-4 h-4 text-gray-500" />
                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                              {order.status}
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg bg-white object-cover" />
                                <div className="flex-1 min-w-0">
                                  <Link to={`/products/${item.productId?._id}`} className="text-sm text-gray-900 hover:text-primary-400 truncate block">{item.name}</Link>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-gray-600 text-sm">Total Amount</span>
                            <span className="text-lg font-bold text-gray-900">৳{order.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                  {wishlist.length === 0 ? (
                    <div className="glass-card p-8 text-center">
                      <HiOutlineHeart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-900 font-medium mb-2">Wishlist is empty</p>
                      <Link to="/products" className="text-primary-400 hover:underline text-sm">Explore Products</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* COMPARE TAB */}
              {activeTab === 'compare' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Compare Products</h2>
                  {compareList.length === 0 ? (
                    <div className="glass-card p-8 text-center">
                      <HiOutlineSwitchHorizontal className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-900 font-medium mb-2">No products to compare</p>
                      <Link to="/products" className="text-primary-400 hover:underline text-sm">Add Products</Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto pb-4">
                      <div className="inline-flex gap-4 min-w-full">
                        {/* Headers */}
                        <div className="w-32 flex-shrink-0 flex flex-col pt-48 gap-4 font-medium text-gray-500 text-sm">
                          <div className="h-10 flex items-center border-b border-gray-200">Brand</div>
                          <div className="h-10 flex items-center border-b border-gray-200">Price</div>
                          <div className="h-10 flex items-center border-b border-gray-200">Processor</div>
                          <div className="h-10 flex items-center border-b border-gray-200">RAM</div>
                          <div className="h-10 flex items-center border-b border-gray-200">Storage</div>
                          <div className="h-10 flex items-center border-b border-gray-200">Display</div>
                          <div className="h-10 flex items-center border-b border-gray-200">Battery</div>
                        </div>

                        {/* Products */}
                        {compareList.map((product) => (
                          <div key={product._id} className="w-64 flex-shrink-0 flex flex-col">
                            <div className="glass-card p-4 mb-4 relative">
                              <button onClick={() => removeCompare(product._id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-400 bg-white rounded-full p-1"><HiOutlineXCircle className="w-5 h-5"/></button>
                              <img src={product.images?.[0]} alt={product.name} className="w-full h-32 object-contain bg-white rounded-lg mb-3" />
                              <Link to={`/products/${product._id}`} className="text-sm font-semibold text-gray-900 hover:text-primary-400 line-clamp-2 h-10">{product.name}</Link>
                            </div>
                            
                            <div className="flex flex-col gap-4 text-sm text-gray-900">
                              <div className="h-10 flex items-center border-b border-gray-200">{product.brand}</div>
                              <div className="h-10 flex items-center border-b border-gray-200 font-bold text-primary-400">৳{product.price.toLocaleString()}</div>
                              <div className="h-10 flex items-center border-b border-gray-200 truncate pr-2" title={product.specs?.processor}>{product.specs?.processor || '-'}</div>
                              <div className="h-10 flex items-center border-b border-gray-200">{product.specs?.ram || '-'}</div>
                              <div className="h-10 flex items-center border-b border-gray-200">{product.specs?.storage || '-'}</div>
                              <div className="h-10 flex items-center border-b border-gray-200 truncate pr-2" title={product.specs?.display}>{product.specs?.display || '-'}</div>
                              <div className="h-10 flex items-center border-b border-gray-200">{product.specs?.battery || '-'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
