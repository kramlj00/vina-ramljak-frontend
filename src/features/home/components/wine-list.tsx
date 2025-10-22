"use client";

import { useTranslation } from "react-i18next";
import { getWines } from "../utils";
import WineCard from "./wine-card";
import SectionTitle from "@/components/section-title";

const WineList = () => {
  const { t } = useTranslation();

  const wines = getWines(t);

  return (
    <section id={t("navigation.winesAnchor")} className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={t("wines.title")}
          description={t("wines.description")}
        />

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
