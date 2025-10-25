"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/cart-context";

function SuccessContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const session = searchParams.get("session_id");

  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);

  //   cs_test_a11ARNdrIa54eDU6LBxs8eqxdg057IN9l7jzv6QCNrFMjJtbsmlKdR0jOW
  useEffect(() => {
    if (session) {
      setSessionId(session);
      // Clear cart after successful payment
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-lg p-12">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />

            <h1 className="font-playfair text-4xl font-bold mb-4 text-gradient-wine">
              {t("checkout.success.title")}
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              {t("checkout.success.description")}
            </p>

            {sessionId && (
              <div className="glass rounded-lg p-4 mb-8 text-sm">
                <p className="text-muted-foreground">
                  {t("checkout.success.orderNumber")}
                </p>
                <p className="font-mono font-semibold mt-1 break-all">
                  {sessionId}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-muted-foreground">
                {t("checkout.success.emailConfirmation")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    {t("checkout.success.backToHome")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
