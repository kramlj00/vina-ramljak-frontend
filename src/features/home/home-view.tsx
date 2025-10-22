import AboutPreview from "./components/about-preview";
import Hero from "./components/hero";
import HomeCta from "./components/home-cta";
import WineList from "./components/wine-list";

const HomeView = () => {
  return (
    <main>
      <Hero />
      <WineList />
      <AboutPreview />
      <HomeCta />
    </main>
  );
};

export default HomeView;
