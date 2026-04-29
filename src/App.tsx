import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CartPage from "./pages/CartPage";
import Services from "./pages/Services";
import About from "./pages/About";
import Login from "./pages/Login";
import Daftar from "./pages/Daftar";
import { useCart } from "./hooks/useCart";

export default function App() {
  const { cart, cartCount, addToCart, removeFromCart, updateQuantity } =
    useCart();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar cartCount={cartCount} />

        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route
              path="/produk"
              element={<Products addToCart={addToCart} />}
            />
            <Route
              path="/keranjang"
              element={
                <CartPage
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              }
            />
            <Route path="/layanan" element={<Services />} />
            <Route path="/tentang-kami" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Daftar" element={<Daftar />} />
          </Routes>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}
