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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
  const checkScreen = () => {
    setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
  };

  checkScreen();
  window.addEventListener('resize', checkScreen);
  return () => window.removeEventListener('resize', checkScreen);
}, []);

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
      {/* Section Title */}
      <section className="text-center -mt-26 mb-6 sm:mt-2 sm:mb-8 md:-mt-26 md:mb-18">
        <div className="text-center">
          {/* h2 for mobile only */}
          <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
            COMPETITIONS
          </h2>

          {/* h1 for desktop and up */}
          <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
            COMPETITIONS
          </h1>
        </div>
      </section>

      <div className="relative w-full overflow-hidden pb-6 mb-4">
        {/* Left Arrow */}
        <button
          onClick={() =>
            setCurrent((prev) => (prev - 1 + images.length) % images.length)
          }
          className="bg-[#1A1A1A] absolute z-30 top-[40%] left-[2.5%] md:left-[13.5%] w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-opacity-80 hover:bg-opacity-100 transition duration-300 group"
        >
          <Image
            src="/icons/previous_yellow.svg"
            alt="Previous"
            width={20}
            height={20}
            className="cursor-pointer w-3 sm:w-6 transition-transform group-hover:scale-110"
          />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() =>
            setCurrent((prev) => (prev + 1) % images.length)
          }
          className="bg-[#1A1A1A] absolute z-30 top-[40%] right-[2.5%] md:right-[12.5%] w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-opacity-80 hover:bg-opacity-100 transition duration-300 group"
        >
          <Image
            src="/icons/next_yellow.svg"
            alt="Next"
            width={20}
            height={20}
            className="cursor-pointer w-3 sm:w-6 transition-transform group-hover:scale-110"
          />
        </button>

        {/* Carousel Content */}
        <div className="mx-auto w-full max-w-[100%] overflow-hidden md:pb-10">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: isMobile
                ? `translateX(calc(${-current * 85}vw + 7.5vw))`
                : `translateX(calc(${-current * 66.66}vw + 16.66vw))`,
            }}
            onPointerDown={handleStart}
            onPointerUp={handleEnd}
            onPointerLeave={handleEnd}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className={`w-[85vw] md:w-[66.66vw] flex-shrink-0 transition-all duration-500 ease-in-out px-3 md:px-8 ${
                  index === current ? 'scale-100 z-20' : 'scale-90 opacity-70 z-10'
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