import HeroSection from "@/components/HeroSection";
import BannerSlider from "@/components/BannerSlider";
import PrivilegesSection from "@/components/PrivilegesSection";
import BasindaBizSection from "@/components/BasindaBizSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedVillasSection from "@/components/FeaturedVillasSection";
import AllVillasSection from "@/components/AllVillasSection";
import LastVisitedSection from "@/components/LastVisitedSection";
import MostSearchedSection from "@/components/MostSearchedSection";
import MobileBestPriceBanner from "@/components/MobileBestPriceBanner";
import MobileSearchBar from "@/components/MobileSearchBar";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: heroData } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["homepage_hero", "homepage_hero_title", "homepage_hero_subtitle", "homepage_hero_color"]);

  const heroSettings = {
    bgImage: heroData?.find(d => d.key === "homepage_hero")?.value ?? null,
    title: heroData?.find(d => d.key === "homepage_hero_title")?.value ?? "TÜRSAB Resmi Villa Kiralama Acentesi",
    subtitle: heroData?.find(d => d.key === "homepage_hero_subtitle")?.value ?? "Size en uygun villayı, en iyi fiyat garantisi ile ve ücretsiz iptal ve iade fırsatlarından yararlanarak kiralayın. Onaylanmış Villa Portföyü, tecrübeli ve güleryüzlü destek ekibiyle hizmetinizde...",
    color: heroData?.find(d => d.key === "homepage_hero_color")?.value ?? "#ffffff",
  };

  return (
    <main>
      <MobileSearchBar />
      <HeroSection 
        bgImage={heroSettings.bgImage} 
        title={heroSettings.title}
        subtitle={heroSettings.subtitle}
        textColor={heroSettings.color}
      />
      <CategoriesSection />
      <MobileBestPriceBanner />
      <BannerSlider />
      <PrivilegesSection />
      <BasindaBizSection />
      <FeaturedVillasSection />
      <AllVillasSection />
      <LastVisitedSection />
      <MostSearchedSection />
    </main>
  );
}
