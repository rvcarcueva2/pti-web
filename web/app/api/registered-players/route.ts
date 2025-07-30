
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const registrationId = searchParams.get('registrationId');

  if (!registrationId) {
    return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('registered_players')
    .select('*')
    .eq('registration_id', registrationId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
