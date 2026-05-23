"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Menu,
  User,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/src/lib/CartContext";

const NAV_LINKS = [
  { name: "Beranda", path: "/" },
  { name: "Tentang Kami", path: "/tentang-kami" },
  { name: "Produk", path: "/produk" },
  { name: "Layanan", path: "/layanan" },
  { name: "Kontak", path: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { cartCount, animateCart } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // CHECK LOGIN
  const checkLoginStatus = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  };

  useEffect(() => {
    checkLoginStatus();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // LOGOUT
  const handleLogout = async () => {
    // Bersihkan local state client
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);

    // Hapus cookie auth di server (httpOnly)
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // abaikan error, tetap redirect
    }

    router.push("/");
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <motion.img
            whileHover={{ rotate: -10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            src="/assets/Logo.png"
            alt="Logo"
            className="w-10 h-10"
          />

          <span className="text-2xl font-extrabold tracking-tight text-brand-dark">
            BAKUL OLI
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`relative transition-all ${
                pathname === link.path
                  ? "text-brand-yellow font-bold"
                  : "text-gray-600 hover:text-brand-yellow"
              }`}
            >
              {link.name}

              {pathname === link.path && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute left-0 right-0 -bottom-2 h-[3px] rounded-full bg-brand-yellow"
                />
              )}
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="p-2 text-gray-600 hover:text-brand-yellow focus:outline-none transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  /* Class 'absolute right-0 mt-2' memaksa kotak ini melayang tepat di bawah tombol sebelah kanan */
                  className="absolute -right-12 mt-3 w-72 sm:w-80 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <input
                    type="text"
                    placeholder="Ketik produk yang anda butuhkan..."
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-yellow text-gray-700 placeholder-gray-400 transition-all"
                    autoFocus // Otomatis fokus ke text input saat pop-up terbuka
                  />
                  <button className="bg-brand-yellow p-2.5 rounded-xl text-brand-dark hover:brightness-105 active:scale-95 transition-all shadow-sm">
                    <Search className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CART */}
          <Link href="/keranjang">
            <motion.div
              animate={
                animateCart
                  ? {
                      scale: [1, 1.35, 1],
                      rotate: [0, -15, 15, -10, 10, 0],
                      y: [0, -4, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.92,
              }}
              className="relative p-2 cursor-pointer"
            >
              {/* ICON */}
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-brand-yellow transition-colors duration-300" />

              {/* BADGE */}
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: 1,
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full font-bold shadow-md"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          {/* PROFILE */}
          {isLoggedIn ? (
            <div className="hidden md:block relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-all"
              >
                <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-brand-dark" />
                </div>

                <motion.div animate={{ rotate: isProfileOpen ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      Profil Saya
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:block bg-brand-yellow px-6 py-2 rounded-xl font-bold text-sm hover:brightness-105"
            >
              Masuk
            </Link>
          )}

          {isLoggedIn && (
            <div className="md:hidden block relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-all"
              >
                <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-brand-dark" />
                </div>

                <motion.div animate={{ rotate: isProfileOpen ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      Profil Saya
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={`md:hidden mt-8 transition-all duration-300 ${
            isScrolled
              ? "bg-white/90 backdrop-blur-lg shadow-md py-3 px-6 space-y-3"
              : "bg-white py-3 px-6 space-y-3"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`block py-2 text-sm font-medium transition-colors ${
                pathname === link.path
                  ? "text-brand-yellow font-bold"
                  : "text-gray-600 hover:text-brand-yellow"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100">
            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="block w-full text-center bg-brand-yellow px-6 py-2 rounded-lg font-bold text-sm text-brand-dark mt-2"
                >
                  Masuk
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
}
