import Header from "@/app/components/header";
import "@/app/globals.css";
import Image from "next/image";

export default function About() {
  return (
    <>
      <section className="px-4 sm:px-4 pt-16 pb-10 text-center">
        <h1 className="font-poppins-black text-3xl border-b-4 border-[#FED018] inline-block pb-2">
          ABOUT
        </h1>
        <p className="font-geist font-[450] mt-12 text-justify mx-auto max-w-6xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>

      <section className="px-8 sm:px-20 space-y-2">
        <Image
          src="/images/PTI.png"
          alt="PTI Group"
          width={1200}
          height={800}
          className="w-full h-auto max-w-6xl mx-auto"
        />
      </section>

      <section className="px-4 sm:px-4 pt-6 pb-10 text-center">
        <p className="font-geist font-[450] mt-6 text-justify mx-auto max-w-6xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>

      <section className="bg-[#1A1A1A] text-white text-center py-16">
        <h2 className="font-poppins-black text-[#FED018] text-xl  mb-10">
          PARTNERSHIPS
        </h2>

        <div className="grid grid-cols-3 max-w-6xl mx-auto gap-10 px-6">
          {/* Organization #1 */}
          <div className="space-y-4">
            <Image
              src="/PTI-Logo.png"
              alt="Organization 1"
              width={200}
              height={200}
              className="mx-auto"
            />
              <p className="font-geist text-[#FED018] font-bold">ORGANIZATION</p>
          </div>

          {/* Organization #2 */}
          <div className="space-y-4">
            <Image
              src="/PTI-Logo.png"
              alt="Organization 2"
              width={200}
              height={200}
              className="mx-auto"
            />
              <p className="font-geist text-[#FED018] font-bold">ORGANIZATION</p>
          </div>

          {/* Organization #3 */}
          <div className="space-y-4">
            <Image
              src="/PTI-Logo.png"
              alt="Organization 3"
              width={200}
              height={200}
              className="mx-auto"
            />
              <p className="font-geist text-yellow-500 font-bold">ORGANIZATION</p>
          </div>
        </div>
      </section>

      <section className="py-20 grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-start mx-auto max-w-6xl">
        <div>
          <h3 className="font-geist font-bold text-lg mb-2">Master Loreto M. Velasquez</h3>
          <p className="font-geist font-[450] text-justify pt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        
        {/* Placeholder for image */}
        <div className="bg-gray-300 w-105 h-120" />
      </section>
    </>
  );
}
