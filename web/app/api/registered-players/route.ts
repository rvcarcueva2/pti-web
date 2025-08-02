
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verify the user session using the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get the user's team from registrations table
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select('team_id')
      .eq('user_id', user.id)
      .limit(1);

    if (regError) {
      return NextResponse.json({ error: regError.message }, { status: 500 });
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({ error: 'No team registration found for user' }, { status: 404 });
    }

    const teamId = registrations[0].team_id;

    // Get all registered players for the user's team by joining with registrations
    const { data, error } = await supabase
      .from('registered_players')
      .select(`
        id,
        first_name,
        last_name,
        middle_name,
        sex,
        age,
        height,
        weight,
        belt,
        group_name,
        level,
        is_kyorugi,
        is_poomsae,
        is_poomsae_team,
        registration_id,
        registrations!inner(team_id)
      `)
      .eq('registrations.team_id', teamId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/registered-players:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verify the user session using the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const { players } = body;

    if (!players || !Array.isArray(players)) {
      return NextResponse.json({ error: 'Invalid players data' }, { status: 400 });
    }

    // Get the user's registration to get the registration_id
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (regError) {
      return NextResponse.json({ error: regError.message }, { status: 500 });
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({ error: 'No registration found for user' }, { status: 404 });
    }

    const registrationId = registrations[0].id;

    // Transform players data for database insertion
    const playersToInsert = players.map((player: any) => ({
      registration_id: registrationId,
      first_name: player.first_name,
      last_name: player.last_name,
      middle_name: player.middle_name || '',
      sex: player.sex,
      age: player.age,
      height: player.height,
      weight: player.weight,
      belt: player.belt,
      group_name: player.group,
      level: player.level,
      is_kyorugi: player.categories.includes('Kyorugi'),
      is_poomsae: player.categories.includes('Poomsae'),
      is_poomsae_team: player.categories.includes('Poomsae Team'),
    }));

    // Insert players into database
    const { data, error } = await supabase
      .from('registered_players')
      .insert(playersToInsert)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/registered-players:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verify the user session using the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json({ error: 'Missing playerId' }, { status: 400 });
    }

    // Delete the player
    const { error } = await supabase
      .from('registered_players')
      .delete()
      .eq('id', playerId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/registered-players:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
