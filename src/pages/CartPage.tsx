import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Truck,
  Gift,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { OrderConfirmationModal } from '@/components/OrderConfirmationModal';
import { useState } from 'react';

export function CartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart,
    getTotalItems,
    getTotalPrice 
  } = useCartStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = 0;
  const finalTotal = totalPrice + shippingCost;

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            سلة التسوق فارغة
          </h1>
          <p className="text-gray-500 mb-8">
            ابدأ التسوق واكتشف منتجاتنا الرائعة
          </p>
          <Link to="/products">
            <Button className="bg-primary hover:bg-primary-dark text-white px-8">
              تصفح المنتجات
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Group items by product id, size, and color
  const groupedItems = items.reduce((acc, item) => {
    const key = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
    if (!acc[key]) {
      acc[key] = item;
    }
    return acc;
  }, {} as Record<string, typeof items[0]>);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            سلة التسوق ({totalItems})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {Object.values(groupedItems).map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-card flex gap-4"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.id}`}
                    className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.nameAr}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          to={`/product/${item.id}`}
                          className="font-bold text-gray-900 hover:text-primary transition-colors"
                        >
                          {item.nameAr}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          المقاس: {item.selectedSize}
                          {item.selectedColor && ` | اللون: ${item.selectedColor}`}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.id, item.selectedSize, item.selectedColor)
                        }
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-bold text-lg text-primary">
                        {(item.price * item.quantity).toFixed(2)} درهم
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart */}
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                إفراغ السلة
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  ملخص الطلب
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المجموع الفرعي</span>
                    <span className="font-medium">{totalPrice.toFixed(2)} درهم</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الشحن</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">مجاني</span>
                      ) : (
                        `${shippingCost.toFixed(2)} درهم`
                      )}
                    </span>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-sm text-green-600">
                      🎉 لقد حصلت على شحن مجاني!
                    </p>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">الإجمالي</span>
                      <span className="font-bold text-xl text-primary">
                        {finalTotal.toFixed(2)} درهم
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-6 text-lg font-bold mb-4"
                >
                  إتمام الطلب
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>

                {/* Promo Code */}
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">هل لديك كود خصم؟</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="أدخل الكود"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />
                    <Button variant="outline" size="sm">
                      تطبيق
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-primary" />
                    <span>توصيل سريع خلال 24-48 ساعة</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>ضمان استرجاع خلال 14 يوم</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Gift className="w-5 h-5 text-primary" />
                    <span>عروض حصرية للأعضاء</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <OrderConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}