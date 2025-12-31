'use client';

import "@/app/globals.css";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

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

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

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
          <strong>Pilipinas Taekwondo</strong> is a Taekwondo organization founded in 2018 with a clear and enduring purpose:
          to uphold the values of traditional Taekwondo while forming disciplined, confident, and principled individuals.
          We believe that Taekwondo is not merely a sport or physical activity.
          It is a lifelong discipline that shapes character, instills respect, and develops leadership.</p>

        <p className="text-responsive font-geist font-[450] mt-8 text-justify mx-auto max-w-6xl text-sm md:text-base leading-relaxed">
          Pilipinas Taekwondo was established as a response to the need for proper guidance, ethical instruction, and value-centered training in the practice of Taekwondo.
          From its founding, the organization has emphasized discipline over shortcuts, character over rank, and responsibility over recognition.

          Built on the foundation laid by its founder and strengthened by the next generation of leadership, Pilipinas Taekwondo continues to grow as a community bound by tradition, respect, and shared purpose.
        </p>
      </section>

      <section className="px-4 sm:px-20 mt-[-20px] mb-[-20px] md:-mt-3">
        <Image
          src="/images/PTI.png"
          alt="PTI Group"
          width={1200}
          height={800}
          className="w-full h-auto max-w-6xl mx-auto"
        />
      </section>

      <section className="px-4 mt-5 sm:px-4 pt-10 md:pt-16 pb-10 text-center">
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

        <p className="text-responsive font-geist font-[450] mt-8 text-center mx-auto max-w-6xl text-sm md:text-base leading-relaxed">
          To develop and promote the practice of taekwondo to individuals who are passionate on the said sport by providing an excellent quality of training, discipline, and sportsmanship. We aim to support athletes in their journey to national and international success by building an inclusive community for Taekwondoins to excel and grow.
        </p>
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

        <p className="text-responsive font-geist font-[450] mt-8 text-center mx-auto max-w-6xl text-sm md:text-base leading-relaxed">
          To establish Pilipinas Taekwondo as a dominant force in the global taekwondo community, recognized for its commitment to excellence, integrity, and innovation. We envision a thriving taekwondo community where every athlete has the opportunity to achieve their full potential and contribute to the sport's growth and success both locally and internationally.
        </p>
      </section>

      <section className="px-4 sm:px-6 pt-10 md:pt-16 pb-10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-10">

          {/* PHILOSOPHY */}
          <div className="flex-1 text-center">
            <div>
              <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                OUR PHILOSOPHY
              </h2>
              <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                OUR PHILOSOPHY
              </h1>
            </div>

            <p className="mt-8 text-responsive font-geist font-[450] text-sm md:text-base leading-relaxed text-left pl-6">
              We believe that:
            </p>

            <ul className="p-4 pl-10 text-responsive font-geist font-[450] text-left text-sm md:text-base leading-relaxed space-y-2 list-disc list-inside">
              <li>Technique without character is incomplete</li>
              <li>Power without discipline is dangerous</li>
              <li>Rank is earned through responsibility, not entitlement</li>
              <li>
                True mastery begins with humility, discipline, and respect for tradition.
              </li>
            </ul>
          </div>

          {/* CORE VALUES */}
          <div className="flex-1 text-center">
            <div>
              <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                OUR CORE VALUES
              </h2>
              <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                OUR CORE VALUES
              </h1>
            </div>

            <p className="mt-8 text-responsive font-geist font-[450] text-sm md:text-base leading-relaxed text-left pl-6">
              Pilipinas Taekwondo upholds the traditional tenets of Taekwondo as the foundation of all training:
            </p>

            <ul className="p-4 pl-10 mx-auto max-w-6xl
               text-responsive font-geist font-[450]
               text-left text-sm md:text-base leading-relaxed
               space-y-3
               list-disc list-inside">
              <li>
                <span className="font-semibold">Courtesy (Ye Ui)</span>
                <p className="ml-4 ">
                  Respect for instructors, fellow students, parents, and oneself.
                </p>
              </li>

              <li>
                <span className="font-semibold">Integrity (Yom Chi)</span>
                <p className="ml-4">
                  Honesty in action, words, and conduct—both inside and outside the dojang.
                </p>
              </li>

              <li>
                <span className="font-semibold">Perseverance (In Nae)</span>
                <p className="ml-4">
                  The strength to endure hardship, challenges, and continuous training.
                </p>
              </li>

              <li>
                <span className="font-semibold">Self-Control (Guk Gi)</span>
                <p className="ml-4">
                  Mastery of emotion, behavior, and discipline under pressure.
                </p>
              </li>

              <li>
                <span className="font-semibold">Indomitable Spirit (Baekjul Boolgool)</span>
                <p className="ml-4">
                  Courage and resolve that does not yield in the face of adversity.
                </p>
              </li>
            </ul>
          </div>

        </div>
      </section>

      <section className="px-4 sm:px-6 pt-10 md:pt-16 pb-10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-10">

          {/* OUR COMMITMENT */}
          <div className="flex-1 text-center">
            <div>
              <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                OUR COMMITMENT
              </h2>
              <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                OUR COMMITMENT
              </h1>
            </div>

            <p className="mt-8 text-responsive font-geist font-[450] text-sm md:text-base leading-relaxed text-left pl-6">
              Pilipinas Taekwondo is committed to:
            </p>

            <ul className="p-4 pl-10 text-responsive font-geist font-[450] text-left text-sm md:text-base leading-relaxed space-y-2 list-disc list-inside">
              <li>Proper and ethical instruction</li>
              <li>Fair and disciplined promotion standards</li>
              <li>Continuous learning and instructor development</li>
              <li>Unity and brotherhood among practitioners</li>
              <li>Preserving the honor and traditions of Taekwondo</li>
            </ul>

            <p className="mt-2 text-responsive font-geist  text-sm md:text-base leading-relaxed text-justify pl-6">
              We hold our instructors, officers, and members to the highest standards of
              conduct, recognizing that leadership is demonstrated through example.
            </p>
          </div>

          {/* OUR COMMUNITY */}
          <div className="flex-1 text-center">
            <div>
              <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                OUR COMMUNITY
              </h2>
              <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
                OUR COMMUNITY
              </h1>
            </div>

            <p className="mt-8 text-responsive font-geist font-[450] text-sm md:text-base leading-relaxed text-left pl-6">
              Pilipinas Taekwondo is more than an organization—it is a community.
              Students, parents, instructors, and affiliated clubs are united by shared values, mutual respect, and a commitment to growth.

              Every member represents the organization not only in uniform, but in daily life.
            </p>


          </div>

        </div>
      </section>

      <section className="px-4 mt-5 sm:px-4 pt-10 md:pt-16 pb-10 text-center">
        <div className="text-center">
          {/* h3 for mobile only */}
          <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
            OUR PURPOSE MOVING FORWARD
          </h2>

          {/* h1 for desktop and up */}
          <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
            OUR PURPOSE MOVING FORWARD
          </h1>
        </div>

        <p className="text-responsive font-geist font-[450] mt-8 text-center mx-auto max-w-6xl text-sm md:text-base leading-relaxed">
          As Pilipinas Taekwondo continues to grow, we remain guided by the same principles upon which it was founded:
          discipline, honor, responsibility, and service.

          We move forward not in haste, but with purpose—building individuals who carry the values of Taekwondo for life.</p>
      </section>


      {/* AFFILIATIONS Carousel */}
      <section className="bg-[#1A1A1A] text-white text-center py-10 md:py-16 mt-30 font-geist relative">
        <div className="text-center mb-10">
          <h3 className="block md:hidden font-poppins-black text-[#FED018] text-lg w-fit mx-auto">AFFILIATIONS</h3>
          <h2 className="hidden md:block font-poppins-black text-[#FED018] text-xl w-fit mx-auto">AFFILIATIONS</h2>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative">
          {/* Prev Arrow */}
          <div
            ref={prevRef}
            onClick={handlePrev}
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
            onClick={handleNext}
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
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
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
                      className="bg-black text-white text-[11px] md:text-sm py-1.5 px-3.5 md:py-2 md:px-4 w-full rounded flex items-center justify-center gap-2 cursor-pointer group mt-3 md:mt-4 transition-colors duration-300 hover:bg-[#FED018] hover:text-black"
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