'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect } from 'react';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  address: z.string().min(5, 'Address must be at least 5 characters.'),
  city: z.string().min(2, 'City must be at least 2 characters.'),
  zip: z.string().min(5, 'ZIP code must be 5 characters.').max(5),
  card: z.string().min(16, 'Card number must be 16 digits.').max(16),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format.'),
  cvc: z.string().min(3, 'CVC must be 3 digits.').max(4),
});

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    }
    if (cartItems.length === 0) {
      router.push('/products');
    }
  }, [user, cartItems, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      zip: '',
      card: '',
      expiry: '',
      cvc: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to place an order.',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        total: totalPrice,
        shippingAddress: {
          name: values.name,
          address: values.address,
          city: values.city,
          zip: values.zip,
        },
        status: 'Processing',
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Order Placed!',
        description: 'Thank you for your purchase.',
      });
      clearCart();
      router.push('/orders');
    } catch (error) {
      console.error('Error placing order: ', error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: 'There was a problem placing your order. Please try again.',
      });
    }
  }

  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold">Your cart is empty.</h1>
            <p className="text-muted-foreground">Redirecting you to our products...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Shipping & Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <h3 className="text-lg font-semibold pt-4 border-t">Payment Details</h3>

                <FormField
                  control={form.control}
                  name="card"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="**** **** **** ****" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="expiry"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Expiry (MM/YY)</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Placing Order...' : `Pay ₹${totalPrice}`}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <p>{item.name} <span className="text-muted-foreground">x{item.quantity}</span></p>
                    <p>₹{item.price * item.quantity}</p>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>₹{totalPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
