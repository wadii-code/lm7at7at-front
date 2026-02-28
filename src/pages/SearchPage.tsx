import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { useProductStore } from '@/store/productStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const recentSearches: string[] = [];
const popularSearches = ['تيشيرت أبيض', 'بولو', 'تيشيرت رياضي', 'جرافيك'];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setSearchQuery, getFilteredProducts } = useProductStore();
  
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  const filteredProducts = getFilteredProducts();

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery, setSearchQuery]);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setIsSearching(true);
      setSearchQuery(query);
      setSearchParams({ q: query });
      
      // Add to recent searches
      if (!recentSearches.includes(query)) {
        recentSearches.unshift(query);
        if (recentSearches.length > 5) {
          recentSearches.pop();
        }
      }
    }
  }, [query, setSearchQuery, setSearchParams]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchQuery('');
    setSearchParams({});
    setIsSearching(false);
  };

  const searchFromSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setSearchQuery(suggestion);
    setSearchParams({ q: suggestion });
    setIsSearching(true);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 min-h-[60vh]">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            البحث عن المنتجات
          </h1>
          
          {/* Search Input */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث عن تيشيرت، بولو، جرافيك..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pr-12 pl-12 py-6 text-lg rounded-xl"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <Button
            onClick={handleSearch}
            className="mt-4 bg-primary hover:bg-primary-dark text-white px-8"
          >
            بحث
          </Button>
        </motion.div>

        {/* Search Suggestions */}
        {!isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <h2 className="font-bold text-gray-900">عمليات البحث الأخيرة</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => searchFromSuggestion(term)}
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                <h2 className="font-bold text-gray-900">عمليات البحث الشائعة</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => searchFromSuggestion(term)}
                    className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* All Categories */}
            <div>
              <h2 className="font-bold text-gray-900 mb-4">تصفح حسب التصنيف</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['basic', 'graphic', 'sport', 'classic', 'polo', 'trendy'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => searchFromSuggestion(cat)}
                      className="bg-white border hover:border-primary hover:text-primary py-4 rounded-xl text-center capitalize transition-colors"
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                نتائج البحث عن &quot;{query}&quot;
              </h2>
              <span className="text-gray-500">
                {filteredProducts.length} نتيجة
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-gray-500 mb-6">
                  جرب البحث بكلمات مختلفة أو تصفح التصنيفات
                </p>
                <Button onClick={clearSearch}>العودة للبحث</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
