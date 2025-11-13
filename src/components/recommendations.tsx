'use client';

import { useEffect, useState } from 'react';
import { getPersonalizedProductRecommendations } from '@/ai/flows/personalized-product-recommendations';
import { products, type Product } from '@/lib/products';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';
import { useAuth } from '@/context/AuthContext';

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const mockHistory = {
          userId: user.uid,
          browsingHistory: ['1'],
          pastPurchases: ['2'],
        };
        const result = await getPersonalizedProductRecommendations(mockHistory);
        const recommendedProducts = products.filter((p) =>
          result.recommendedProducts.includes(p.id)
        );
        // Fallback to show some products if AI gives no recommendations
        if (recommendedProducts.length > 0) {
            setRecommendations(recommendedProducts.slice(0, 4));
        } else {
            setRecommendations(products.slice(2, 6));
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Fallback to showing some products on error
        setRecommendations(products.slice(2, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <section className="bg-primary/5 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Just For You
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our AI has picked these products based on your activity.
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[250px] w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
