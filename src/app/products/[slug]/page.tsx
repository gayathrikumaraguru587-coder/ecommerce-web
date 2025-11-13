'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products, type Product } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const product = products.find((p: Product) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const productImage = PlaceHolderImages.find(
    (img) => img.id === product.imageId
  );

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="aspect-square relative rounded-lg overflow-hidden border shadow-sm">
          {productImage && (
            <Image
              src={productImage.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={productImage.imageHint}
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-primary mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {product.name}
          </h1>
          <p className="text-3xl text-foreground font-semibold my-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <Separator className="my-8" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
