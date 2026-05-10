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
      {/* ===== HERO BANNER GRID ===== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Main Left Slider (Spans 8 cols on desktop) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-sm h-[320px] sm:h-[400px] lg:h-[480px]">
            <div className="hero-slider h-full">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                    <div className="px-8 sm:px-12 w-full">
                      <div className="max-w-lg">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                          {banner.title}
                        </h1>
                        <p className="text-white/90 text-sm md:text-base lg:text-lg mb-8 max-w-md">
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
              <div className="hero-indicators pb-4">
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
          </div>

          {/* Right Banners Stack (Spans 4 cols on desktop, 2 cols on mobile) */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-6 h-auto lg:h-[480px]">
            
            {/* Top Right Banner - App Download */}
            <Link to="#" className="relative rounded-2xl overflow-hidden shadow-sm group bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 lg:p-6 xl:p-8 min-h-[140px] lg:flex-1">
              <div className="relative z-10">
                <span className="inline-block px-2 sm:px-3 py-1 bg-white/20 text-white text-[10px] sm:text-xs font-bold rounded-full mb-1 sm:mb-2 border border-white/30">Get The App</span>
                <h3 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white leading-tight mb-1">Download<br className="hidden sm:block lg:block" />Our App</h3>
                <p className="hidden sm:block text-orange-100 text-xs sm:text-sm font-medium">Get exclusive mobile offers</p>
              </div>
              <div className="hidden sm:flex lg:flex relative z-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 rounded-full items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Background Decoration */}
              <div className="absolute -top-12 -right-12 w-32 h-32 lg:w-40 lg:h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>
            </Link>

            {/* Bottom Right Banner - AC Calculator */}
            <Link to="#" className="relative rounded-2xl overflow-hidden shadow-sm group bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 lg:p-6 xl:p-8 min-h-[140px] lg:flex-1">
              <div className="relative z-10">
                <span className="inline-block px-2 sm:px-3 py-1 bg-yellow-400/20 text-yellow-300 text-[10px] sm:text-xs font-bold rounded-full mb-1 sm:mb-2 border border-yellow-400/30">Smart Tools</span>
                <h3 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white leading-tight mb-1">AC Ton<br className="hidden sm:block lg:block" />Calculator</h3>
                <p className="hidden sm:block text-blue-200 text-xs sm:text-sm font-medium">Find perfect AC</p>
              </div>
              <div className="hidden sm:flex lg:flex relative z-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 rounded-full items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              {/* Background Decoration */}
              <div className="absolute -bottom-12 -left-12 w-32 h-32 lg:w-40 lg:h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
              <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-black/10 to-transparent"></div>
            </Link>

          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY (Image Grid) ===== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
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
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
