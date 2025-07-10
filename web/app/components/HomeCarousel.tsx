'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const images = [
  { src: '/images/Competition.png', link: '/news/competition-1' },
  { src: '/images/Competition.png', link: '/news/competition-2' },
  { src: '/images/Competition.png', link: '/news/competition-3' },
];

export default function HomeCarousel() {
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
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/Hero.png"
            alt="Pilipinas Taekwondo Incorporated"
            fill
            priority
            className="object-contain object-top w-full h-full"
          />
        </div>
      </div>

      {/* Section Title */}
      <section className="px-4 -mt-35 pt-1 pb-10 text-center">
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
                className={`w-[66.66vw] flex-shrink-0 transition-all duration-500 ease-in-out px-3 ${index === current ? 'scale-100 z-20' : 'scale-85 opacity-70 z-10'
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
    </>
  );
}
