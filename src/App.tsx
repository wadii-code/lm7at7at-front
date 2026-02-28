import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { ProductPage } from '@/pages/ProductPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { SearchPage } from '@/pages/SearchPage';
import { CartPage } from '@/pages/CartPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminAddProductPage } from '@/pages/admin/AdminAddProductPage';
import { AdminEditProductPage } from '@/pages/admin/AdminEditProductPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { WelcomeModal } from '@/components/WelcomeModal';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  
  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <WelcomeModal />
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="products/:category" element={<ProductPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<AdminLoginPage />} />
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="products" 
            element={
              <ProtectedRoute>
                <AdminProductsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="products/add" 
            element={
              <ProtectedRoute>
                <AdminAddProductPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="products/edit/:id" 
            element={
              <ProtectedRoute>
                <AdminEditProductPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="orders" 
            element={
              <ProtectedRoute>
                <AdminOrdersPage />
              </ProtectedRoute>
            } 
          />
          <Route index element={<Navigate to="/admin/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;