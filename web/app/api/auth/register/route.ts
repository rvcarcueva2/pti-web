import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'


const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, gender, mobile } = await request.json()

    const cleanedMobile = mobile.replace(/\D/g, '')
    if (cleanedMobile.length < 7 || cleanedMobile.length > 15) {
      return NextResponse.json({ error: 'Phone number must be between 7 and 15 digits' }, { status: 400 })
    }

    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        gender,
        mobile: cleanedMobile
      },
      app_metadata: {
        role: 'User', 
        display_name: `${firstName} ${lastName}`
      }
    })

    if (authError || !authData.user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError?.message || 'User creation failed' }, { status: 400 })
    }

    const userId = authData.user.id

   
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        gender,
        mobile: cleanedMobile,
        role: 'User'
      })
      .select()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    console.log('✅ User registered with default role: User')
    return NextResponse.json({ success: true, user: authData.user, profile: insertData })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
