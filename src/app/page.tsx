import AboutPreview from "@/components/home/about-preview";
import Hero from "@/components/home/hero";
import HomeCta from "@/components/home/home-cta";
import WineList from "@/components/home/wine-list";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <WineList />
      <AboutPreview />
      <HomeCta />
    </main>
  );
};

export default HomePage;
