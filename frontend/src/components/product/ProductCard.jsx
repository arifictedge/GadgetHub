import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineHeart, HiStar } from 'react-icons/hi';
import { MdCompareArrows } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.preventDefault();
    addToCart(product);
    navigate('/cart');
  };

  const handleCompare = (e) => {
    e.preventDefault();
    let compareList = [];
    try {
      compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    } catch (err) {
      compareList = [];
    }
    
    if (!compareList.find(item => item._id === product._id)) {
      compareList.push(product);
      localStorage.setItem('compareList', JSON.stringify(compareList));
      window.dispatchEvent(new Event('compareUpdated'));
      toast.success('Added to compare list');
    } else {
      toast.success('Already in compare list');
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group glass-card overflow-hidden hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 flex flex-col">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="relative block overflow-hidden aspect-square bg-white">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500/90 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-lg">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-gray-50/60 flex items-center justify-center">
            <span className="bg-white text-gray-600 text-sm font-bold px-4 py-2 rounded-xl">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wider">{product.brand}</p>
        <Link to={`/products/${product._id}`} className="text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <HiStar
                key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="text-lg font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="flex-1 flex items-center justify-center py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-transparent px-2"
          >
            Buy Now
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={product.stock === 0}
            className="p-2.5 flex-shrink-0 bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white rounded-xl border border-primary-200 hover:border-primary-600 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <HiOutlineShoppingCart className="w-5 h-5" />
          </button>

          <button
            onClick={handleCompare}
            className="p-2.5 flex-shrink-0 bg-white hover:bg-gray-50 text-gray-500 hover:text-primary-600 rounded-xl border border-gray-200 hover:border-primary-200 transition-colors shadow-sm"
            title="Compare"
          >
            <MdCompareArrows className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
