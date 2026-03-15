import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductStore } from '@/store/productStore';
import { toast } from 'sonner';

export function AdminProductsPage() {
  const { products, deleteProduct } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nameAr?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      product.name?.toLowerCase().includes(searchQuery?.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف "${name}"؟`)) {
      const success = await deleteProduct(id);
      if (success) {
        toast.success('تم حذف المنتج بنجاح');
      } else {
        toast.error('فشل حذف المنتج');
      }
    }
  };

  const categories = ['all', 'basic', 'graphic', 'sport', 'classic', 'polo', 'trendy'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المنتجات</h1>
          <p className="text-gray-600 mt-1">
            إدارة منتجات المتجر ({filteredProducts.length})
          </p>
        </div>
        <Link to="/admin/products/add">
          <Button className="bg-primary hover:bg-primary-dark text-white">
            <Plus className="w-4 h-4 ml-2" />
            إضافة منتج
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="البحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'جميع التصنيفات' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-4 px-4 font-medium text-gray-700">
                  المنتج
                </th>
                <th className="text-right py-4 px-4 font-medium text-gray-700">
                  التصنيف
                </th>
                <th className="text-right py-4 px-4 font-medium text-gray-700">
                  السعر
                </th>
                <th className="text-right py-4 px-4 font-medium text-gray-700">
                  المخزون
                </th>
                <th className="text-right py-4 px-4 font-medium text-gray-700">
                  التقييم
                </th>
                <th className="text-right py-4 px-4 font-medium text-gray-700">
                  الحالة
                </th>
                <th className="text-right py-4 px-4 font-medium text-gray-700">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail || product.images[0]}
                        alt={product.nameAr}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.nameAr}
                        </p>
                        <p className="text-sm text-gray-500">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-medium">{product.price} درهم</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through mr-2">
                          {product.originalPrice} درهم
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-medium ${
                        product.stockQuantity < 10
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }`}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.inStock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.inStock ? 'متوفر' : 'غير متوفر'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id!, product.nameAr)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد منتجات تطابق البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
