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

// GET - Fetch all players for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedSupabase(request);
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch players data
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching players:', error);
      return NextResponse.json({ error: 'Failed to fetch players data' }, { status: 500 });
    }

    return NextResponse.json({ players: players || [] });

  } catch (error) {
    console.error('GET players error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new player
export async function POST(request: NextRequest) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedSupabase(request);
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { last_name, first_name, middle_name, sex, age, height, belt, category, group_name } = body;

    // Validation
    if (!last_name?.trim()) {
      return NextResponse.json({ error: 'Last name is required' }, { status: 400 });
    }
    if (!first_name?.trim()) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }
    if (!sex?.trim()) {
      return NextResponse.json({ error: 'Sex is required' }, { status: 400 });
    }
    if (!age || isNaN(parseInt(age))) {
      return NextResponse.json({ error: 'Valid age is required' }, { status: 400 });
    }
    if (!height || isNaN(parseInt(height))) {
      return NextResponse.json({ error: 'Valid height is required' }, { status: 400 });
    }
    if (!belt?.trim()) {
      return NextResponse.json({ error: 'Belt is required' }, { status: 400 });
    }
    if (!category?.trim()) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }
    if (!group_name?.trim()) {
      return NextResponse.json({ error: 'Group is required' }, { status: 400 });
    }

    const playerData = {
      user_id: user.id,
      last_name: last_name.trim(),
      first_name: first_name.trim(),
      middle_name: middle_name?.trim() || null,
      sex: sex.trim(),
      age: parseInt(age),
      height: parseInt(height),
      belt: belt.trim(),
      category: category.trim(),
      group_name: group_name.trim(),
    };

    // Create new player
    const { data, error } = await supabase
      .from('players')
      .insert(playerData)
      .select()
      .single();

    if (error) {
      console.error('Error creating player:', error);
      return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      player: data,
      message: 'Player created successfully!'
    });

  } catch (error) {
    console.error('POST player error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update existing player
export async function PUT(request: NextRequest) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedSupabase(request);
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, last_name, first_name, middle_name, sex, age, height, belt, category, group_name } = body;

    if (!id) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    // Validation (same as POST)
    if (!last_name?.trim()) {
      return NextResponse.json({ error: 'Last name is required' }, { status: 400 });
    }
    if (!first_name?.trim()) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }
    if (!sex?.trim()) {
      return NextResponse.json({ error: 'Sex is required' }, { status: 400 });
    }
    if (!age || isNaN(parseInt(age))) {
      return NextResponse.json({ error: 'Valid age is required' }, { status: 400 });
    }
    if (!height || isNaN(parseInt(height))) {
      return NextResponse.json({ error: 'Valid height is required' }, { status: 400 });
    }
    if (!belt?.trim()) {
      return NextResponse.json({ error: 'Belt is required' }, { status: 400 });
    }
    if (!category?.trim()) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }
    if (!group_name?.trim()) {
      return NextResponse.json({ error: 'Group is required' }, { status: 400 });
    }

    const playerData = {
      last_name: last_name.trim(),
      first_name: first_name.trim(),
      middle_name: middle_name?.trim() || null,
      sex: sex.trim(),
      age: parseInt(age),
      height: parseInt(height),
      belt: belt.trim(),
      category: category.trim(),
      group_name: group_name.trim(),
    };

    // Update player
    const { data, error } = await supabase
      .from('players')
      .update(playerData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own players
      .select()
      .single();

    if (error) {
      console.error('Error updating player:', error);
      return NextResponse.json({ error: 'Failed to update player' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Player not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      player: data,
      message: 'Player updated successfully!'
    });

  } catch (error) {
    console.error('PUT player error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete player
export async function DELETE(request: NextRequest) {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedSupabase(request);
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    // Delete player
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user can only delete their own players

    if (error) {
      console.error('Error deleting player:', error);
      return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Player deleted successfully!'
    });

  } catch (error) {
    console.error('DELETE player error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
