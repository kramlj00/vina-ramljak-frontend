import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface WineCardProps {
  id: string;
  name: string;
  type: string;
  price: number;
  imageSrc: string;
  description: string;
}

const WineCard = ({
  id,
  name,
  type,
  price,
  imageSrc,
  description,
}: WineCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="glass rounded-lg overflow-hidden hover-lift group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-6">
        <div className="mb-3">
          <span className="text-xs font-inter font-medium text-accent uppercase tracking-wider">
            {type}
          </span>
          <h3 className="font-playfair text-2xl font-bold mt-1 text-gradient-wine">
            {name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-playfair font-bold text-gradient-gold">
            €{price}
          </span>

          <div className="flex space-x-2">
            <Link href={`/wines/${id}`}>
              <Button variant="outline" size="sm" className="border-border/50">
                {t("wines.details")}
              </Button>
            </Link>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <ShoppingCart className="h-4 w-4 mr-1" />
              {t("wines.add")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WineCard;
