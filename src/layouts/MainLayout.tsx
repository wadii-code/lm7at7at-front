import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Toaster } from '@/components/ui/sonner';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-page-bg font-sans" dir="rtl">
      <AnnouncementBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
