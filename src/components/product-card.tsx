'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Product } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const productImage = PlaceHolderImages.find(
    (img) => img.id === product.imageId
  );

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    router.push('/cart');
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  return (
    <Card className="w-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="aspect-square relative">
            {productImage && (
              <Image
                src={productImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={productImage.imageHint}
              />
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg leading-tight mb-1">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription className="text-primary font-semibold text-base">
          ₹{product.price}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          variant="outline"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        <Button
          onClick={handleBuyNow}
          className="w-full"
        >
          <Zap className="mr-2 h-4 w-4" /> Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
