"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function CheckoutCancelPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-lg p-12">
            <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-6" />

            <h1 className="font-playfair text-4xl font-bold mb-4 text-gradient-wine">
              {t("checkout.cancel.title")}
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              {t("checkout.cancel.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cart">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  {t("checkout.cancel.backToCart")}
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  {t("checkout.cancel.backToHome")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
