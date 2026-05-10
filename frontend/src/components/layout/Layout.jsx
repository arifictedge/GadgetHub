import Navbar from './Navbar';
import Footer from './Footer';
import FloatingActions from './FloatingActions';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Layout;
