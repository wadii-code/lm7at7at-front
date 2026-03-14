
import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { useCollectionStore } from '@/store/collectionStore';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut,
  ChevronRight,
  Store,
  Plus,
  Folder
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated, isAdmin } = useAuthStore();
  const fetchProducts = useProductStore.getState().fetchProducts;
  const fetchCollections = useCollectionStore.getState().fetchCollections;

  const isLoginPage = location.pathname === '/admin/login';

  useEffect(() => {
    // Load data when entering admin area (not login page)
    if (!isLoginPage) {
      fetchProducts();
      fetchCollections();
    }
  }, [fetchProducts, fetchCollections, isLoginPage]);

  useEffect(() => {
    // If user is authenticated and on the login page, redirect to dashboard
    if (isAuthenticated && isAdmin() && isLoginPage) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoginPage, navigate]);
  
  const handleLogout = () => {
    logout();
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/admin/products', label: 'المنتجات', icon: Package },
    { href: '/admin/products/add', label: 'إضافة منتج', icon: Plus },
    { href: '/admin/collections', label: 'المجموعات', icon: Folder },
    { href: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
  ];

  // If on login page, show minimal layout
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-dark">
                <Store className="w-5 h-5" />
                <span className="font-bold">العودة للمتجر</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">لوحة الإدارة</span>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-[calc(100vh-64px)] border-l">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 mr-auto" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}