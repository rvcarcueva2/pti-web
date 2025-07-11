import HomeCarousel from './components/HomeCarousel';
import FeaturedNewsSection from './components/FeaturedNewsSection';
import Image from 'next/image';


export default function Home() {
  return (
    <main className="p-0 m-0">
      {/* Hero Image */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full h-[365px] sm:h-[465px] md:h-[585px] lg:h-[665px] xl:h-[745px]">
          <Image
            src="/images/Hero.png"
            alt="Pilipinas Taekwondo Incorporated"
            fill
            priority
            className="object-contain object-top"
          />
        </div>
      </div>

      <HomeCarousel />
      <FeaturedNewsSection />

      {/* Bottom Spacer */}
      <div className="w-full h-[60px]" />
    </main>
  );
}
