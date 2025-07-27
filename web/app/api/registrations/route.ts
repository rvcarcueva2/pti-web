import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


export async function GET() {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      status,
      created_at,
      competitions:competition_id (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = data.map((reg: any) => ({
    competitionTitle: reg.competitions?.title ?? 'Unknown',
    dateRegistered: reg.created_at,
    status: reg.status,
  }));

  return NextResponse.json(formatted);
}