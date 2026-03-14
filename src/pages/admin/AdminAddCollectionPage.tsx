import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollectionStore } from '@/store/collectionStore';
import { toast } from 'sonner';

export function AdminAddCollectionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addCollection, updateCollection, getCollectionById } = useCollectionStore();
  
  const isEditing = Boolean(id);
  const existingCollection = id ? getCollectionById(id) : undefined;

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    image: '',
    href: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (existingCollection) {
      setFormData({
        name: existingCollection.name,
        nameAr: existingCollection.nameAr,
        image: existingCollection.image,
        href: existingCollection.href,
      });
      setImagePreview(existingCollection.image);
    }
  }, [existingCollection]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFormData((prev) => ({ ...prev, image: dataUrl }));
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setImagePreview('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.nameAr || !formData.image || !formData.href) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Validate href format
    if (!formData.href.startsWith('/products/')) {
      toast.error('الرابط يجب أن يبدأ بـ /products/');
      return;
    }

    const success = isEditing && id 
      ? await updateCollection(id, formData)
      : await addCollection(formData);
      
    if (success) {
      toast.success(isEditing ? 'تم تحديث المجموعة بنجاح' : 'تم إضافة المجموعة بنجاح');
      navigate('/admin/collections');
    } else {
      toast.error('فشل في حفظ المجموعة');
    }
  };

  const availableCategories = [
    { value: '/products/basic', label: 'Basic Tees - تيشيرتات أساسية' },
    { value: '/products/graphic', label: 'Graphic Tees - تيشيرتات جرافيك' },
    { value: '/products/sport', label: 'Sport Tees - تيشيرتات رياضية' },
    { value: '/products/classic', label: 'Classic - كلاسيكي' },
    { value: '/products/polo', label: 'Polo Shirts - قمصان بولو' },
    { value: '/products/trendy', label: 'Trendy - عصري' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/collections')}
          className="mb-4"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للمجموعات
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'تعديل مجموعة' : 'إضافة مجموعة جديدة'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing 
            ? 'قم بتعديل تفاصيل المجموعة الحالية' 
            : 'أضف مجموعة جديدة من المنتجات'}
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name in English */}
          <div className="space-y-2">
            <Label htmlFor="name">الاسم بالإنجليزية *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Basic Tees"
              className="text-left"
              dir="ltr"
            />
          </div>

          {/* Name in Arabic */}
          <div className="space-y-2">
            <Label htmlFor="nameAr">الاسم بالعربية *</Label>
            <Input
              id="nameAr"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              placeholder="تيشيرتات أساسية"
              className="text-right"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>صورة المجموعة *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Collection Preview"
                    className="max-h-48 rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="collection-image-upload"
                  />
                  <Label
                    htmlFor="collection-image-upload"
                    className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-block"
                  >
                    <Upload className="w-4 h-4 ml-2 inline" />
                    رفع صورة
                  </Label>
                  <p className="text-sm text-gray-500 mt-2">
                    أو اسحب الصورة وأفلتها هنا
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Category/Href */}
          <div className="space-y-2">
            <Label htmlFor="href">التصنيف (الرابط) *</Label>
            <select
              id="href"
              name="href"
              value={formData.href}
              onChange={(e) => setFormData((prev) => ({ ...prev, href: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 bg-white"
            >
              <option value="">اختر التصنيف</option>
              {availableCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              هذا الرابط يحدد أي المنتجات ستظهر في هذه المجموعة
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white flex-1"
            >
              <Upload className="w-4 h-4 ml-2" />
              {isEditing ? 'تحديث المجموعة' : 'إضافة المجموعة'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/collections')}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

