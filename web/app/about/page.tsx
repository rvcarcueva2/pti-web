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
    logo: "/PTI-logo.png",
    name: "FULL OF GRACE SCHOOL OF BANI INC.",
    address: "Quinaoanan, Bani, Pangasinan",
    contact: "+639604096012",
    instructor: "Master Jacqueline S. Manuel",
    facebook: "https://www.facebook.com/profile.php?id=100054213561564",
  },
  {
    id: 2,
    logo: "/PTI-logo.png",
    name: "WESTERN PANGASINAN WOLVES",
    address: "Bypass Rd., Palamis, Alaminos, Pangasinan",
    contact: "+639605553084",
    instructor: "Master Edison B. Manuel",
    facebook: "https://www.facebook.com/profile.php?id=100095382706285",
  },
  {
    id: 3,
    logo: "/PTI-logo.png",
    name: "YMCA DAGUPAN",
    address: "Tapuac, Dagupan, Pangasinan",
    contact: "+639605553084",
    instructor: "Master Edison B. Manuel",
    facebook: "https://www.facebook.com/profile.php?id=100064847794128",
  },
  {
    id: 4,
    logo: "/PTI-logo.png",
    name: "LEGION STRIKERS TAEKWONDO CLUB",
    address: "Purok 7, 430D, Santiago Norte, San Fernando, La Union",
    contact: "+639455308482",
    instructor: "Master Kenneth Lacsamana",
    facebook: "https://www.facebook.com/LSTCSanFernandoCity",
  },
  {
    id: 5,
    logo: "/PTI-logo.png",
    name: "ALLIANCE TAEKWONDO",
    address: "#98 Mendez St., Baesa, Quezon City",
    contact: "+639058155032",
    instructor: "Master Loreto Velasquez Jr.",
    facebook: "https://www.facebook.com/profile.php?id=100086396624763",
  },
  {
    id: 6,
    logo: "/PTI-logo.png",
    name: "BODY PERFECT TKD ROSALES",
    address: "Provincial Highway, Rosales, Pangasinan",
    contact: "+639622632167",
    instructor: "Master Vicente B. Vega",
    facebook: "https://www.facebook.com/profile.php?id=61575329454259",
  },
  {
    id: 7,
    logo: "/PTI-logo.png",
    name: "CUYAPO KNIGHTS TAEKWONDO",
    address: "Mabini St., District 2, Cuyapo, Nueva Ecija",
    contact: "+639622632167",
    instructor: "Master Vicente B. Vega",
    facebook: "https://www.facebook.com/CuyapoKnightsTkdClub",
  },
  {
    id: 8,
    logo: "/PTI-logo.png",
    name: "SAN MANUEL FLAMES TKD",
    address: "San Miguel, San Miguel, Tarlac",
    contact: "+639622632167",
    instructor: "Master Vicente B. Vega",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 9,
    logo: "/PTI-logo.png",
    name: "TALUGTUG VANGUARDS TKD",
    address: "Brgy. Quezon, Talugtug, Nueva Ecija",
    contact: "+639622632167",
    instructor: "Master Vicente B. Vega",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 10,
    logo: "/PTI-logo.png",
    name: "LE VAN TAEKWONDO",
    address: "Binalonan, Pangasinan",
    contact: "+639671860078",
    instructor: "Master Rhomar Rodillas",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 11,
    logo: "/PTI-logo.png",
    name: "JDG MARTIAL ARTS",
    address: "Centro 02, Lasam, Cagayan",
    contact: "+639157057841",
    instructor: "Master John David Galapon",
    facebook: "https://www.facebook.com/profile.php?id=100083562752938",
  },
  {
    id: 12,
    logo: "/PTI-logo.png",
    name: "STA. LUCIA HIGH SCHOOL TKD TEAM",
    address: "A. Mabini & P. Paterno Novaliches, Quezon City",
    contact: "+639632161931",
    instructor: "Master Daryl Hawod",
    facebook: "https://www.facebook.com/profile.php?id=61564443877129",
  },
  {
    id: 13,
    logo: "/PTI-logo.png",
    name: "MON'DAR ALLIANCE TKD NAPINDAN CHAPTER",
    address: "Napindan Integrated School Labao, Taguig City",
    contact: "+639959523185",
    instructor: "Master Simon Buraga",
    facebook: "https://www.facebook.com/IHaveNoIdeaWhatIWant",
  },
  {
    id: 14,
    logo: "/PTI-logo.png",
    name: "POWERHOUSE TAEKWONDO TRAINING CENTER - BAUANG CHAPTER",
    address: "Acao Elementary School, Acao, Bauang, La Union",
    contact: "+639360823296",
    instructor: "Master Allona Lyn Mina",
    facebook: "https://www.facebook.com/PHTTCFAM",
  },
  {
    id: 15,
    logo: "/PTI-logo.png",
    name: "FIDENS TAEKWONDO CLUB",
    address: "RCC Building, Poblacion East, Sta. Maria, Pangasinan",
    contact: "+639171098372",
    instructor: "Master Princess Mariano",
    facebook: "https://www.facebook.com/profile.php?id=100088555700659",
  },
  {
    id: 16,
    logo: "/PTI-logo.png",
    name: "FIDENS TAEKWONDO CLUB",
    address: "2nd Floor, Magic Annex, Urdaneta, Pangasinan",
    contact: "+639171098372",
    instructor: "Master Princess Mariano",
    facebook: "https://www.facebook.com/profile.php?id=100088555700659",
  },
  {
    id: 17,
    logo: "/PTI-logo.png",
    name: "FIDENS TAEKWONDO CLUB",
    address: "San Nicolas, Alcala, Pangasinan",
    contact: "+639171098372",
    instructor: "Master Princess Mariano",
    facebook: "https://www.facebook.com/profile.php?id=100088555700659",
  },
  {
    id: 18,
    logo: "/PTI-logo.png",
    name: "VIVA KIDS TAEKWONDO",
    address: "UCCP - Vigan City, Ilocos Sur",
    contact: "+639482489797",
    instructor: "Master Angelito A. Valle",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 19,
    logo: "/PTI-logo.png",
    name: "BURGOS TAEKWONDO CLUB",
    address: "Poblacion Norte, Burgos, Ilocos Norte",
    contact: "+639279331681",
    instructor: "Master Elmer C. Reyes",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 20,
    logo: "/PTI-logo.png",
    name: "VIVA TAEKWONDO CLUB CANDON",
    address: "Candon Trade Center, Ilocos Sur",
    contact: "+639667841282",
    instructor: "Master Benjie C. Raguindin",
    facebook: "https://www.facebook.com/profile.php?id=100088986412925",
  },
  {
    id: 21,
    logo: "/PTI-logo.png",
    name: "VIVA TAEKWONDO CLUB STA. MARIA",
    address: "Sta. Maria, Ilocos Sur",
    contact: "+639667841282",
    instructor: "Master Bengie C. Raguindin",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 22,
    logo: "/PTI-logo.png",
    name: "POWERHOUSE TAEKWONDO TRAINING CENTER",
    address: "Epic Mall, Nguilian, La Union",
    contact: "+639271636089",
    instructor: "Master Ernesto Nieveras",
    facebook: "https://www.facebook.com/PHTTCFAM",
  },
  {
    id: 23,
    logo: "/PTI-logo.png",
    name: "FIREFOX TAEKWONDO",
    address: "Blk. 21 Almaciga St. Binalonan, Pangasinan",
    contact: "+639685143935",
    instructor: "Master Ernesto Bisquerra Jr.",
    facebook: "https://www.facebook.com/profile.php?id=100071547405103",
  },
  {
    id: 24,
    logo: "/PTI-logo.png",
    name: "LAMUT NUEVA VIZCAYA TKD",
    address: "Lamut, Ifugao Nueva Vizcaya",
    contact: "+639777857233",
    instructor: "Master Marjorie Bu-ucan",
    facebook: "https://www.facebook.com/profile.php?id=61563538764907",
  },
  {
    id: 25,
    logo: "/PTI-logo.png",
    name: "VOX VANGUARDS TAEKWONDO",
    address: "Dagupan City, Pangasinan",
    contact: "+639090994939",
    instructor: "Master Jacqueline S. Manuel",
    facebook: "https://www.facebook.com/profile.php?id=61569134645049",
  },
  {
    id: 26,
    logo: "/PTI-logo.png",
    name: "ANDA EAGLE EYE TAEKWONDO CLUB",
    address: "Municipal Gymnasium, Anda, Pangasinan",
    contact: "+639954881843",
    instructor: "Master Aljohn Pacuos",
    facebook: "https://www.facebook.com/profile.php?id=61567086157191",
  },
  {
    id: 27,
    logo: "/PTI-logo.png",
    name: "SAN FERNANDO CITY WARRIORS",
    address: "San Fernando City, La Union",
    contact: "+639483270414",
    instructor: "Master Abelardo Ducusin Jr.",
    facebook: "https://www.facebook.com/SFCWarriors",
  },
];

const faqData = [
  {
    question: 'Who can join PTI?',
    answer: 'Anyone interested in martial arts training is welcome to join PTI.',
  },
  {
    question: 'Where are your training centers located?',
    answer: 'Our centers are located nationwide. Please visit our locations page for more info.',
  },
  {
    question: 'What are the requirements to join?',
    answer: 'You just need to fill out the registration form and attend the orientation.',
  },
  {
    question: 'What does the training cover?',
    answer: 'We cover basic to advanced martial arts, self-defense, and fitness training.',
  },
  {
    question: 'Do you offer belt promotions?',
    answer: 'Yes, we conduct regular belt examinations and promotions.',
  },
  {
    question: 'Can I compete under PTI?',
    answer: 'Absolutely! We encourage students to join local and international competitions.',
  },
  {
    question: 'How can I contact PTI for more information?',
    answer: 'You can reach us via email or our official Facebook page.',
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
            ABOUT
          </h2>

          {/* h1 for desktop and up */}
          <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
            ABOUT
          </h1>
        </div>

        <p className="text-responsive font-geist font-[450] mt-8 text-justify mx-auto max-w-6xl text-sm md:text-base leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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

      <section className="px-4 sm:px-4 pt-6 pb-10 text-center">
        <p className="text-responsive font-geist font-[450] mt-6 text-justify mx-auto max-w-6xl text-sm md:text-base leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
              src="/icons/previous.svg"
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
              src="/icons/next.svg"
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

      {/* Instructor Section */}
      <section className="py-8 md:py-20 grid grid-cols-1 md:grid-cols-[60%_40%] gap-6 md:gap-10 items-start mx-auto max-w-6xl px-4 sm:px-6">
        <div>
          {/* h4 for mobile only */}
          <h4 className="block md:hidden font-geist font-bold text-base mb-2">
            Master Loreto M. Velasquez
          </h4>

          {/* h3 for desktop and up */}
          <h3 className="hidden md:block font-geist font-bold text-lg mb-2">
            Master Loreto M. Velasquez
          </h3>
          <p className="text-responsive font-geist font-[450] text-justify pt-2 md:pt-4 text-sm md:text-base leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {/* Placeholder for image */}
        <div className="bg-gray-300 w-full h-[300px] md:h-[480px]" />
      </section>

      <section className="bg-black text-white pt-8 pb-16 px-6 md:pt-16 md:px-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start max-w-7xl mx-auto">
          {/* Left: FAQs Title */}
          <div className="mb-8 md:mb-0 md:w-1/2">
            <span className="font-poppins-black text-4xl md:text-7xl font-black text-center md:text-left leading-tight block w-full">
              FAQs
            </span>
          </div>

          {/* Right: Questions */}
          <div className="md:w-1/2 space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="border-b border-gray-700 pb-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <>
                    <h6 className="font-geist text-sm font-semibold block md:hidden">{faq.question}</h6>
                    <h5 className="font-geist text-lg font-semibold hidden md:block">{faq.question}</h5>
                  </>
                  <Image
                    src="/icons/plus.svg"
                    alt="Toggle"
                    width={24}
                    height={24}
                    className={`cursor-pointer transition-transform duration-200 ${
                      openIndex === index ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <p className="font-geist mt-2 text-xs md:text-base text-gray-300">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}