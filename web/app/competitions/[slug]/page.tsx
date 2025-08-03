'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { createClient } from "@supabase/supabase-js";
import { format } from 'date-fns';
import { RegisterButton } from '@/app/components/RegisterButton';
import { useState, useEffect } from 'react';

type Props = {
  params: { slug: string };
};

type CompetitionStats = {
  competition_id: string;
  competition_name: string;
  players_count: number;
  teams_count: number;
  kyorugi_count: number;
  poomsae_count: number;
  poomsae_team_count: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function CompetitionPost({ params }: Props) {
  const [competition, setCompetition] = useState<any>(null);
  const [competitionStats, setCompetitionStats] = useState<CompetitionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchCompetitionData = async () => {
      setLoading(true);

      // Fetch competition details
      const { data: comp, error: compError } = await supabase
        .from('competitions')
        .select('*')
        .eq('uuid', slug)
        .single();

      if (compError || !comp) {
        setLoading(false);
        return;
      }

      setCompetition(comp);

      // Fetch competition stats using RPC
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_competition_stats');

      if (!statsError && statsData) {
        // Find stats for this specific competition
        const currentCompStats = statsData.find((stat: CompetitionStats) =>
          stat.competition_id === slug
        );
        setCompetitionStats(currentCompStats || null);
      }

      setLoading(false);
    };

    fetchCompetitionData();
  }, [slug]);

  if (loading) {
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
        <div className="flex flex-col items-center justify-center text-center py-10 min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#EAB044] mx-auto"></div>
          <p className="text-sm text-gray-500">Loading competition...</p>
        </div>
      </main>
    );
  }

  if (!competition) {
    notFound();
    return null;
  }

  // Generate public image URL
  const { data: imgData } = supabase.storage
    .from('poster')
    .getPublicUrl(competition.photo_url || '');

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
        <h2 className="text-2xl font-bold mb-4 text-center">{competition.title}</h2>

        {competition.photo_url && (
          <div className="mb-6">
            <Image
              src={competition.photo_url}
              alt={competition.title}
              width={1500}
              height={700}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        <div className="p-4 mx-auto max-w-6xl mt-2 md:mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col text-black gap-4 text-left font-geist text-x">
              <p>{competition.description}</p>
              <span className="flex items-center gap-3">
                <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: '20px' }} />
                {competition.location || 'TBA'}
              </span>
              <span className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCalendarDays} style={{ fontSize: '20px' }} />
                {format(new Date(competition.date), "MMMM d, yyyy")}
              </span>
              {competition.deadline && (
                <span className="flex items-center gap-3">
                  Deadline of registration is {format(new Date(competition.deadline), "MMMM d, yyyy")}
                </span>
              )}
            </div>
            <div>
              <RegisterButton competitionId={competition.uuid} />
            </div>
          </div>
        </div>

        {/* Categories or Extra Info with stats */}
        <div className="bg-white rounded-lg p-2 md:p-4 mt-4 md:mt-6 max-w-6xl mx-4 md:mx-auto shadow-sm">
          {/* Mobile layout: 3 items on top, 2 below. Desktop stays in a row of 5 */}
          <div className="md:grid md:grid-cols-5 gap-1 md:gap-4 text-center flex flex-col">
            {/* First Row (Players, Teams, Kyorugi) */}
            <div className="flex md:contents justify-center gap-2 md:gap-0 mb-2 md:mb-0">
              {([
                ['Players', '/icons/Players.svg', 'text-black', competitionStats?.players_count || 0],
                ['Teams', '/icons/Teams.svg', 'text-[#EAB044]', competitionStats?.teams_count || 0],
                ['Kyorugi', '/icons/Kyorugi.svg', 'text-[#D41716]', competitionStats?.kyorugi_count || 0],
              ] as [string, string, string, number][]).map(([label, icon, color, count]) => (
                <div key={label} className="flex flex-col items-center gap-1 md:gap-2 flex-1">
                  <h4 className={`text-responsive font-semibold ${color} text-xs md:text-lg mt-1 md:mt-0`}>{label}</h4>
                  <Image
                    src={icon}
                    alt={label}
                    width={72}
                    height={72}
                    className={`mx-auto w-7 h-7 md:w-18 md:h-18`}
                  />
                  <div className="text-sm md:text-base font-medium text-gray-700">
                    {competitionStats ? count : '...'}
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row (Poomsae, Poomsae Team) */}
            <div className="flex md:contents justify-center gap-2 md:gap-0">
              {([
                ['Poomsae', '/icons/Poomsae.svg', 'text-[#040163]', competitionStats?.poomsae_count || 0],
                ['Poomsae Team', '/icons/Poomsae-team.svg', 'text-[#040163]', competitionStats?.poomsae_team_count || 0],
              ] as [string, string, string, number][]).map(([label, icon, color, count]) => (
                <div key={label} className="flex flex-col items-center gap-1 md:gap-2 flex-1">
                  <h4 className={`text-responsive font-semibold ${color} text-xs md:text-lg mt-1 md:mt-0`}>{label}</h4>
                  <Image
                    src={icon}
                    alt={label}
                    width={72}
                    height={72}
                    className={`mx-auto w-7 h-7 md:w-18 md:h-18 ${label === 'Poomsae Team' ? 'scale-125 md:scale-150' : ''}`}
                  />
                  <div className="text-sm md:text-base font-medium text-gray-700">
                    {competitionStats ? count : '...'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
