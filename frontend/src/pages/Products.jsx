import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineFilter, HiOutlineX, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineViewGrid, HiOutlineViewList } from 'react-icons/hi';
import api from '../lib/api';
import ProductCard from '../components/product/ProductCard';

const categoryList = ['Mobile', 'Laptop', 'Accessories', 'Headphones', 'Smartwatch'];
const brandList = ['Samsung', 'Apple', 'Google', 'OnePlus', 'Xiaomi', 'Sony', 'Dell', 'ASUS', 'Lenovo', 'HP', 'Bose', 'JBL', 'Logitech', 'Anker', 'Garmin', 'Amazfit', 'Nothing', 'Realme', 'Acer', 'Microsoft', 'Keychron', 'Noise'];
const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB', '36GB'];
const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name_asc', label: 'Name: A-Z' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Filter state from URL
  const filters = {
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    ram: searchParams.get('ram') || '',
    storage: searchParams.get('storage') || '',
    rating: searchParams.get('rating') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || '1',
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const toggleArrayFilter = (key, value) => {
    const current = filters[key] ? filters[key].split(',') : [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated.join(','));
  };

  const clearFilters = () => setSearchParams({});
  const hasFilters = filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.ram || filters.storage || filters.rating || filters.search;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
        params.set('limit', '12');
        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams.toString()]);

  const activeCategories = filters.category ? filters.category.split(',') : [];
  const activeBrands = filters.brand ? filters.brand.split(',') : [];
  const activeRam = filters.ram ? filters.ram.split(',') : [];
  const activeStorage = filters.storage ? filters.storage.split(',') : [];

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search result indicator */}
      {filters.search && (
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3">
          <p className="text-sm text-primary-400">Results for: <span className="font-semibold text-gray-900">"{filters.search}"</span></p>
        </div>
      )}

      {/* Category */}
      <div>
        <h3 className="text-gray-900 font-semibold text-sm mb-3 uppercase tracking-wider">Category</h3>
        <div className="space-y-2">
          {categoryList.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={activeCategories.includes(cat)} onChange={() => toggleArrayFilter('category', cat)}
                className="w-4 h-4 rounded border-gray-300 bg-white text-primary-500 focus:ring-primary-500/30" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-gray-900 font-semibold text-sm mb-3 uppercase tracking-wider">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
          {brandList.map((b) => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={activeBrands.includes(b)} onChange={() => toggleArrayFilter('brand', b)}
                className="w-4 h-4 rounded border-gray-300 bg-white text-primary-500 focus:ring-primary-500/30" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-gray-900 font-semibold text-sm mb-3 uppercase tracking-wider">Price Range (৳)</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="input-field !py-2 text-sm w-1/2" />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="input-field !py-2 text-sm w-1/2" />
        </div>
      </div>

      {/* RAM */}
      <div>
        <h3 className="text-gray-900 font-semibold text-sm mb-3 uppercase tracking-wider">RAM</h3>
        <div className="flex flex-wrap gap-2">
          {ramOptions.map((r) => (
            <button key={r} onClick={() => toggleArrayFilter('ram', r)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${activeRam.includes(r) ? 'bg-primary-50 border-primary-300 text-primary-600 font-semibold' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div>
        <h3 className="text-gray-900 font-semibold text-sm mb-3 uppercase tracking-wider">Storage</h3>
        <div className="flex flex-wrap gap-2">
          {storageOptions.map((s) => (
            <button key={s} onClick={() => toggleArrayFilter('storage', s)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${activeStorage.includes(s) ? 'bg-primary-50 border-primary-300 text-primary-600 font-semibold' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-gray-900 font-semibold text-sm mb-3 uppercase tracking-wider">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => updateFilter('rating', filters.rating === String(r) ? '' : String(r))}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all ${filters.rating === String(r) ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}>
              <span>{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button onClick={clearFilters} className="w-full py-2.5 text-sm text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {filters.search ? `Search: "${filters.search}"` : filters.category ? filters.category.replace(',', ', ') : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile filter button */}
          <button onClick={() => setMobileFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <HiOutlineFilter className="w-4 h-4" /> Filters
          </button>
          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-xl p-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-500 hover:text-gray-900'}`}>
              <HiOutlineViewGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-500 hover:text-gray-900'}`}>
              <HiOutlineViewList className="w-4 h-4" />
            </button>
          </div>
          {/* Sort */}
          <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
            className="input-field !py-2 !w-auto text-sm !pr-8 cursor-pointer">
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeCategories.map(c => (
            <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg text-xs font-semibold text-primary-600">
              {c} <button onClick={() => toggleArrayFilter('category', c)} className="hover:text-primary-800"><HiOutlineX className="w-3 h-3" /></button>
            </span>
          ))}
          {activeBrands.map(b => (
            <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-50 border border-accent-200 rounded-lg text-xs font-semibold text-accent-600">
              {b} <button onClick={() => toggleArrayFilter('brand', b)} className="hover:text-accent-800"><HiOutlineX className="w-3 h-3" /></button>
            </span>
          ))}
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-xs text-gray-600">
              "{filters.search}" <button onClick={() => updateFilter('search', '')} className="hover:text-gray-900"><HiOutlineX className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="glass-card p-5 sticky top-20">
            <FilterContent />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilters && (
          <>
            <div className="fixed inset-0 bg-gray-50/80 z-50 lg:hidden" onClick={() => setMobileFilters(false)} />
            <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden overflow-y-auto p-6 animate-slide-down">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button onClick={() => setMobileFilters(false)} className="p-2 text-gray-500 hover:text-gray-900"><HiOutlineX className="w-5 h-5" /></button>
              </div>
              <FilterContent />
            </div>
          </>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="glass-card p-4 animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-xl mb-4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => updateFilter('page', String(pagination.current - 1))} disabled={pagination.current <= 1}
                className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <HiOutlineChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).slice(Math.max(0, pagination.current - 3), pagination.current + 2).map((p) => (
                <button key={p} onClick={() => updateFilter('page', String(p))}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${p === pagination.current ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => updateFilter('page', String(pagination.current + 1))} disabled={pagination.current >= pagination.pages}
                className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <HiOutlineChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
