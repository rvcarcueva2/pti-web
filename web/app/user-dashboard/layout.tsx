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

  // Helper to get current path safely (client only)
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '';
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Always refresh session before checking authentication
        let { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshed.session) {
            router.push('/auth/sign-in?redirectTo=' + getCurrentPath());
            return;
          }
          session = refreshed.session;
        }
        setUser(session.user);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/auth/sign-in?redirectTo=' + getCurrentPath());
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          router.push('/auth/sign-in?redirectTo=' + getCurrentPath());
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
      router.push('/auth/sign-in?redirectTo=' + getCurrentPath());
    }
  }, [isLoading, user, router]);

  // Try to refresh session if stuck in loading for more than 10 seconds
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  useEffect(() => {
    if (isLoading && !refreshAttempted) {
      const timer = setTimeout(async () => {
        let { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshed.session) {
            router.push('/auth/sign-in?redirectTo=' + getCurrentPath());
            return;
          }
          setUser(refreshed.session.user);
          setIsLoading(false);
        }
        setRefreshAttempted(true);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoading, refreshAttempted, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="font-geist min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center" style={{ minHeight: '70vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#EAB044] mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying access...</p>
          </div>
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
