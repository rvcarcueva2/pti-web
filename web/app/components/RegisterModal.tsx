'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // adjust path as needed
import Image from 'next/image';

export default function RegisterModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teamName, setTeamName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTeam = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            setIsLoading(false); // Stop loading even on error
            return;
        }

        const userId = userData.user.id;

        const { data, error } = await supabase
            .from('teams')
            .select('team_name')
            .eq('user_id', userId)
            .maybeSingle(); // Use maybeSingle to avoid throwing if no rows

        if (error) {
            console.error('Failed to fetch team:', error.message);
            setTeamName(null);
        } else {
            setTeamName(data?.team_name ?? null);
        }

        setIsLoading(false); // Always stop loading after fetch
    };

    const handleClick = () => {
        setIsModalOpen(true);
        fetchTeam();
    };

    return (
        <>
            <button
                onClick={handleClick}
                className="group bg-foreground hover:bg-[#FED018] text-white hover:text-[#1A1A1A] font-semibold py-2 px-6 rounded-sm transition-colors duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer h-11"
            >

                Register
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 ">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-115 relative">
                        <div className=" justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Team Registration</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-2 right-4 text-gray-600 hover:text-black cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            This team will be registered to this competition.
                        </p>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#EAB044] mb-2"></div>
                            </div>
                        ) : teamName ? (
                            <>
                                <input
                                    type="text"
                                    name="teamName"
                                    placeholder=" Your team name"
                                    value={teamName}
                                    disabled
                                    className="mb-3 w-full px-4 py-2.5 rounded-lg bg-gray-200"
                                />

                                <div className="mt-2 flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="agree"
                                        className="mt-1 accent-black text-white border-gray-300 rounded"
                                    />
                                    <label htmlFor="agree" className="font-geist text-sm text-gray-700">
                                        I agree that all the information I provided is correct and true.
                                    </label>
                                </div>

                                <button className="mt-3 px-4 py-2 rounded bg-[#EAB044] text-white hover:bg-[#d49a35] cursor-pointer">
                                    Confirm
                                </button>
                            </>
                        ) : (
                            <div className="mb-5 w-full px-4 py-3 ">
                                <p className="text-gray-500 mb-3">You haven't created a team yet.</p>
                            
                                <button
                                    onClick={() => window.location.href = "/user-dashboard/my-team"}
                                    className="mt-3 px-4 py-2 rounded bg-[#EAB044] text-white hover:bg-[#d49a35] cursor-pointer">
                                    Create a Team
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
