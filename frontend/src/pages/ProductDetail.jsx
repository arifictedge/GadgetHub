import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiStar, HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiOutlineSwitchHorizontal, HiOutlineMinus, HiOutlinePlus, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSelectedImage(0);
        setQuantity(1);
        // Fetch related
        const relRes = await api.get(`/products?category=${data.category}&limit=4`);
        setRelated(relRes.data.products.filter(p => p._id !== data._id).slice(0, 4));
        // Check wishlist
        if (isAuthenticated) {
          try {
            const meRes = await api.get('/auth/me');
            setInWishlist(meRes.data.wishlist?.some(w => w._id === data._id));
          } catch {}
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    try {
      const { data } = await api.put('/users/wishlist', { productId: product._id });
      setInWishlist(!inWishlist);
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  const handleCompare = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    try {
      const { data } = await api.put('/users/compare', { productId: product._id });
      toast.success(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const discount = product?.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-white rounded-2xl" />
        <div className="space-y-4"><div className="h-6 bg-white rounded w-1/3" /><div className="h-8 bg-white rounded w-3/4" /><div className="h-6 bg-white rounded w-1/2" /><div className="h-40 bg-white rounded" /></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-[50vh] flex items-center justify-center"><div className="text-center"><p className="text-4xl mb-4">😕</p><h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2><Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link></div></div>
  );

  const specs = [
    { label: 'Processor', value: product.specs?.processor },
    { label: 'RAM', value: product.specs?.ram },
    { label: 'Storage', value: product.specs?.storage },
    { label: 'Display', value: product.specs?.display },
    { label: 'Battery', value: product.specs?.battery },
    { label: 'OS', value: product.specs?.os },
  ].filter(s => s.value && s.value !== 'N/A');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/products" className="hover:text-primary-400 flex items-center gap-1"><HiOutlineArrowLeft className="w-4 h-4" /> Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-primary-400">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square bg-white/50 rounded-2xl overflow-hidden border border-gray-200 mb-4">
            <img src={product.images?.[selectedImage] || product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
            {discount > 0 && <span className="absolute top-4 left-4 bg-red-500 text-gray-900 text-sm font-bold px-3 py-1.5 rounded-xl">-{discount}%</span>}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-gray-200 hover:border-gray-300'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-2">{product.brand}</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{[1,2,3,4,5].map(s => <HiStar key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-dark-600'}`} />)}</div>
            <span className="text-gray-500 text-sm">{product.rating} ({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
            )}
            {discount > 0 && <span className="badge-success">Save {discount}%</span>}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 10 ? <span className="badge-success">In Stock</span>
            : product.stock > 0 ? <span className="badge-warning">Only {product.stock} left</span>
            : <span className="badge-danger">Out of Stock</span>}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-gray-500 hover:text-gray-900"><HiOutlineMinus className="w-4 h-4" /></button>
              <span className="w-12 text-center text-gray-900 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 text-gray-500 hover:text-gray-900"><HiOutlinePlus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => addToCart(product, quantity)} disabled={product.stock === 0} className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2 disabled:opacity-40">
              <HiOutlineShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>

          {/* Wishlist & Compare */}
          <div className="flex gap-3 mb-8">
            <button onClick={handleWishlist} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${inWishlist ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}>
              {inWishlist ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
              {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
            <button onClick={handleCompare} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all">
              <HiOutlineSwitchHorizontal className="w-5 h-5" /> Compare
            </button>
          </div>

          {/* Specs Table */}
          {specs.length > 0 && (
            <div className="glass-card overflow-hidden">
              <h3 className="px-5 py-3 text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 bg-white/50">Specifications</h3>
              <div className="divide-y divide-dark-700/30">
                {specs.map((spec, i) => (
                  <div key={i} className="flex px-5 py-3">
                    <span className="w-1/3 text-sm text-gray-500">{spec.label}</span>
                    <span className="flex-1 text-sm text-gray-800 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
