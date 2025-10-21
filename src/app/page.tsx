import AboutPreview from "@/components/home/about-preview";
import Hero from "@/components/home/hero";
import WineList from "@/components/home/wine-list";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <WineList />
      <AboutPreview />
    </main>
  );
};

export default HomePage;
