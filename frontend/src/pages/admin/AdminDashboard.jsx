import { useSearchParams } from 'react-router-dom';
import { HiOutlineCube, HiOutlineClipboardList, HiOutlineUsers, HiOutlineChartSquareBar } from 'react-icons/hi';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: HiOutlineChartSquareBar },
    { id: 'products', label: 'Products', icon: HiOutlineCube },
    { id: 'orders', label: 'Orders', icon: HiOutlineClipboardList },
    { id: 'users', label: 'Users', icon: HiOutlineUsers },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
            <HiOutlineChartSquareBar className="w-6 h-6" />
          </span>
          Admin Control Panel
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="glass-card p-4 sticky top-20">
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
                        ? 'bg-primary-500 text-gray-900 shadow-lg shadow-primary-500/25' 
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
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
          {activeTab === 'dashboard' && (
            <div className="glass-card p-8 text-center animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Admin Panel</h2>
              <p className="text-gray-500 mb-8">Manage your store's products and orders from the sidebar.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <button onClick={() => setTab('products')} className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-primary-500/50 transition-colors group">
                  <HiOutlineCube className="w-10 h-10 text-primary-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-gray-900 font-medium">Manage Products</p>
                </button>
                <button onClick={() => setTab('orders')} className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-accent-500/50 transition-colors group">
                  <HiOutlineClipboardList className="w-10 h-10 text-accent-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-gray-900 font-medium">Manage Orders</p>
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'products' && <div className="animate-fade-in"><AdminProducts /></div>}
          {activeTab === 'orders' && <div className="animate-fade-in"><AdminOrders /></div>}
          
          {activeTab === 'users' && <div className="animate-fade-in"><AdminUsers /></div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
