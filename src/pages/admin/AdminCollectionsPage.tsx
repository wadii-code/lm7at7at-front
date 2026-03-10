import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  Folder
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCollectionStore } from '@/store/collectionStore';
import { toast } from 'sonner';

export function AdminCollectionsPage() {
  const { collections, deleteCollection } = useCollectionStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      collection.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف المجموعة "${name}"؟`)) {
      deleteCollection(id);
      toast.success('تم حذف المجموعة بنجاح');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المجموعات</h1>
          <p className="text-gray-600 mt-1">
            إدارة مجموعات المنتجات ({filteredCollections.length})
          </p>
        </div>
        <Link to="/admin/collections/add">
          <Button className="bg-primary hover:bg-primary-dark text-white">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مجموعة
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="البحث عن مجموعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Collection Image */}
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/1.jpeg';
                }}
              />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1">
                <Folder className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{collection.productCount} منتج</span>
              </div>
            </div>

            {/* Collection Info */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900">{collection.nameAr}</h3>
              <p className="text-sm text-gray-500 mb-3">{collection.name}</p>
              <p className="text-xs text-gray-400 mb-4">الرابط: {collection.href}</p>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  to={collection.href}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                  title="عرض"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">عرض</span>
                </Link>
                <Link
                  to={`/admin/collections/edit/${collection.id}`}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                  title="تعديل"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm">تعديل</span>
                </Link>
                <button
                  onClick={() => handleDelete(collection.id, collection.nameAr)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">حذف</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCollections.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-card">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد مجموعات تطابق البحث</p>
        </div>
      )}
    </div>
  );
}

