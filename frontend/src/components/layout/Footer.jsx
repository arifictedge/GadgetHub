import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold gradient-text">Gadget</span>
              <span className="text-2xl font-bold text-gray-900">Hub</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Your one-stop destination for the latest electronics and gadgets. Quality products, competitive prices.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-400 hover:border-primary-500/50 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'All Products', to: '/products' },
                { label: 'Mobiles', to: '/products?category=Mobile' },
                { label: 'Laptops', to: '/products?category=Laptop' },
                { label: 'Headphones', to: '/products?category=Headphones' },
                { label: 'Smartwatches', to: '/products?category=Smartwatch' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 hover:text-primary-400 text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Account</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'My Dashboard', to: '/dashboard' },
                { label: 'My Orders', to: '/dashboard?tab=orders' },
                { label: 'Wishlist', to: '/dashboard?tab=wishlist' },
                { label: 'Cart', to: '/cart' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 hover:text-primary-400 text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h3>
            <p className="text-gray-500 text-sm mb-4">Subscribe for the latest deals and product launches.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <div className="relative flex-1">
                <input type="email" placeholder="your@email.com" className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <button type="submit" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-gray-900 text-sm font-medium rounded-xl transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} GadgetHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
