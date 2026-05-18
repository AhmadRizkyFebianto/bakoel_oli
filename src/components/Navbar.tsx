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
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { div } from "motion/react-client";

interface NavbarProps {
  cartCount: number;
}

const NAV_LINKS = [
  { name: "Beranda", path: "/" },
  { name: "Tentang Kami", path: "/tentang-kami" },
  { name: "Produk", path: "/produk" },
  { name: "Layanan", path: "/layanan" },
  { name: "Kontak", path: "#" },
];

export default function Navbar({ cartCount }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const checkLoginStatus = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  };

  useEffect(() => {
    checkLoginStatus();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="">
            <img src="/assets/Logo.png" alt="Logo" className="w-8 h-8" />
          </div>
          <span className="text-2xl font-bold text-brand-dark tracking-tight">
            BAKUL OLI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`hover:text-brand-yellow transition-colors ${
                pathname === link.path
                  ? "text-brand-yellow font-bold border-b-2 border-brand-yellow pb-1"
                  : "text-gray-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-brand-yellow">
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/keranjang"
            className="relative p-2 text-gray-600 hover:text-brand-yellow"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <div className="relative">
            {isLoggedIn ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-100 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-all"
                >
                  <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" /> Profil Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:block bg-brand-yellow px-6 py-2 rounded-lg font-bold text-sm hover:brightness-105 shadow-sm text-brand-dark"
              >
                Masuk
              </Link>
            )}
          </div>

          {isLoggedIn && (
            <div className="relative md:hidden block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-all"
              >
                <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark font-bold">
                  <User className="w-5 h-5" />
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" /> Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-md">
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
          {!isLoggedIn && (
            <Link
              href="/login"
              className="block w-full text-center bg-brand-yellow px-6 py-2 rounded-lg font-bold text-sm text-brand-dark mt-2"
            >
              Masuk
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
