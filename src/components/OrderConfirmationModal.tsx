import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useOrderStore, type Order } from '@/store/orderStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderConfirmationModal({ isOpen, onClose }: OrderConfirmationModalProps) {
  const { addOrder } = useOrderStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error('الرجاء ملء جميع الحقول');
      return;
    }

    setIsSubmitting(true);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      customer: customerInfo,
      items: items,
      total: getTotalPrice(),
      date: new Date().toISOString(),
      status: 'pending',
    };
    addOrder(newOrder);
    toast.success('تم استلام طلبك بنجاح!');
    clearCart();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">تأكيد الطلب</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block font-medium text-gray-700 mb-2">الاسم الكامل</label>
                <Input
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="مثال: جون دو"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <Input
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="مثال: 0501234567"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">عنوان التوصيل</label>
                <Textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  placeholder="المدينة، الشارع، رقم المبنى"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-2xl">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-base"
              >
                {isSubmitting ? 'جاري التأكيد...' : 'تأكيد وإرسال الطلب'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}