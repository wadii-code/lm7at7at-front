import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProductStore } from '@/store/productStore';
import { toast } from 'sonner';

const categories = [
  { id: 'basic', name: 'أساسي' },
  { id: 'graphic', name: 'جرافيك' },
  { id: 'sport', name: 'رياضي' },
  { id: 'classic', name: 'كلاسيكي' },
  { id: 'polo', name: 'بولو' },
  { id: 'trendy', name: 'عصري' },
];

const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

const availableColors = [
  { name: 'White', nameAr: 'أبيض', hex: '#FFFFFF' },
  { name: 'Black', nameAr: 'أسود', hex: '#000000' },
  { name: 'Navy', nameAr: 'كحلي', hex: '#1a365d' },
  { name: 'Grey', nameAr: 'رمادي', hex: '#9CA3AF' },
  { name: 'Beige', nameAr: 'بيج', hex: '#D4C4B0' },
  { name: 'Red', nameAr: 'أحمر', hex: '#EF4444' },
  { name: 'Blue', nameAr: 'أزرق', hex: '#3B82F6' },
  { name: 'Green', nameAr: 'أخضر', hex: '#10B981' },
];

export function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, updateProduct } = useProductStore();
  
  const product = getProductById(id || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    originalPrice: '',
    category: 'basic',
    sizes: [] as string[],
    colors: [] as string[],
    stockQuantity: '',
    tags: '',
    isNew: false,
    isBestseller: false,
    isOnSale: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        nameAr: product.nameAr,
        description: product.description,
        descriptionAr: product.descriptionAr,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        sizes: product.sizes,
        colors: product.colors.map((c) => c.name),
        stockQuantity: product.stockQuantity.toString(),
        tags: product.tags.join(', '),
        isNew: product.isNew || false,
        isBestseller: product.isBestseller || false,
        isOnSale: product.isOnSale || false,
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">المنتج غير موجود</p>
        <Button onClick={() => navigate('/admin/products')} className="mt-4">
          العودة للمنتجات
        </Button>
      </div>
    );
  }

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (colorName: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nameAr || !formData.descriptionAr || !formData.price) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.sizes.length === 0) {
      toast.error('الرجاء اختيار مقاس واحد على الأقل');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedColors = availableColors.filter((c) =>
        formData.colors.includes(c.name)
      );

      const updates = {
        name: formData.name || formData.nameAr,
        nameAr: formData.nameAr,
        description: formData.description || formData.descriptionAr,
        descriptionAr: formData.descriptionAr,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        category: formData.category,
        sizes: formData.sizes,
        colors: selectedColors.length > 0 ? selectedColors : product.colors,
        inStock: parseInt(formData.stockQuantity) > 0,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isNew: formData.isNew,
        isBestseller: formData.isBestseller,
        isOnSale: formData.isOnSale,
      };

      const success = await updateProduct(id!, updates as any);
      
      if (success) {
        toast.success('تم تحديث المنتج بنجاح!');
        navigate('/admin/products');
      } else {
        toast.error('فشل تحديث المنتج');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تعديل المنتج</h1>
          <p className="text-gray-600 mt-1">
            تعديل: {product.nameAr}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-card space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-900">المعلومات الأساسية</h2>
            
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                اسم المنتج (عربي) <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.nameAr}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nameAr: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                اسم المنتج (إنجليزي)
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                الوصف (عربي) <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, descriptionAr: e.target.value }))
                }
                rows={4}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                الوصف (إنجليزي)
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
              />
            </div>
          </motion.div>

          {/* Pricing & Stock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-card space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-900">السعر والمخزون</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  السعر <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  السعر الأصلي (للخصم)
                </label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                الكمية في المخزون <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stockQuantity: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                التصنيف
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                الوسوم (مفصولة بفواصل)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
              />
            </div>
          </motion.div>
        </div>

        {/* Sizes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            المقاسات المتوفرة <span className="text-red-500">*</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`w-14 h-14 rounded-lg font-medium transition-all ${
                  formData.sizes.includes(size)
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">الألوان المتوفرة</h2>
          <div className="flex flex-wrap gap-4">
            {availableColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  formData.colors.includes(color.name)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.nameAr}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Flags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">خيارات المنتج</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isNew: e.target.checked }))
                }
                className="w-5 h-5 text-primary rounded"
              />
              <span className="font-medium">منتج جديد</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isBestseller: e.target.checked }))
                }
                className="w-5 h-5 text-primary rounded"
              />
              <span className="font-medium">الأكثر مبيعاً</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isOnSale}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isOnSale: e.target.checked }))
                }
                className="w-5 h-5 text-primary rounded"
              />
              <span className="font-medium">خصم / عرض</span>
            </label>
          </div>
        </motion.div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary-dark text-white py-6 text-lg"
          >
            <Save className="w-5 h-5 ml-2" />
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            className="px-8"
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
}
