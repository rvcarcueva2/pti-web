'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const images = [
  { src: '/images/Competition.png', link: '/news/competition-1' },
  { src: '/images/Competition.png', link: '/news/competition-2' },
  { src: '/images/Competition.png', link: '/news/competition-3' },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // DRAG HANDLERS
  const handleStart = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const endX = e.clientX;
    const diff = endX - startX.current;

    if (diff > 50) {
      // Swipe Right
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
    } else if (diff < -50) {
      // Swipe Left
      setCurrent((prev) => (prev + 1) % images.length);
    }

    isDragging.current = false;
  };

  return (
    <>
      {/* Hero Background */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="relative w-full h-auto">
          <Image
            src="/images/Hero.png"
            alt="Pilipinas Taekwondo Incorporated"
            width={1920}
            height={1080}
            priority
            className="w-full h-auto object-contain object-top"
          />
        </div>
      </div>

      {/* Section Title */}
      <section className="-mt-28 px-4 pt-10 pb-10 text-center">
        <h1 className="font-poppins-black text-3xl border-b-4 border-[#FED018] inline-block pb-2">
          COMPETITIONS
        </h1>
      </section>

      <div className="relative w-full overflow-hidden pb-20 mb-10">
  {/* Left Arrow */}
  <button
    onClick={() =>
      setCurrent((prev) => (prev - 1 + images.length) % images.length)
    }
    className="bg-[#1A1A1A] absolute z-30 top-1/2 -translate-y-1/2 left-[13%] w-10 h-10 flex items-center justify-center rounded-full bg-opacity-80 hover:bg-opacity-100 transition duration-300 group"
  >
    <span className="text-2xl text-[#FED018] group-hover:scale-110 transition">&#10094;</span>
  </button>

  {/* Right Arrow */}
  <button
    onClick={() =>
      setCurrent((prev) => (prev + 1) % images.length)
    }
    className="bg-[#1A1A1A] absolute z-30 top-1/2 -translate-y-1/2 right-[12.5%] w-10 h-10 flex items-center justify-center rounded-full bg-opacity-80 hover:bg-opacity-100 transition duration-300 group"
  >
    <span className="text-2xl text-[#FED018] group-hover:scale-110 transition">&#10095;</span>
  </button>

  {/* Carousel Content */}
  <div className="mx-auto w-full max-w-[100%] overflow-hidden">
    <div
      ref={carouselRef}
      className="flex transition-transform duration-700 ease-in-out"
      style={{
        transform: `translateX(calc(${-current * 66.66}vw + 16.66vw))`,
      }}
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={`w-[66.66vw] flex-shrink-0 transition-all duration-500 ease-in-out px-3 ${
            index === current ? 'scale-100 z-20' : 'scale-85 opacity-70 z-10'
          }`}
        >
          <Link href={image.link}>
            <div className="border-[3px] border-black overflow-hidden cursor-pointer">
              <Image
                src={image.src}
                alt={`Slide ${index + 1}`}
                width={1200}
                height={600}
                className="object-cover w-full h-auto"
              />
            </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
</div>



      {/* Featured Section */}
      <div className="w-full bg-[#1A1A1A] h-[350px] relative z-10">
        <div className="max-w-8xl mx-auto h-full flex items-center px-6 gap-x-6 z-20 relative">
          <div className="w-[45%] pl-6">
            <div className="w-full h-[400px] relative border shadow-lg">
              <Image
                src="/images/Competition.png"
                alt="Featured Competition"
                fill
                className="object-cover rounded-sm"
                priority
              />
            </div>
          </div>

          <div className="w-[55%] max-w-[85rem]">
            <div className="text-white p-6 rounded-md bg-opacity-60">
              <h2 className="font-geist font-black text-xl md:text-2xl mb-2">Featured News</h2>
              <h3 className="font-geist font-bold text-[#FED018] text-lg mb-4">Title</h3>
              <p className="font-geist text-sm mb-6 leading-relaxed text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <a
                href="#"
                className="text-[#FED018] font-semibold inline-flex items-center gap-2 group"
              >
                Discover the full story
                <span
                  className="text-2xl transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[100px]" />
    </>
  );
}