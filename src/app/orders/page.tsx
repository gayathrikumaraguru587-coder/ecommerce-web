'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  type Timestamp,
} from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  zip: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: Timestamp;
  shippingAddress: ShippingAddress;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Order)
        );
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <Card className="text-center py-16">
           <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">No Orders Yet</h2>
          <p className="mt-2 text-muted-foreground">You haven't placed any orders.</p>
           <Button asChild className="mt-6">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {orders.map((order) => (
            <AccordionItem key={order.id} value={order.id} className="border rounded-lg bg-card">
              <AccordionTrigger className="p-4 hover:no-underline">
                <div className="flex justify-between w-full pr-4">
                  <div>
                    <p className="font-semibold">
                      Order #{order.id.substring(0, 7)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <Badge variant={order.status === 'Processing' ? 'secondary' : 'default'}>{order.status}</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t">
                <CardDescription>Items:</CardDescription>
                <ul className="my-2 divide-y">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between py-2">
                      <span>
                        {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-2 mt-2">
                    <CardDescription>Shipping to:</CardDescription>
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
