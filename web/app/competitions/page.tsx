import "@/app/globals.css";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient"; 
import { format } from "date-fns";

type Competition = {
  uuid: string;
  title: string;
  date: string;
  description: string | null;
  location: string;
  deadline: string;
  photo_url: string | null;
};

export default async function Competitions() {
  const { data: competitions, error } = await supabase
    .from("competitions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching competitions:", error.message);
    return <div className="text-center mt-10">Failed to load competitions.</div>;
  }

  return (
    <main className="px-4 sm:px-4 pt-10 md:pt-16 pb-10 text-center">
      {/* Page Heading */}
      <div className="text-center">
        <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
          COMPETITIONS
        </h2>
        <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
          COMPETITIONS
        </h1>
      </div>

      {/* List of Competition Posts */}
      <div className="mt-8 md:mt-16 space-y-6">
        {competitions.map((comp: Competition) => (
          <div
            key={comp.uuid}
            className="mx-auto max-w-6xl border-2 rounded-sm border-foreground p-6 hover:shadow-lg transition-shadow relative"
          >
            {/* Competition Image */}
            {comp.photo_url && (
              <div className="mb-4 overflow-hidden">
                <Image
                  src={comp.photo_url}
                  alt={comp.title}
                  width={1500}
                  height={700}
                  className="rounded-lg"
                />
              </div>
            )}

            <div className="font-geist font-black text-base md:text-xl mb-0 md:mb-2">
              {comp.title}
            </div>

            <div className="font-geist text-center">
              <span className="text-[#EAB044] font-semibold text-xs md:text-base">
                {format(new Date(comp.date), "MMMM d, yyyy")}
              </span>
            </div>

            <div className="mt-2 md:mt-0 md:absolute md:bottom-4 md:right-6 text-center md:text-right">
              <Link href={`/competitions/${comp.uuid}`}>
                <button className="group cursor-pointer bg-foreground hover:bg-[#FED018] text-white hover:text-[#1A1A1A] font-semibold py-2 px-4 rounded-sm transition-colors duration-200 whitespace-nowrap flex items-center gap-2 justify-center md:justify-end mx-auto md:mx-0">
                  View Details
                  <Image
                    src="/icons/Forward Button.svg"
                    alt="Forward"
                    width={24}
                    height={24}
                    className="w-6 h-6 group-hover:hidden"
                  />
                  <Image
                    src="/icons/forward-button2.svg"
                    alt="Forward Hover"
                    width={24}
                    height={24}
                    className="w-6 h-6 hidden group-hover:block"
                  />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
