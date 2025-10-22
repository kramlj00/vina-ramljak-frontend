import AboutUs from "./components/about-us";
import Hero from "./components/hero";
import HomeCta from "./components/home-cta";
import WineList from "./components/wine-list";

const HomeView = () => {
  return (
    <main>
      <Hero />
      <WineList />
      <AboutUs />
      <HomeCta />
    </main>
  );
};

export default HomeView;
