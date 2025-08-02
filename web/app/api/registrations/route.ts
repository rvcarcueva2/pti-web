import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper function to get authenticated Supabase client
const getAuthenticatedSupabase = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { supabase: null, user: null, error: 'No authorization header' };
  }

  const token = authHeader.substring(7);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  return { supabase, user, error };
};

export async function GET(request: NextRequest) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedSupabase(request);
    
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, get the user's team
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (teamError) {
      console.error('Error fetching team:', teamError);
      return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 });
    }

    if (!teamData) {
      // User has no team, return empty array
      return NextResponse.json([]);
    }

    // Fetch registrations for the user's team
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        id,
        status,
        created_at,
        competitions:competition_id (
          title
        )
      `)
      .eq('team_id', teamData.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = data.map((reg: any) => ({
      id: reg.id,
      competitionTitle: reg.competitions?.title ?? 'Unknown',
      dateRegistered: reg.created_at,
      status: reg.status,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GET registrations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}