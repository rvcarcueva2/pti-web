import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RegisterModal from '@/app/components/RegisterModal';
import { createClient } from "@supabase/supabase-js";
import { format } from 'date-fns';


type Props = {
  params: { slug: string }; 
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Static params generation for pre-rendering (optional if using dynamic)
export async function generateStaticParams() {
  const { data, error } = await supabase.from('competitions').select('uuid');
  if (error || !data) return [];
  return data.map((row) => ({ slug: row.uuid }));
}

export default async function CompetitionPost({ params }: Props) {
  const { slug } = params;

  const { data: comp, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('uuid', slug)
    .single();

  if (error || !comp) return notFound();

  // Generate public image URL
  const { data: imgData } = supabase.storage
    .from('poster')
    .getPublicUrl(comp.photo_url || '');

  const imageUrl = imgData?.publicUrl ?? '';

  return (
    <main className="px-4 sm:px-4 pt-10 md:pt-16 pb-10 text-center">
      <div className="text-center">
        <h2 className="block md:hidden font-poppins-black text-2xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
          COMPETITIONS
        </h2>
        <h1 className="hidden md:block font-poppins-black text-3xl border-b-4 border-[#FED018] w-fit mx-auto pb-2">
          COMPETITIONS
        </h1>
      </div>

      {/* Competition Content */}
      <div className="font-geist mx-auto my-4 md:my-8 max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-center">{comp.title}</h2>

        {comp.photo_url && (
          <div className="mb-6">
            <Image
              src={comp.photo_url}
              alt={comp.title}
              width={1500}
              height={700}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        <div className="p-4 mx-auto max-w-6xl mt-2 md:mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col text-black gap-4 text-left font-geist text-x">
                <p>{comp.description}</p>
              <span className="flex items-center gap-3">
                <FontAwesomeIcon icon="location-dot" style={{ fontSize: '20px' }} />
                {comp.location || 'TBA'}
              </span>
              <span className="flex items-center gap-3">
                <FontAwesomeIcon icon="calendar-days" style={{ fontSize: '20px' }} />
                {format(new Date(comp.date), "MMMM d, yyyy")}
              </span>
              {comp.deadline && (
                <span className="flex items-center gap-3">
                  Deadline of registration is {format(new Date(comp.deadline), "MMMM d, yyyy")}
                </span>
              )}
            </div>
            <div>
              <RegisterModal competitionId={comp.uuid} />
            </div>
          </div>
        </div>

        {/* Categories or Extra Info (static for now) */}
        <div className="bg-white rounded-lg p-2 md:p-4 mt-4 md:mt-6 max-w-6xl mx-4 md:mx-auto shadow-sm">
          <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
            {[
              ['Players', '/icons/Players.svg', 'text-black'],
              ['Teams', '/icons/Teams.svg', 'text-[#EAB044]'],
              ['Kyorugi', '/icons/Kyorugi.svg', 'text-[#D41716]'],
              ['Poomsae', '/icons/Poomsae.svg', 'text-[#040163]'],
            ].map(([label, icon, color]) => (
              <div key={label} className="flex flex-col items-center gap-1 md:gap-2">
                <h4 className={`text-responsive font-semibold ${color} text-xs md:text-lg`}>{label}</h4>
                <Image
                  src={icon}
                  alt={label as string}
                  width={72}
                  height={72}
                  className="w-7 h-7 md:w-18 md:h-18 mx-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
