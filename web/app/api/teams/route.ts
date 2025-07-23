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

// GET - Fetch team data for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedSupabase(request);
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch team data
    const { data: team, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('Error fetching team:', error);
      return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 });
    }

    return NextResponse.json({ team: team || null });

  } catch (error) {
    console.error('GET team error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create or update team data
export async function POST(request: NextRequest) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedSupabase(request);
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { team_name, social, coach_name, team_logo, coach_photo } = body;

    // Validation
    if (!team_name?.trim()) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }
    if (!coach_name?.trim()) {
      return NextResponse.json({ error: 'Coach name is required' }, { status: 400 });
    }

    // Check if team already exists for this user
    const { data: existingTeam } = await supabase
      .from('teams')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const teamData = {
      team_name: team_name.trim(),
      social: social?.trim() || null,
      coach_name: coach_name.trim(),
      team_logo: team_logo || null,
      coach_photo: coach_photo || null,
    };

    let result;
    if (existingTeam) {
      // Update existing team
      const { data, error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating team:', error);
        return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
      }
      result = data;
    } else {
      // Create new team
      const { data, error } = await supabase
        .from('teams')
        .insert({ ...teamData, user_id: user.id })
        .select()
        .single();

      if (error) {
        console.error('Error creating team:', error);
        return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
      }
      result = data;
    }

    return NextResponse.json({ 
      success: true, 
      team: result,
      message: existingTeam ? 'Team updated successfully!' : 'Team created successfully!'
    });

  } catch (error) {
    console.error('POST team error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
