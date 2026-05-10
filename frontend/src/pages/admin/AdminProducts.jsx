import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', price: '', originalPrice: '', stock: '', description: '', featured: false,
    images: '', ram: '', storage: '', processor: '', display: '', battery: ''
  });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get(`/products?limit=50${search ? `&search=${search}` : ''}`);
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/products/categories');
      setCategories(data);
      if (data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: data[0] }));
      }
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenModal = (product = null) => {
    setIsAddingCategory(false);
    setNewCategory('');
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name, brand: product.brand, category: product.category,
        price: product.price, originalPrice: product.originalPrice || '', stock: product.stock,
        description: product.description, featured: product.featured,
        images: product.images?.join(', ') || '',
        ram: product.specs?.ram || '', storage: product.specs?.storage || '',
        processor: product.specs?.processor || '', display: product.specs?.display || '',
        battery: product.specs?.battery || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', brand: '', category: categories[0] || '', price: '', originalPrice: '', stock: '', description: '', featured: false,
        images: '', ram: '', storage: '', processor: '', display: '', battery: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name, brand: formData.brand, category: isAddingCategory ? newCategory : formData.category,
      price: Number(formData.price), originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock), description: formData.description, featured: formData.featured,
      images: formData.images.split(',').map(i => i.trim()).filter(i => i),
      specs: {
        ram: formData.ram, storage: formData.storage, processor: formData.processor,
        display: formData.display, battery: formData.battery
      }
    };

    if (isAddingCategory && !newCategory.trim()) {
      return toast.error('Please enter a new category name');
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      setIsModalOpen(false);
      fetchProducts();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <HiOutlinePlus className="w-5 h-5" /> Add Product
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white/50 text-xs uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded bg-white object-cover" />
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4 font-medium text-primary-400">৳{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${p.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' : p.stock > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(p)} className="p-2 text-gray-500 hover:text-blue-400 bg-white rounded-lg transition-colors"><HiOutlinePencilAlt className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-500 hover:text-red-400 bg-white rounded-lg transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-50/80 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-3xl my-auto p-4 sm:p-8 animate-slide-down">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Brand *</label>
                  <input type="text" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category *</label>
                  {!isAddingCategory ? (
                    <div className="flex gap-2">
                      <select required value={formData.category} onChange={e => {
                        if (e.target.value === 'ADD_NEW') {
                          setIsAddingCategory(true);
                        } else {
                          setFormData({...formData, category: e.target.value});
                        }
                      }} className="input-field cursor-pointer flex-1">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="ADD_NEW" className="text-primary-600 font-bold">+ Add New Category</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" placeholder="Category Name" required value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input-field flex-1" autoFocus />
                      <button type="button" onClick={() => setIsAddingCategory(false)} className="px-3 text-sm text-gray-500 hover:text-red-500">Cancel</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price (৳) *</label>
                  <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Original Price (Optional ৳)</label>
                  <input type="number" min="0" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stock *</label>
                  <input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Description *</label>
                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field"></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Image URLs (comma separated)</label>
                <input type="text" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="input-field" placeholder="https://..., https://..." />
              </div>

              <div className="bg-white/50 p-4 rounded-xl border border-gray-200">
                <h4 className="text-gray-900 font-medium mb-4">Specifications (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs text-gray-500 mb-1">RAM</label><input type="text" value={formData.ram} onChange={e => setFormData({...formData, ram: e.target.value})} className="input-field" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Storage</label><input type="text" value={formData.storage} onChange={e => setFormData({...formData, storage: e.target.value})} className="input-field" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Processor</label><input type="text" value={formData.processor} onChange={e => setFormData({...formData, processor: e.target.value})} className="input-field" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Display</label><input type="text" value={formData.display} onChange={e => setFormData({...formData, display: e.target.value})} className="input-field" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Battery</label><input type="text" value={formData.battery} onChange={e => setFormData({...formData, battery: e.target.value})} className="input-field" /></div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-primary-500 bg-white border-gray-300 rounded focus:ring-primary-500/30" />
                      <span className="text-sm text-gray-600">Featured Product</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-white transition-colors">Cancel</button>
                <button type="submit" className="btn-primary !px-6 !py-2.5">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
