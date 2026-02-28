import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useProductStore } from '@/store/productStore';
import type { FilterOptions } from '@/types';

const categories = [
  { id: 'all', name: 'الكل', nameEn: 'All' },
  { id: 'basic', name: 'أساسي', nameEn: 'Basic' },
  { id: 'graphic', name: 'جرافيك', nameEn: 'Graphic' },
  { id: 'sport', name: 'رياضي', nameEn: 'Sport' },
  { id: 'classic', name: 'كلاسيكي', nameEn: 'Classic' },
  { id: 'polo', name: 'بولو', nameEn: 'Polo' },
  { id: 'trendy', name: 'عصري', nameEn: 'Trendy' },
];

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

const sortOptions = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price-asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price-desc', label: 'السعر: من الأعلى للأقل' },
  { value: 'bestseller', label: 'الأكثر مبيعاً' },
  { value: 'rating', label: 'التقييم' },
];

export function ProductPage() {
  const { category } = useParams();
  const [,] = useSearchParams();
  const { setFilters, clearFilters, getFilteredProducts } = useProductStore();
  
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Apply filters when they change
  useEffect(() => {
    const newFilters: FilterOptions = {
      sortBy: sortBy as FilterOptions['sortBy'],
    };

    if (selectedCategory !== 'all') {
      newFilters.category = selectedCategory;
    }

    if (selectedSizes.length > 0) {
      newFilters.sizes = selectedSizes;
    }

    if (priceRange.min) {
      newFilters.minPrice = parseInt(priceRange.min);
    }

    if (priceRange.max) {
      newFilters.maxPrice = parseInt(priceRange.max);
    }

    setFilters(newFilters);
  }, [selectedCategory, selectedSizes, priceRange, sortBy, setFilters]);

  const filteredProducts = getFilteredProducts();

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    clearFilters();
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSizes.length > 0 ||
    priceRange.min ||
    priceRange.max;

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">التصنيف</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-right px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">المقاس</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                selectedSizes.includes(size)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">السعر</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="من"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="w-20 px-3 py-2 border rounded-lg text-sm"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="إلى"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="w-20 px-3 py-2 border rounded-lg text-sm"
          />
          <span className="text-gray-500">درهم</span>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full"
        >
          <X className="w-4 h-4 ml-2" />
          مسح الفلاتر
        </Button>
      )}
    </div>
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            جميع المنتجات
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} منتج متوفر
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Filter Button - Mobile */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="w-4 h-4 ml-2" />
                فلتر
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <FilterContent />
            </SheetContent>
          </Sheet>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  لا توجد منتجات تطابق الفلاتر المحددة
                </p>
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="mt-4"
                >
                  مسح الفلاتر
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
