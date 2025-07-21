import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists in our users table
    const { data: users, error: dbError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Return based on database check
    return NextResponse.json({ 
      exists: users && users.length > 0,
      source: 'database'
    });

  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
