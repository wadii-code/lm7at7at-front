// Admin Dashboard Page
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';

export function AdminDashboardPage() {
  const { products } = useProductStore();

  // Calculate stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const lowStockProducts = products.filter((p) => p.stockQuantity < 10).length;
  
  const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;

  const stats = [
    {
      title: 'إجمالي المنتجات',
      value: totalProducts,
      icon: Package,
      change: '+12%',
      changeType: 'positive' as const,
      color: 'bg-blue-500',
    },
    {
      title: 'المخزون الكلي',
      value: totalStock,
      icon: TrendingUp,
      change: '+5%',
      changeType: 'positive' as const,
      color: 'bg-green-500',
    },
    {
      title: 'منتجات منخفضة المخزون',
      value: lowStockProducts,
      icon: ArrowDownRight,
      change: 'تحتاج انتباه',
      changeType: 'negative' as const,
      color: 'bg-orange-500',
    },
    {
      title: 'متوسط التقييم',
      value: averageRating.toFixed(1),
      icon: Users,
      change: '+0.3',
      changeType: 'positive' as const,
      color: 'bg-purple-500',
    },
  ];

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-1">
          نظرة عامة على أداء المتجر
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {stat.changeType === 'positive' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/products/add"
            className="flex items-center gap-4 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">إضافة منتج</p>
              <p className="text-sm text-gray-500">إضافة منتج جديد للمتجر</p>
            </div>
          </Link>
          
          <Link
            to="/admin/products"
            className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">إدارة المنتجات</p>
              <p className="text-sm text-gray-500">تعديل أو حذف المنتجات</p>
            </div>
          </Link>
          
          <Link
            to="/admin/orders"
            className="flex items-center gap-4 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">الطلبات</p>
              <p className="text-sm text-gray-500">عرض وإدارة الطلبات</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">أحدث المنتجات</h2>
          <Link
            to="/admin/products"
            className="text-primary hover:text-primary-dark font-medium"
          >
            عرض الكل
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  المنتج
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  السعر
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  المخزون
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  التقييم
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.nameAr}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium">{product.nameAr}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.price} درهم</td>
                  <td className="py-3 px-4">
                    <span
                      className={`${
                        product.stockQuantity < 10
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }`}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{product.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.inStock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.inStock ? 'متوفر' : 'غير متوفر'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      {lowStockProducts > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-orange-900">
                منتجات منخفضة المخزون
              </h3>
              <p className="text-orange-700">
                يوجد {lowStockProducts} منتجات تحتاج إلى إعادة تعبئة المخزون
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
