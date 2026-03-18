import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { useCollectionStore } from '@/store/collectionStore';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { ProductPage } from '@/pages/ProductPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { SearchPage } from '@/pages/SearchPage';
import { CartPage } from '@/pages/CartPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ProfilePage } from '@/pages/ProfilePage'; // Add this import
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminAddProductPage } from '@/pages/admin/AdminAddProductPage';
import { AdminEditProductPage } from '@/pages/admin/AdminEditProductPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminDeliveredOrdersPage } from '@/pages/admin/AdminDeliveredOrdersPage';
import { AdminCollectionsPage } from '@/pages/admin/AdminCollectionsPage';
import { AdminAddCollectionPage } from '@/pages/admin/AdminAddCollectionPage';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  
  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const fetchCollections = useCollectionStore((state) => state.fetchCollections);
  
  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, [fetchProducts, fetchCollections]);

  return (
    <BrowserRouter>
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
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="profile" element={<ProfilePage />} /> {/* Add this route */}
        </Route>

        {/* Admin Routes - Protected */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/add" element={<AdminAddProductPage />} />
          <Route path="products/edit/:id" element={<AdminEditProductPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/delivered" element={<AdminDeliveredOrdersPage />} />
          <Route path="collections" element={<AdminCollectionsPage />} />
          <Route path="collections/add" element={<AdminAddCollectionPage />} />
          <Route path="collections/edit/:id" element={<AdminAddCollectionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;