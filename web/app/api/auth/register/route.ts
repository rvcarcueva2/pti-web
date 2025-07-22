import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // You'll need to add this to your .env
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, gender, mobile } = await request.json();

    console.log('Registration attempt for:', email);

    // Validate and format phone number - accept global formats
    const cleanedMobile = mobile.replace(/\D/g, ''); // Remove all non-digits
    
    // Global phone number validation (more flexible)
    if (cleanedMobile.length < 7 || cleanedMobile.length > 15) {
      return NextResponse.json({ 
        error: 'Phone number must be between 7 and 15 digits' 
      }, { status: 400 });
    }

    // Optional: Still prefer Philippine format but accept others
    let isPhilippineFormat = false;
    if (cleanedMobile.length === 11 && cleanedMobile.startsWith('09')) {
      isPhilippineFormat = true;
    }

    console.log(`Phone format detected: ${isPhilippineFormat ? 'Philippine (09xxxxxxxxx)' : 'International'}`);

    const phoneNumber = cleanedMobile; // Use the mobile number as is

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        gender: gender,
        mobile: phoneNumber, // Store mobile in metadata instead of phone field
      },
      // Don't use phone field to avoid E.164 requirement
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (authData.user) {
      console.log('User created:', authData.user.id);
      
      // Update user to set display name (this ensures it shows in the dashboard)
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        authData.user.id,
        {
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            gender: gender,
            mobile: phoneNumber, // Store mobile in metadata
          },
          // Don't use phone field to avoid E.164 requirement
          // Set display name explicitly
          app_metadata: {
            display_name: `${firstName} ${lastName}`,
          }
        }
      );

      if (updateError) {
        console.error('User update error:', updateError);
      }
      
      // Insert user profile data
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          gender,
          mobile: cleanedMobile, // Use cleaned 11-digit phone number
        })
        .select(); // Add select to return inserted data

      if (insertError) {
        console.error('Insert error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }

      console.log('Profile created:', insertData);
      return NextResponse.json({ success: true, user: authData.user, profile: insertData });
    }

    return NextResponse.json({ error: 'User creation failed' }, { status: 400 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}