// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  console.log(' API /api/users — GET request received');

  try {
    console.log('Calling Supabase RPC: get_users_data');
    const { data, error } = await supabase.rpc('get_users_data');

    if (error) {
      console.error(' Supabase RPC Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }


    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error(' Unexpected error in /api/users:', err);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
