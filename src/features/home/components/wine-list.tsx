"use client";

import { useTranslation } from "react-i18next";
import { getWines } from "../utils";
import WineCard from "./wine-card";

const WineList = () => {
  const { t } = useTranslation();

  const wines = getWines(t);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-delay">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-gradient-wine">
            Our Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully crafted selection of premium Croatian wines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {wines.map((wine, index) => (
            <div
              key={wine.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <WineCard {...wine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WineList;
