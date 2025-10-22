import { TFunction } from "i18next";

export interface Wine {
  id: string;
  name: string;
  type: string;
  price: number;
  imageSrc: string;
  description: string;
  fullDescription: string;
  alcohol: string;
  vintage: string;
  grapes: string[];
  tastingNotes: string[];
  foodPairing: string[];
}

export const getWines = (t: TFunction): Wine[] => {
  return [
    {
      id: "rose",
      name: t("wines.rose.name"),
      type: t("wines.rose.type"),
      price: 18,
      imageSrc: "/images/wine-rose.jpg",
      description:
        "Elegant Croatian rosé with delicate fruit notes and refreshing acidity.",
      fullDescription: t("wines.rose.fullDescription"),
      alcohol: "12.5%",
      vintage: "2023",
      grapes: [t("grapes.plavina"), t("grapes.merlot")],
      tastingNotes: t("wines.rose.tastingNotes").split(","),
      foodPairing: t("wines.rose.foodPairing").split(","),
    },
    {
      id: "crno",
      name: t("wines.crno.name"),
      type: t("wines.crno.type"),
      price: 25,
      imageSrc: "/images/wine-crno.jpg",
      description: t("wines.crno.description"),
      fullDescription: t("wines.crno.fullDescription"),
      alcohol: "14%",
      vintage: "2021",
      grapes: [t("grapes.plavina"), t("grapes.lasin"), t("grapes.merlot")],
      tastingNotes: t("wines.crno.tastingNotes").split(","),
      foodPairing: t("wines.crno.foodPairing").split(","),
    },
    {
      id: "merlot",
      name: t("wines.merlot.name"),
      type: t("wines.merlot.type"),
      price: 22,
      imageSrc: "/images/wine-merlot.jpg",
      description: t("wines.merlot.description"),
      fullDescription: t("wines.merlot.fullDescription"),
      alcohol: "13.5%",
      vintage: "2020",
      grapes: [t("grapes.merlot")],
      tastingNotes: t("wines.merlot.tastingNotes").split(","),
      foodPairing: t("wines.merlot.foodPairing").split(","),
    },
  ];
};
