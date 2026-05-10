import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineShoppingCart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Compare = () => {
  const [compareList, setCompareList] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('compareList') || '[]');
    setCompareList(list);
    window.scrollTo(0, 0);
  }, []);

  const removeFromCompare = (id) => {
    const updated = compareList.filter(item => item._id !== id);
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
    window.dispatchEvent(new Event('compareUpdated'));
    toast.success('Removed from compare');
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem('compareList');
    window.dispatchEvent(new Event('compareUpdated'));
    toast.success('Compare list cleared');
  };

  if (compareList.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare Products</h2>
        <p className="text-gray-500 mb-8">You have no products in your compare list.</p>
        <Link to="/products" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors inline-block">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Compare Products</h1>
        <button onClick={clearCompare} className="text-red-500 hover:text-red-600 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto pb-6">
        <div className="flex gap-6 min-w-max">
          {compareList.map(product => (
            <div key={product._id} className="w-72 glass-card p-5 flex flex-col relative group transition-all duration-300 hover:shadow-lg">
              <button
                onClick={() => removeFromCompare(product._id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-gray-100"
                title="Remove"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
              
              <div className="aspect-square bg-white rounded-xl mb-4 overflow-hidden p-3 border border-gray-100">
                <img src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-full object-contain" />
              </div>
              
              <div className="flex-1">
                <p className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wider">{product.brand}</p>
                <Link to={`/products/${product.category}/${product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="text-base font-semibold text-gray-800 hover:text-primary-600 line-clamp-2 mb-3 h-12 leading-tight">
                  {product.name}
                </Link>
                <div className="text-xl font-bold text-gray-900 mb-5">
                  ৳{product.price.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rating</span>
                  <span className="font-medium text-gray-800">{product.rating} ({product.numReviews})</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200/60 pt-2">
                  <span className="text-gray-500">Stock</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                {/* Specifications */}
                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                  value && value !== 'N/A' && (
                    <div key={key} className="flex justify-between text-sm border-t border-gray-200/60 pt-2">
                      <span className="text-gray-500 capitalize">{key}</span>
                      <span className="font-medium text-gray-800 text-right max-w-[120px] truncate" title={value}>{value}</span>
                    </div>
                  )
                ))}
              </div>

              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium text-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <HiOutlineShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compare;
