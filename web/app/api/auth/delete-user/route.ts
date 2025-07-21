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

export async function DELETE(request: NextRequest) {
  try {
    const { userId, email } = await request.json();

    console.log('Deleting user:', userId || email);

    // Method 1: Delete by user ID (if you have it)
    if (userId) {
      // Delete from auth.users (this also cascades to your users table if properly set up)
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('Auth delete error:', authError);
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      // Also delete from custom users table (if cascade doesn't work)
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Profile delete error:', profileError);
        // Continue anyway, auth user is deleted
      }

      return NextResponse.json({ success: true, message: 'User deleted successfully' });
    }

    // Method 2: Delete by email (if you only have email)
    if (email) {
      // First, find the user by email
      const { data: authUsers, error: findError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (findError) {
        return NextResponse.json({ error: findError.message }, { status: 400 });
      }

      const userToDelete = authUsers.users.find(user => user.email === email);
      
      if (!userToDelete) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Delete the user
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userToDelete.id);
      
      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      // Delete from custom users table
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userToDelete.id);

      return NextResponse.json({ success: true, message: 'User deleted successfully' });
    }

    return NextResponse.json({ error: 'userId or email required' }, { status: 400 });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
