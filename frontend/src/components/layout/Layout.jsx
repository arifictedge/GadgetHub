import Navbar from './Navbar';
import Footer from './Footer';
import FloatingActions from './FloatingActions';
import MobileBottomNav from './MobileBottomNav';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
