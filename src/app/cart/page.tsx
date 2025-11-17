'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Trash2, ShoppingBag } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    cartCount,
  } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Your Shopping Cart
        </h1>
        <p className="text-muted-foreground mt-2">
          You have {cartCount} item(s) in your cart.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cartItems.map((item) => {
                    const productImage = PlaceHolderImages.find(
                      (img) => img.id === item.imageId
                    );
                    return (
                      <div
                        key={item.id}
                        className="flex items-center p-4 gap-4"
                      >
                        <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                          {productImage && (
                            <Image
                              src={productImage.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                              data-ai-hint={productImage.imageHint}
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value))
                            }
                            className="w-16 h-9 text-center"
                          />
                        </div>
                        <p className="font-semibold w-20 text-right">
                          ₹{item.price * item.quantity}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>₹{totalPrice}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>₹{totalPrice}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
