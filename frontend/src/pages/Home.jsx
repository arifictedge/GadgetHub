import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import api from '../lib/api';
import ProductCard from '../components/product/ProductCard';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  const [categoryProducts, setCategoryProducts] = useState({});
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

        // Fetch products for each category
        const categoryRequests = categories.map(cat => 
          api.get(`/products?category=${cat.name}&limit=4`)
        );
        const categoryResponses = await Promise.all(categoryRequests);
        const catData = {};
        categories.forEach((cat, index) => {
          catData[cat.name] = categoryResponses[index].data.products;
        });
        setCategoryProducts(catData);
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

          {/* Right Banners Stack (Responsive Grid/Flex) */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-6 h-auto lg:h-[480px]">

            {/* Top Right Banner - Premium Tech */}
            <Link to="/products?category=Smartwatch" className="relative rounded-2xl overflow-hidden shadow-sm group bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 lg:p-6 xl:p-8 min-h-[140px] lg:flex-1">
              <div className="relative z-10">
                <span className="inline-block px-2 sm:px-3 py-1 bg-primary-500/20 text-primary-400 text-[10px] sm:text-xs font-bold rounded-full mb-1 sm:mb-2 border border-primary-500/30">Limited Offer</span>
                <h3 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white leading-tight mb-1">Elite Series<br className="hidden sm:block lg:block" />Smartwatches</h3>
                <p className="hidden sm:block text-gray-400 text-xs sm:text-sm font-medium">Up to 30% off today</p>
              </div>
              <div className="hidden sm:flex lg:flex relative z-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/5 rounded-full items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {/* Background Decoration */}
              <div className="absolute -top-12 -right-12 w-32 h-32 lg:w-40 lg:h-40 bg-primary-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
            </Link>

            {/* Bottom Right Banner - Gaming Gear */}
            <Link to="/products?category=Accessories" className="relative rounded-2xl overflow-hidden shadow-sm group bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 lg:p-6 xl:p-8 min-h-[140px] lg:flex-1">
              <div className="relative z-10">
                <span className="inline-block px-2 sm:px-3 py-1 bg-white/20 text-white text-[10px] sm:text-xs font-bold rounded-full mb-1 sm:mb-2 border border-white/30">Pro Gaming</span>
                <h3 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white leading-tight mb-1">Mechanical<br className="hidden sm:block lg:block" />Keyboards</h3>
                <p className="hidden sm:block text-blue-100 text-xs sm:text-sm font-medium">Level up your setup</p>
              </div>
              <div className="hidden sm:flex lg:flex relative z-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 rounded-full items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              {/* Background Decoration */}
              <div className="absolute -bottom-12 -left-12 w-32 h-32 lg:w-40 lg:h-40 bg-white/10 rounded-full blur-2xl"></div>
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
            {[1, 2, 3, 4].map(i => (
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

      {/* ===== TRENDING PRODUCTS SLIDER ===== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Trending Now</h2>
            <p className="text-gray-500">Most popular products this week</p>
          </div>
          <Link to="/products?sort=rating" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-2 transition-colors group">
            View All <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative group px-4 sm:px-0">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-trending',
                prevEl: '.swiper-button-prev-trending',
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="trending-slider pb-14 !px-1"
            >
              {trending.map((product) => (
                <SwiperSlide key={product._id} className="h-auto">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-trending absolute left-0 lg:-left-6 top-[40%] -translate-y-1/2 z-20 w-11 h-11 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer disabled:hidden">
              <HiOutlineChevronLeft className="w-6 h-6" />
            </button>
            <button className="swiper-button-next-trending absolute right-0 lg:-right-6 top-[40%] -translate-y-1/2 z-20 w-11 h-11 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer disabled:hidden">
              <HiOutlineChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </section>

      {/* ===== CATEGORY PRODUCT SECTIONS ===== */}
      {!loading && categories.map((cat) => {
        const products = categoryProducts[cat.name] || [];
        if (products.length === 0) return null;
        
        return (
          <section key={cat.name} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{cat.name}</h2>
                <p className="text-gray-500">Premium gadgets from our {cat.name} collection</p>
              </div>
              <Link to={cat.path} className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-2 transition-colors group">
                Explore All <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        );
      })}

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
