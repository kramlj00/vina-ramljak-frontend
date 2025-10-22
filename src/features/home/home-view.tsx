import AboutUs from "./components/about-us";
import Blog from "./components/blog";
import Gallery from "./components/gallery";
import Hero from "./components/hero";
import HomeCta from "./components/home-cta";
import WineList from "./components/wine-list";

const HomeView = () => {
  return (
    <main>
      <Hero />
      <WineList />
      <AboutUs />
      <Gallery />
      <Blog />
      <HomeCta />
    </main>
  );
};

export default HomeView;
