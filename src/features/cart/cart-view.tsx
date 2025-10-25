'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCart } from '@/context';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import CartItem from './components/cart-item';
import EmptyCart from './components/empty-cart';

const CartView = () => {
  const { t } = useTranslation();
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();
  const [isLoading, setIsLoading] = useState(false);

  const shippingCost: number = 0; // Free shipping for now
  const finalTotal = totalPrice + shippingCost;

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Call API to create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout using the URL from the session
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(t('checkout.error'));
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href={`/#${t('navigation.winesAnchor')}`}>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.continueShopping')}
          </Button>
        </Link>

        <h1 className="font-playfair text-5xl md:text-5xl font-bold md:h-[50px] mb-8 text-gradient-wine">
          {t('cart.title')}
        </h1>

        {!items.length ? (
          <EmptyCart />
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}

              <Button variant="outline" className="w-full" onClick={clearCart}>
                {t('cart.clearCart')}
              </Button>
            </div>

            {/* Order Summary */}
            <div className="glass rounded-lg p-6 h-fit sticky top-32">
              <h2 className="font-playfair text-2xl font-bold mb-6">
                {t('cart.summary.title')}
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('cart.summary.subtotal')}
                  </span>
                  <span className="font-semibold">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('cart.summary.shipping')}
                  </span>
                  <span className="font-semibold">
                    {shippingCost === 0
                      ? t('cart.summary.free')
                      : `€${(shippingCost as number).toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <div className="flex justify-between">
                    <span className="font-playfair text-xl font-bold">
                      {t('cart.summary.total')}
                    </span>
                    <span className="font-playfair text-xl font-bold text-gradient-gold">
                      €{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 mb-3"
                onClick={handleCheckout}
                disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('checkout.processing')}
                  </>
                ) : (
                  t('cart.checkout')
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {t('cart.secureCheckout')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;
