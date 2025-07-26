'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // adjust path as needed
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';


export default function RegisterModal({ competitionId }: { competitionId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teamName, setTeamName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [teamId, setTeamId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);
    const [agreeError, setAgreeError] = useState('');


    const fetchTeam = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            setIsLoading(false);
            return;
        }

        const userId = userData.user.id;
        setUserEmail(userData.user.email ?? null);

        const { data, error } = await supabase
            .from('teams')
            .select('id, team_name')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            console.error('Failed to fetch team:', error.message);
            setTeamName(null);
            setTeamId(null);
        } else {
            setTeamName(data?.team_name ?? null);
            setTeamId(data?.id ?? null);
        }

        setIsLoading(false);
    };

    const handleClick = () => {
        setIsModalOpen(true);
        fetchTeam();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreeChecked) {
            setAgreeError('Please check the box to agree.');
            return;
        }

        if (!teamId || !userEmail || !competitionId) {
            alert("Missing required data.");
            return;
        }

        // Check if the team is already registered for this competition
        const { data: existing, error: existingError } = await supabase
            .from('registrations')
            .select('id')
            .eq('competition_id', competitionId)
            .eq('team_id', teamId)
            .maybeSingle();

        if (existing) {
            setIsDuplicate(true);
            setErrorMessage("The team has already been registered.");
            return;
        }

        const { error } = await supabase.from('registrations').insert([
            {
                competition_id: competitionId,
                team_id: teamId,
                user_email: userEmail,
            },
        ]);

        if (error) {
            console.error('Registration failed:', error.message);
            alert("Failed to register team.");
        } else {
            setSuccessMessage("Team successfully registered!");
            setIsModalOpen(false);
        }

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

            {/* Floating Success Message */}
            {successMessage && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-green-100 border border-green-400 text-green-700 rounded shadow-lg text-m font-regular transition-all duration-300">
                    {successMessage}
                </div>
            )}

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
                                    placeholder="Your team name"
                                    value={teamName}
                                    disabled
                                    className={`w-full px-4 py-2.5 rounded-lg bg-gray-200 border ${isDuplicate ? 'border-red-500' : 'border-transparent'}`}
                                />
                                {isDuplicate && (
                                    <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                                )}

                                <div className="mt-2 flex items-start gap-3 mt-3">
                                    <input
                                        type="checkbox"
                                        id="agree"
                                        className={`mt-1 accent-black text-white border-gray-300 rounded ${agreeError ? 'ring-2 ring-red-500' : ''}`}
                                        checked={agreeChecked}
                                        onChange={(e) => {
                                            setAgreeChecked(e.target.checked);
                                            if (e.target.checked) setAgreeError('');
                                        }}
                                    />
                                    <label htmlFor="agree" className="font-geist text-sm text-gray-700">
                                        I agree that all the information I provided is correct and true.
                                    </label>
                                </div>
                                {agreeError && <p className=" text-red-500"><FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />{agreeError}</p>}

                                <button
                                    onClick={handleSubmit}
                                    className="mt-3 px-4 py-2 rounded bg-[#EAB044] text-white hover:bg-[#d49a35] cursor-pointer"
                                >
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
