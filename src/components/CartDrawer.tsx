import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    setCartOpen, 
    updateQuantity, 
    removeItem, 
    getTotalPrice,
    getTotalItems
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="w-full sm:w-[450px] bg-white p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold">
              <ShoppingBag className="w-5 h-5" />
              سلة التسوق ({totalItems})
            </SheetTitle>
          </SheetHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">السلة فارغة</p>
                <p className="text-sm">أضف بعض المنتجات إلى سلة التسوق</p>
                <Link to="/products" onClick={() => setCartOpen(false)}>
                  <Button className="mt-4 bg-primary hover:bg-primary-dark text-white">
                    تصفح المنتجات
                  </Button>
                </Link>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg mb-3"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.id}`}
                      onClick={() => setCartOpen(false)}
                      className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.nameAr}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        onClick={() => setCartOpen(false)}
                      >
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors">
                          {item.nameAr}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        المقاس: {item.selectedSize}
                        {item.selectedColor && ` | اللون: ${item.selectedColor}`}
                      </p>
                      <p className="text-primary font-bold mt-1">
                        {item.price.toFixed(2)} درهم
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
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
                            className="w-7 h-7 bg-white border rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
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
                            className="w-7 h-7 bg-white border rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeItem(item.id, item.selectedSize, item.selectedColor)
                          }
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span>{totalPrice.toFixed(2)} درهم</span>
                </div>

                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="font-bold">الإجمالي</span>
                  <span className="text-xl font-bold text-primary">
                    {totalPrice.toFixed(2)} درهم
                  </span>
                </div>
              </div>
              
              <Link to="/cart" onClick={() => setCartOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-6 mb-2">
                  عرض السلة
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={() => setCartOpen(false)}
                className="w-full"
              >
                مواصلة التسوق
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}