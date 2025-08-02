'use client'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function RegisterButton({ competitionId }: { competitionId: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isCheckingTeam, setIsCheckingTeam] = useState(false);

  const checkUserTeam = async () => {
    try {
      setIsCheckingTeam(true);
      
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        // If user is not authenticated, redirect to sign-in
        router.push('/auth/sign-in?redirectTo=/competitions');
        return false;
      }

      // Check if user has a team
      const { data: teams, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      if (teamError) {
        console.error('Error checking team:', teamError);
        return false;
      }

      return teams && teams.length > 0;
    } catch (error) {
      console.error('Error in team check:', error);
      return false;
    } finally {
      setIsCheckingTeam(false);
    }
  };

  const handleRegister = async () => {
    const hasTeam = await checkUserTeam();
    
    if (hasTeam) {
      router.push(`/players?competitionId=${competitionId}`);
    } else {
      setShowModal(true);
    }
  };

  const handleCreateTeam = () => {
    setShowModal(false);
    router.push('/my-team');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleRegister}
        disabled={isCheckingTeam}
        className="group bg-foreground hover:bg-[#FED018] text-white hover:text-[#1A1A1A] font-semibold py-2 px-6 rounded-sm transition-colors duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer h-11 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCheckingTeam ? 'Checking...' : 'Register'}
        <Image
          src="/icons/Forward Button.svg"
          alt="Forward"
          width={24}
          height={24}
          className="w-6 h-6 group-hover:hidden"
        />
        <Image
          src="/icons/forward-button2.svg"
          alt="Forward Hover"
          width={24}
          height={24}
          className="w-6 h-6 hidden group-hover:inline"
        />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-4 relative">

 
            {/* Modal content */}
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  You don't have a team yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You need to create a team before you can register for competitions.
                </p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  className="px-6 py-2 bg-[#FED018] text-[#1A1A1A] font-semibold rounded-md hover:bg-yellow-400 transition-colors cursor-pointer"
                >
                  Create a Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
