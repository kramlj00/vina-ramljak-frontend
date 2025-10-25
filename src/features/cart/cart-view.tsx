"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EmptyCart from "./components/empty-cart";
import { useTranslation } from "react-i18next";

const CartView = () => {
  const { t } = useTranslation();

  const cartItems = [];

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href={`/#${t("navigation.winesAnchor")}`}>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.continueShopping")}
          </Button>
        </Link>

        <h1 className="font-playfair text-5xl md:text-5xl font-bold md:h-[50px] mb-8 text-gradient-wine">
          {t("cart.title")}
        </h1>

        {!cartItems.length ? (
          <EmptyCart />
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {/* Cart items would be mapped here */}
            </div>

            {/* Order Summary */}
            <div className="glass rounded-lg p-6 h-fit sticky top-32">
              <h2 className="font-playfair text-2xl font-bold mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">€0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">€0.00</span>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <div className="flex justify-between">
                    <span className="font-playfair text-xl font-bold">
                      Total
                    </span>
                    <span className="font-playfair text-xl font-bold text-gradient-gold">
                      €0.00
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Proceed to Checkout
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;
