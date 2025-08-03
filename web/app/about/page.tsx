'use client';

import "@/app/globals.css";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper'; // ✅ Fix TypeError

import 'swiper/css';
import 'swiper/css/navigation';
import { NavigationOptions } from "swiper/types";

// Sample affiliations data
const affiliations = [
  {
    id: 1,
    logo: "/affiliates/1.png",
    name: "FULL OF GRACE SCHOOL OF BANI INC.",
    address: "Quinaoanan, Bani, Pangasinan",
    contact: "+639604096012",
    instructor: "Master Jacqueline S. Manuel",
    facebook: "https://www.facebook.com/profile.php?id=100054213561564",
  },
  {
    id: 2,
    logo: "/affiliates/2.png",
    name: "WESTERN PANGASINAN WOLVES",
    address: "Bypass Rd., Palamis, Alaminos, Pangasinan",
    contact: "+639605553084",
    instructor: "Master Edison B. Manuel",
    facebook: "https://www.facebook.com/profile.php?id=100095382706285",
  },
  {
    id: 3,
    logo: "/affiliates/3.png",
    name: "YMCA DAGUPAN",
    address: "Tapuac, Dagupan, Pangasinan",
    contact: "+639605553084",
    instructor: "Master Edison B. Manuel",
    facebook: "https://www.facebook.com/profile.php?id=100064847794128",
  },
  {
    id: 4,
    logo: "/affiliates/4.png",
    name: "LEGION STRIKERS TAEKWONDO CLUB",
    address: "Purok 7, 430D, Santiago Norte, San Fernando, La Union",
    contact: "+639455308482",
    instructor: "Master Kenneth Lacsamana",
    facebook: "https://www.facebook.com/LSTCSanFernandoCity",
  },
  {
    id: 5,
    logo: "/affiliates/5.png",
    name: "ALLIANCE TAEKWONDO",
    address: "#98 Mendez St., Baesa, Quezon City",
    contact: "+639058155032",
    instructor: "Master Loreto Velasquez Jr.",
    facebook: "https://www.facebook.com/profile.php?id=100086396624763",
  },
  {
    id: 6,
    logo: "/affiliates/6.png",
    name: "BODY PERFECT TKD ROSALES",
    address: "Provincial Highway, Rosales, Pangasinan",
    contact: "+639622632167",
    instructor: "Master Vicente B. Vega",
    facebook: "https://www.facebook.com/profile.php?id=61575329454259",
  },
  {
    id: 7,
    logo: "/affiliates/7.png",
    name: "CUYAPO KNIGHTS TAEKWONDO",
    address: "Mabini St., District 2, Cuyapo, Nueva Ecija",
    contact: "+639622632167",
    instructor: "Master Vicente B. Vega",
    facebook: "https://www.facebook.com/CuyapoKnightsTkdClub",
  },
  {
    id: 8,
    logo: "/affiliates/8.png",
    name: "SAN MANUEL FLAMES TKD",
    address: "San Miguel, San Miguel, Tarlac",
    contact: "+639622632167",
    instructor: "Master Vicente B. Vega",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 9,
    logo: "/affiliates/9.png",
    name: "TALUGTUG VANGUARDS TKD",
    address: "Brgy. Quezon, Talugtug, Nueva Ecija",
    contact: "+639622632167",
    instructor: "Master Vicente B. Vega",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 10,
    logo: "/affiliates/10.png",
    name: "LE VAN TAEKWONDO",
    address: "Binalonan, Pangasinan",
    contact: "+639671860078",
    instructor: "Master Rhomar Rodillas",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 11,
    logo: "/affiliates/11.png",
    name: "JDG MARTIAL ARTS",
    address: "Centro 02, Lasam, Cagayan",
    contact: "+639157057841",
    instructor: "Master John David Galapon",
    facebook: "https://www.facebook.com/profile.php?id=100083562752938",
  },
  {
    id: 12,
    logo: "/affiliates/12.png",
    name: "STA. LUCIA HIGH SCHOOL TKD TEAM",
    address: "A. Mabini & P. Paterno Novaliches, Quezon City",
    contact: "+639632161931",
    instructor: "Master Daryl Hawod",
    facebook: "https://www.facebook.com/profile.php?id=61564443877129",
  },
  {
    id: 13,
    logo: "/affiliates/13.png",
    name: "MON'DAR ALLIANCE TKD NAPINDAN CHAPTER",
    address: "Napindan Integrated School Labao, Taguig City",
    contact: "+639959523185",
    instructor: "Master Simon Buraga",
    facebook: "https://www.facebook.com/IHaveNoIdeaWhatIWant",
  },
  {
    id: 14,
    logo: "/affiliates/14.png",
    name: "POWERHOUSE TAEKWONDO TRAINING CENTER - BAUANG CHAPTER",
    address: "Acao Elementary School, Acao, Bauang, La Union",
    contact: "+639360823296",
    instructor: "Master Allona Lyn Mina",
    facebook: "https://www.facebook.com/PHTTCFAM",
  },
  {
    id: 15,
    logo: "/affiliates/15.png",
    name: "FIDENS TAEKWONDO CLUB",
    address: "RCC Building, Poblacion East, Sta. Maria, Pangasinan",
    contact: "+639171098372",
    instructor: "Master Princess Mariano",
    facebook: "https://www.facebook.com/profile.php?id=100088555700659",
  },
  {
    id: 16,
    logo: "/affiliates/16.png",
    name: "FIDENS TAEKWONDO CLUB",
    address: "2nd Floor, Magic Annex, Urdaneta, Pangasinan",
    contact: "+639171098372",
    instructor: "Master Princess Mariano",
    facebook: "https://www.facebook.com/profile.php?id=100088555700659",
  },
  {
    id: 17,
    logo: "/affiliates/17.png",
    name: "FIDENS TAEKWONDO CLUB",
    address: "San Nicolas, Alcala, Pangasinan",
    contact: "+639171098372",
    instructor: "Master Princess Mariano",
    facebook: "https://www.facebook.com/profile.php?id=100088555700659",
  },
  {
    id: 18,
    logo: "/affiliates/18.png",
    name: "VIVA KIDS TAEKWONDO",
    address: "UCCP - Vigan City, Ilocos Sur",
    contact: "+639482489797",
    instructor: "Master Angelito A. Valle",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 19,
    logo: "/affiliates/19.png",
    name: "BURGOS TAEKWONDO CLUB",
    address: "Poblacion Norte, Burgos, Ilocos Norte",
    contact: "+639279331681",
    instructor: "Master Elmer C. Reyes",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 20,
    logo: "/affiliates/20.png",
    name: "VIVA TAEKWONDO CLUB CANDON",
    address: "Candon Trade Center, Ilocos Sur",
    contact: "+639667841282",
    instructor: "Master Benjie C. Raguindin",
    facebook: "https://www.facebook.com/profile.php?id=100088986412925",
  },
  {
    id: 21,
    logo: "/affiliates/21.png",
    name: "VIVA TAEKWONDO CLUB STA. MARIA",
    address: "Sta. Maria, Ilocos Sur",
    contact: "+639667841282",
    instructor: "Master Bengie C. Raguindin",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 22,
    logo: "/affiliates/22.png",
    name: "POWERHOUSE TAEKWONDO TRAINING CENTER",
    address: "Epic Mall, Nguilian, La Union",
    contact: "+639271636089",
    instructor: "Master Ernesto Nieveras",
    facebook: "https://www.facebook.com/PHTTCFAM",
  },
  {
    id: 23,
    logo: "/affiliates/23.png",
    name: "FIREFOX TAEKWONDO",
    address: "Blk. 21 Almaciga St. Binalonan, Pangasinan",
    contact: "+639685143935",
    instructor: "Master Ernesto Bisquerra Jr.",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 24,
    logo: "/affiliates/24.png",
    name: "LAMUT NUEVA VIZCAYA TKD",
    address: "Lamut, Ifugao Nueva Vizcaya",
    contact: "+639777857233",
    instructor: "Master Marjorie Bu-ucan",
    facebook: "https://www.facebook.com/profile.php?id=61563538764907",
  },
  {
    id: 25,
    logo: "/affiliates/25.png",
    name: "VOX VANGUARDS TAEKWONDO",
    address: "Dagupan City, Pangasinan",
    contact: "+639090994939",
    instructor: "Master Jacqueline S. Manuel",
    facebook: "https://www.facebook.com/profile.php?id=61569134645049",
  },
  {
    id: 26,
    logo: "/affiliates/26.png",
    name: "ANDA EAGLE EYE TAEKWONDO CLUB",
    address: "Municipal Gymnasium, Anda, Pangasinan",
    contact: "+639954881843",
    instructor: "Master Aljohn Pacuos",
    facebook: "https://www.facebook.com/profile.php?id=61567086157191",
  },
  {
    id: 27,
    logo: "/affiliates/27.png",
    name: "SAN FERNANDO CITY WARRIORS",
    address: "San Fernando City, La Union",
    contact: "+639483270414",
    instructor: "Master Abelardo Ducusin Jr.",
    facebook: "https://www.facebook.com/SFCWarriors",
  },
];

export default function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params &&
      swiperRef.current.navigation &&
      prevRef.current &&
      nextRef.current
    ) {
      const navigation = swiperRef.current.params.navigation as NavigationOptions;

      if (typeof navigation === 'object') {
        navigation.prevEl = prevRef.current;
        navigation.nextEl = nextRef.current;
      }

      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [loaded]);

  return (
    <>
      {/* ABOUT Section */}
      <section className="px-4 sm:px-4 pt-10 md:pt-16 pb-10 text-center">
        <div className="text-center">
          {/* h3 for mobile only */}
          <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
            MISSION
          </h2>

          {/* h1 for desktop and up */}
          <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
            MISSION
          </h1>
        </div>

        <p className="text-responsive font-geist font-[450] mt-8 text-justify mx-auto max-w-6xl text-sm md:text-base leading-relaxed">
          To develop and promote the practice of taekwondo to individuals who are passionate on the said sport by providing an excellent quality of training, discipline, and sportsmanship. We aim to support athletes in their journey to national and international success by building an inclusive community for Taekwondoins to excel and grow.
        </p>
      </section>

      <section className="px-4 sm:px-20 mt-[-18px] mb-[-20px] md:-mt-3">
        <Image
          src="/images/PTI.png"
          alt="PTI Group"
          width={1200}
          height={800}
          className="w-full h-auto max-w-6xl mx-auto"
        />
      </section>

      <section className="px-4 sm:px-4 pt-10 md:pt-16 pb-10 text-center">
        <div className="text-center">
          {/* h3 for mobile only */}
          <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
            VISION
          </h2>

          {/* h1 for desktop and up */}
          <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
            VISION
          </h1>
        </div>

        <p className="text-responsive font-geist font-[450] mt-8 text-justify mx-auto max-w-6xl text-sm md:text-base leading-relaxed">
          To establish Pilipinas Taekwondo as a dominant force in the global taekwondo community, recognized for its commitment to excellence, integrity, and innovation. We envision a thriving taekwondo community where every athlete has the opportunity to achieve their full potential and contribute to the sport's growth and success both locally and internationally.
        </p>
      </section>

      {/* AFFILIATIONS Carousel */}
      <section className="bg-[#1A1A1A] text-white text-center py-10 md:py-16 font-geist relative">
        <div className="text-center mb-10">
          <h3 className="block md:hidden font-poppins-black text-[#FED018] text-lg w-fit mx-auto">AFFILIATIONS</h3>
          <h2 className="hidden md:block font-poppins-black text-[#FED018] text-xl w-fit mx-auto">AFFILIATIONS</h2>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative">
          {/* Prev Arrow */}
          <div
            ref={prevRef}
            className="absolute md:-left-6 left-1/2 -translate-x-[calc(100%+140px)] top-1/2 -translate-y-1/2 z-10 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center cursor-pointer"
          >
            <Image
              src="/icons/previous_yellow.svg"
              alt="Previous"
              width={34}
              height={32}
              className="w-[34px] h-[32px]"
            />
          </div>

          {/* Next Arrow */}
          <div
            ref={nextRef}
            className="absolute md:-right-6 right-1/2 translate-x-[calc(100%+140px)] top-1/2 -translate-y-1/2 z-10 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center cursor-pointer"
          >
            <Image
              src="/icons/next_yellow.svg"
              alt="Next"
              width={34}
              height={32}
              className="w-[34px] h-[32px]"
            />
          </div>

          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;

              setTimeout(() => {
                if (prevRef.current && nextRef.current && swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;

                  swiper.navigation.destroy();
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              }, 100);

              setLoaded(true);
            }}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {affiliations.map((partner) => (
              <SwiperSlide key={partner.id}>
                <div className="text-responsive bg-white text-black p-3 md:p-6 rounded-md shadow-md h-[320px] md:min-h-[400px] flex flex-col items-center w-[260px] md:w-auto mx-auto">
                  <Image
                    src={partner.logo}
                    alt={`Logo of ${partner.name}`}
                    width={100}
                    height={100}
                    className="w-20 md:w-28 h-auto object-contain mb-3 md:mb-4"
                  />
                  <h6 className="text-[11px] md:text-sm font-bold text-center uppercase mb-2">{partner.name}</h6>
                  <div className="flex flex-col items-center justify-center flex-grow text-center gap-1">
                    <p className="text-responsive text-[9px] md:text-xs">Address: {partner.address}</p>
                    <p className="text-responsive text-[9px] md:text-xs">Contact: {partner.contact}</p>
                    <p className="text-responsive text-[9px] md:text-xs">Instructor: {partner.instructor}</p>
                  </div>

                  {partner.facebook && (
                    <a
                      href={partner.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white text-[11px] md:text-sm py-1.5 px-3.5 md:py-2 md:px-4 w-full rounded flex items-center justify-center gap-2 cursor-pointer group mt-3 md:mt-4"
                    >
                      <span className="relative w-3 h-3 md:w-4 md:h-4 font-black">
                        <Image
                          src="/icons/facebook1.svg"
                          alt="Facebook"
                          fill
                          className="object-contain absolute inset-0 group-hover:hidden"
                        />
                        <Image
                          src="/icons/facebook2.svg"
                          alt="Facebook Hover"
                          fill
                          className="object-contain absolute inset-0 hidden group-hover:block"
                        />
                      </span>
                      INQUIRE NOW
                    </a>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}