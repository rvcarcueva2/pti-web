import type { Metadata } from 'next';
import { supabase } from '@/lib/supabaseClient'; // ✅ already configured

type Props = {
  children: React.ReactNode;
  params: { id: string }; // UUID
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;

  const { data: competition, error } = await supabase
    .from('competitions')
    .select('competition, description')
    .eq('id', id)
    .maybeSingle();

  if (error || !competition) {
    return {
      title: 'Competition Not Found',
    };
  }

  return {
    title: `${competition.competition} | Pilipinas Taekwondo Inc.`,
    description: competition.description || '',
  };
}

export default function CompetitionLayout({ children }: Props) {
  return <>{children}</>;
}
