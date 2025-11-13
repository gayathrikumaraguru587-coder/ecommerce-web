import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Recommendations } from '@/components/recommendations';
import { ArrowRight } from 'lucide-react';

function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] bg-primary/10">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-end text-center pb-16 md:pb-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
          Welcome to CommerceWave
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          Discover the future of online shopping. Quality products, unbeatable
          prices.
        </p>
        <Button asChild size="lg">
          <Link href="/products">
            Shop Now <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const featured = products.slice(0, 4);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Featured Products
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Check out our hand-picked selection of top-quality products.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Button asChild variant="outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedProducts />
      <Recommendations />
    </div>
  );
}
