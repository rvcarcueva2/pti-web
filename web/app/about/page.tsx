import "@/app/globals.css";
import Image from "next/image";

export default function About() {
  return (
    <>
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

      <section className="bg-[#1A1A1A] text-white text-center py-16">
        <div className="text-center mb-10">
          {/* h3 for mobile only */}
          <h3 className="block md:hidden font-poppins-black text-[#FED018] text-lg w-fit mx-auto">
            PARTNERSHIPS
          </h3>

          {/* h2 for desktop and up */}
          <h2 className="hidden md:block font-poppins-black text-[#FED018] text-xl w-fit mx-auto">
            PARTNERSHIPS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto gap-10 px-6">
          {/* Organization #1 */}
          <div className="space-y-4">
            <Image
              src="/PTI-Logo.png"
              alt="Organization 1"
              width={200}
              height={200}
              className="mx-auto w-24 md:w-48 h-auto"
            />
            <p className="font-geist text-[#FED018] font-bold text-sm md:text-base">ORGANIZATION</p>
          </div>

          {/* Organization #2 */}
          <div className="space-y-4">
            <Image
              src="/PTI-Logo.png"
              alt="Organization 2"
              width={200}
              height={200}
              className="mx-auto w-24 md:w-48 h-auto"
            />
            <p className="font-geist text-[#FED018] font-bold text-sm md:text-base">ORGANIZATION</p>
          </div>

          {/* Organization #3 */}
          <div className="space-y-4">
            <Image
              src="/PTI-Logo.png"
              alt="Organization 3"
              width={200}
              height={200}
              className="mx-auto w-24 md:w-48 h-auto"
            />
            <p className="font-geist text-[#FED018] font-bold text-sm md:text-base">ORGANIZATION</p>
          </div>
        </div>

      </section>

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
    </>
  );
}