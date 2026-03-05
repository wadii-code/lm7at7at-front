import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { PromotionModal } from '@/components/PromotionModal';
import { Toaster } from '@/components/ui/sonner';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-page-bg font-sans" dir="rtl">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <PromotionModal />
      <Toaster position="top-center" richColors />
    </div>
  );
}
