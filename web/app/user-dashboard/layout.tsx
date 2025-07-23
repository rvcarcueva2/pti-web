'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          router.push('/auth/sign-in?redirectTo=' + window.location.pathname);
          return;
        }

        if (!session?.user) {
          router.push('/auth/sign-in?redirectTo=' + window.location.pathname);
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/auth/sign-in?redirectTo=' + window.location.pathname);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          router.push('/auth/sign-in?redirectTo=' + window.location.pathname);
        } else if (session?.user) {
          setUser(session.user);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  // Handle redirect if no user after loading is complete
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/sign-in?redirectTo=' + window.location.pathname);
    }
  }, [isLoading, user, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FED018] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-geist">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Return null if no user (redirect will happen in useEffect above)
  if (!user) {
    return null;
  }

  // Render the protected content
  return (
    <div className="min-h-screen bg-gray-50 font-geist">
      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default UserDashboardLayout;
