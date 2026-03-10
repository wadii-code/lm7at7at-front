import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProductStore } from '@/store/productStore';
import { toast } from 'sonner';

const categories = [
  { id: 'basic', name: 'Basic' },
  { id: 'graphic', name: 'Graphic' },
  { id: 'sport', name: 'Sport' },
  { id: 'classic', name: 'Classic' },
  { id: 'polo', name: 'Polo' },
  { id: 'trendy', name: 'Trendy' },
];

const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

const availableColors = [
  { name: 'White', nameAr: 'White', hex: '#FFFFFF' },
  { name: 'Black', nameAr: 'Black', hex: '#000000' },
  { name: 'Navy', nameAr: 'Navy', hex: '#1a365d' },
  { name: 'Grey', nameAr: 'Grey', hex: '#9CA3AF' },
  { name: 'Beige', nameAr: 'Beige', hex: '#D4C4B0' },
  { name: 'Red', nameAr: 'Red', hex: '#EF4444' },
  { name: 'Blue', nameAr: 'Blue', hex: '#3B82F6' },
  { name: 'Green', nameAr: 'Green', hex: '#10B981' },
];

export function AdminAddProductPage() {
  const navigate = useNavigate();
  const { addProduct } = useProductStore();
  
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
    imageUrls: [] as string[],
    thumbnail: '',
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = formData.imageUrls.length + files.length;

      if (totalImages > 5) {
        toast.error('You can upload a maximum of 5 images.');
        return;
      }

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setFormData(prev => ({
            ...prev,
            imageUrls: [...prev.imageUrls, dataUrl]
          }));
          setImagePreviews(prev => [...prev, dataUrl]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFormData(prev => ({
          ...prev,
          thumbnail: dataUrl
        }));
        setThumbnailPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData(prev => ({
      ...prev,
      thumbnail: ''
    }));
    setThumbnailPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if ((!formData.name && !formData.nameAr) || (!formData.description && !formData.descriptionAr) || !formData.price) {
      toast.error('Please fill in all required fields (Name, Description, Price)');
      return;
    }

    if (formData.sizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }

    if (formData.colors.length === 0) {
        toast.error('Please select at least one color');
        return;
    }

    if (formData.imageUrls.length === 0) {
      toast.error('Please select at least one product image');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedColors = availableColors.filter((c) =>
        formData.colors.includes(c.name)
      );

      const newProduct = {
        id: `new-${Date.now()}`,
        name: formData.name || formData.nameAr,
        nameAr: formData.nameAr,
        description: formData.description || formData.descriptionAr,
        descriptionAr: formData.descriptionAr,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        images: formData.imageUrls,
        thumbnail: formData.thumbnail || formData.imageUrls[0] || undefined,
        category: formData.category,
        sizes: formData.sizes,
        colors: selectedColors.length > 0 ? selectedColors : [availableColors[0]],
        inStock: parseInt(formData.stockQuantity) > 0,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        rating: 0,
        reviewCount: 0,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isNew: formData.isNew,
        isBestseller: formData.isBestseller,
        isOnSale: formData.isOnSale,
      };

      addProduct(newProduct);
      toast.success('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred while adding the product');
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">
            Add a new product to your store
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
            <h2 className="text-xl font-bold text-gray-900">Product Images</h2>
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Upload Images <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">(Up to 5 images)</span>
              </label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                disabled={formData.imageUrls.length >= 5}
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={preview}
                      alt={`Product Preview ${index + 1}`}
                      className="w-full h-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Product Name (Arabic)
              </label>
              <Input
                value={formData.nameAr}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nameAr: e.target.value }))
                }
                placeholder="e.g., تيشيرت قطن ممتاز"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Product Image <span className="text-red-500">*</span>
              </label>
              <Input
                type="file"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              <p className="text-sm text-gray-500 mt-2">
                Note: After adding the product, you must manually move the image file to the{' '}
                <code className="text-xs bg-gray-100 p-1 rounded">public/images</code> folder.
              </p>
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <img
                    src={imagePreviews[0]}
                    alt="Image Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Detailed product description..."
                rows={4}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Description (Arabic)
              </label>
              <Textarea
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, descriptionAr: e.target.value }))
                }
                placeholder="وصف تفصيلي للمنتج..."
                rows={4}
              />
            </div>

            {/* Thumbnail Image - Separate from gallery */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">صورة المصغرة (لصفحة المنتجات)</h3>
              <p className="text-sm text-gray-500 mb-4">
                هذه الصورة تظهر في الصفحة الرئيسية وقوائم المنتجات
              </p>
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  صورة مصغرة
                </label>
                <Input
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleThumbnailChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {thumbnailPreview && (
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      إزالة الصورة
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Pricing & Stock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-card space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-900">Pricing and Stock</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="249"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Original Price (for discount)
                </label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))
                  }
                  placeholder="299"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stockQuantity: e.target.value }))
                }
                placeholder="50"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Category
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
                Tags (comma-separated)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="cotton, basic, white"
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
            Available Sizes <span className="text-red-500">*</span>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Colors</h2>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product Flags</h2>
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
              <span className="font-medium">New Product</span>
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
              <span className="font-medium">Bestseller</span>
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
              <span className="font-medium">On Sale</span>
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
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            className="px-8"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}