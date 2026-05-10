import { Link } from 'react-router-dom';

const categories = [
  { name: 'Mobile', image: '/categories/mobile.png', path: '/products?category=Mobile' },
  { name: 'Laptop', image: '/categories/laptop.png', path: '/products?category=Laptop' },
  { name: 'Headphones', image: '/categories/headphones.png', path: '/products?category=Headphones' },
  { name: 'Smartwatch', image: '/categories/smartwatch.png', path: '/products?category=Smartwatch' },
  { name: 'Accessories', image: '/categories/accessories.png', path: '/products?category=Accessories' },
  // You can easily add more categories here later, e.g.:
  // { name: 'Gaming', image: '/categories/gaming.png', path: '/products?category=Gaming' },
];

const Categories = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-fade-in min-h-[70vh]">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">All Categories</h1>
        <p className="text-gray-500 max-w-md mx-auto">Explore our wide range of tech categories</p>
      </div>

      {/* Extensible standard grid instead of the home page asymmetric grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link key={cat.name} to={cat.path} className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-300">
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-90" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors drop-shadow-md">
                  {cat.name}
                </h3>
                <span className="text-white/90 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                  Shop Now &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
