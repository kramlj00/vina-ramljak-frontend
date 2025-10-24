"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const EmptyCart = () => {
  const { t } = useTranslation();

  return (
    <div className="glass rounded-lg p-12 text-center">
      <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
      <h2 className="font-playfair text-2xl font-bold mb-2">
        {t("cart.empty.title")}
      </h2>
      <p className="text-muted-foreground mb-6">
        {t("cart.empty.description")}
      </p>
      <Link href={`/#${t("navigation.winesAnchor")}`}>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          {t("cart.empty.button")}
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
