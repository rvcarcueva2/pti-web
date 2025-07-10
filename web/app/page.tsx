import HomeCarousel from './components/HomeCarousel';
import FeaturedNewsSection from './components/FeaturedNewsSection';

export default function Home() {
  return (
    <main>
      <HomeCarousel />
      <FeaturedNewsSection />
      <div className="w-full h-[100px]" />
      
    </main>
  );
}
