import { HeroSection } from '@/components/HeroSection';
import { ProductGrid } from '@/components/ProductGrid';
import { CustomerReviews } from '@/components/CustomerReviews';
import { CollectionsSection } from '@/components/CollectionsSection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { useProductStore } from '@/store/productStore';

export function HomePage() {
  const { products } = useProductStore();

  const bestSelling = products.filter((p) => p.isBestseller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const onSale = products.filter((p) => p.isOnSale).slice(0, 4);

  return (
    <div>
      <HeroSection />
      
      {/* Collections - Right after Hero */}
      <CollectionsSection />

      {/* Featured Products */}
      <FeaturedProducts />

      <ProductGrid
        title="BEST SELLING"
        titleAr="الأكثر مبيعاً"
        products={bestSelling}
        viewAllLink="/products"
      />

      {newArrivals.length > 0 && (
        <ProductGrid
          title="NEW ARRIVALS"
          titleAr="وصل حديثاً"
          products={newArrivals}
          viewAllLink="/products"
        />
      )}

      {onSale.length > 0 && (
        <ProductGrid
          title="SPECIAL OFFERS"
          titleAr="عروض خاصة"
          products={onSale}
          viewAllLink="/products"
        />
      )}

      <CollectionsSection />

      <CustomerReviews />

    </div>
  );
}
