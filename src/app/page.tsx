import HeroSection from "@/components/HeroSection";
import PrivilegesSection from "@/components/PrivilegesSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedVillasSection from "@/components/FeaturedVillasSection";
import AllVillasSection from "@/components/AllVillasSection";
import MapViewButton from "@/components/MapViewButton";
import LastVisitedSection from "@/components/LastVisitedSection";
import MostSearchedSection from "@/components/MostSearchedSection";
import MobileBestPriceBanner from "@/components/MobileBestPriceBanner";
import MobileSearchBar from "@/components/MobileSearchBar";

export default function Home() {
  return (
    <main>
      <MobileSearchBar />
      <HeroSection />
      <CategoriesSection />
      <MobileBestPriceBanner />
      <PrivilegesSection />
      <FeaturedVillasSection />
      <AllVillasSection />
      <MapViewButton />
      <LastVisitedSection />
      <MostSearchedSection />
    </main>
  );
}
