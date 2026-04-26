import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Products from './pages/Products';
import CartPage from './pages/CartPage';
import Services from './pages/Services';
import About from './pages/About';
import Login from './pages/Login';
import Footer from './components/Footer';
import { CartItem, Product } from './types';

// App Component with Routing
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
        
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/produk" element={<Products addToCart={addToCart} />} />
            <Route path="/keranjang" element={<CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
            <Route path="/layanan" element={<Services />} />
            <Route path="/tentang-kami" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
        
        {/* WhatsApp Floating Button */}
        <a 
          href="https://wa.me/628123456789" 
          target="_blank" 
          rel="no-referrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
          id="whatsapp-btn"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
        </a>
      </div>
    </Router>
  );
}

function Navbar({ cartCount, onToggleMenu }: { cartCount: number; onToggleMenu: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
    { name: 'Produk', path: '/produk' },
    { name: 'Layanan', path: '/layanan' },
    { name: 'Kontak', path: '#' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-brand-blue p-2 rounded-lg">
            <ShoppingCart className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-brand-dark tracking-tight">BAKUL OLI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`hover:text-brand-blue transition-colors ${location.pathname === link.path ? 'text-brand-blue font-bold border-b-2 border-brand-yellow pb-1' : 'text-gray-600'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-brand-blue">
            <Search className="w-5 h-5" />
          </button>
          <Link to="/keranjang" className="relative p-2 text-gray-600 hover:text-brand-blue">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/login" className="hidden md:block bg-brand-yellow px-6 py-2 rounded-lg font-bold text-sm hover:brightness-105 shadow-sm text-brand-dark">
            Masuk
          </Link>
          <button onClick={onToggleMenu} className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
