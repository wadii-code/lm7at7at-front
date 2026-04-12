import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, User, ShoppingBag, Menu, Heart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems, setCartOpen } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, logout, isAdmin } = useAuthStore();

  const totalItems = getTotalItems();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', labelAr: 'الرئيسية' },
    { href: '/products', label: 'Catalog', labelAr: 'المنتجات' },
    { href: '/search', label: 'Search', labelAr: 'بحث' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : 'border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-[70px]">
          {/* Left side: Search on Desktop, Burger on Mobile */}
          <div className="flex-1 flex justify-start">
            <div className="hidden md:flex items-center">
              <form onSubmit={handleSearch} className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for a product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </form>
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Menu className="w-5 h-5 text-gray-700" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] bg-white">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between py-4 border-b">
                      <span className="text-xl font-bold">LM7AT7AT</span>
                    </div>
                    <nav className="flex flex-col space-y-4 py-6">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <Link
                        to="/wishlist"
                        className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                      >
                        Wishlist ({wishlistCount})
                      </Link>
                      <Link
                        to="/cart"
                        className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                      >
                        Cart ({totalItems})
                      </Link>
                      <Link
                        to="/login"
                        className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                      >
                        Login
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center">
              <img src="/images/imglogo.png" alt="LM7AT7AT Logo" className="h-20 md:h-22 w-auto" />
            </Link>
          </div>

          {/* Right side: Nav & Icons */}
          <div className="flex-1 flex justify-end items-center">
            <nav className="hidden md:flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors relative group mx-4"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-2 ml-0 md:ml-6">
              {/* Mobile Search */}
              <Link to="/search" className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-5 h-5 text-gray-700" />
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <Heart className="w-5 h-5 text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <User className="w-5 h-5 text-gray-700" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {isAdmin() && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <User className="w-5 h-5 text-gray-700" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}