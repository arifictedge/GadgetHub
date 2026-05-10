import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import api from '../lib/api';
import ProductCard from '../components/product/ProductCard';

const categories = [
  { name: 'Mobile', image: '/categories/mobile.png', path: '/products?category=Mobile' },
  { name: 'Laptop', image: '/categories/laptop.png', path: '/products?category=Laptop' },
  { name: 'Headphones', image: '/categories/headphones.png', path: '/products?category=Headphones' },
  { name: 'Smartwatch', image: '/categories/smartwatch.png', path: '/products?category=Smartwatch' },
  { name: 'Accessories', image: '/categories/accessories.png', path: '/products?category=Accessories' },
];

const heroBanners = [
  { id: 1, image: '/banners/hero1.png', title: 'Discover the Future of Technology', subtitle: 'Shop the latest gadgets at unbeatable prices', cta: 'Shop Now', link: '/products' },
  { id: 2, image: '/banners/hero2.png', title: 'Premium Tech Collection', subtitle: 'Laptops, headphones & smartwatches for every lifestyle', cta: 'Explore', link: '/products?featured=true' },
  { id: 3, image: '/banners/hero3.png', title: 'Gaming Gear Sale', subtitle: 'Up to 40% off on gaming accessories', cta: 'Shop Deals', link: '/products?sort=price_asc' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, trendingRes] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/products?sort=rating&limit=8'),
        ]);
        setFeatured(featuredRes.data.products);
        setTrending(trendingRes.data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-advance hero slider
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="animate-fade-in">
      {/* ===== HERO BANNER SLIDER ===== */}
      <section className="relative">
        <div className="hero-slider" style={{ height: 'clamp(280px, 45vw, 520px)' }}>
          {heroBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              {/* Text overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
                      {banner.title}
                    </h1>
                    <p className="text-white/80 text-sm md:text-base lg:text-lg mb-6 max-w-md">
                      {banner.subtitle}
                    </p>
                    <Link
                      to={banner.link}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-primary-600/30"
                    >
                      {banner.cta} <HiOutlineArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="hero-indicators">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY (Image Grid) ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-gray-500 max-w-md mx-auto">Find exactly what you need from our curated collections</p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.path} className="category-card">
              <img src={cat.image} alt={cat.name} loading="lazy" />
              <div className="category-overlay">
                <span className="category-name">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md uppercase tracking-wider text-sm"
          >
            View All Categories
          </Link>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-500">Handpicked top-rated gadgets</p>
          </div>
          <Link to="/products?featured=true" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-xl mb-4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ===== DEALS BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl  bg-primary-600 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-primary-200 text-sm font-medium uppercase tracking-wider">Limited Time Offer</span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">Up to 40% Off</h3>
              <p className="text-primary-100/70 max-w-md">Grab the best deals on smartphones, laptops, and accessories before they're gone.</p>
            </div>
            <Link to="/products?sort=price_asc" className="whitespace-nowrap px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
              Shop Deals →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TRENDING PRODUCTS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Now</h2>
            <p className="text-gray-500">Most popular products this week</p>
          </div>
          <Link to="/products?sort=rating" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Stay in the Loop</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Get notified about new products, exclusive deals, and tech news.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input type="email" placeholder="Enter your email" className="input-field flex-1 text-center sm:text-left" />
            <button type="submit" className="btn-primary whitespace-nowrap !px-8">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
