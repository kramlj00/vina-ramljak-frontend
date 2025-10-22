"use client";

import { useState } from "react";
import { GalleryCategory, getGalleryCategories } from "../utils";
import { useTranslation } from "react-i18next";
import GalleryModal from "./modals/gallery-modal";

const Gallery = () => {
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] =
    useState<GalleryCategory | null>(null);

  const galleryCategories = getGalleryCategories(t);

  return (
    <>
      <section id={t("navigation.galleryAnchor")} className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-gradient-wine">
              {t("gallery.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("gallery.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="relative aspect-[4/3] rounded-lg overflow-hidden glass group hover-lift cursor-pointer"
              >
                <img
                  src={category.coverImage}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-playfair text-xl font-bold text-white">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GalleryModal
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </>
  );
};

export default Gallery;
