'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams, useRouter } from 'next/navigation';

type Player = {
    lastName: string;
    firstName: string;
    middleName: string;
    sex: string;
    age: string;
    height: string;
    weight: string;
    belt: string;
    categories: string[];
    group: string;
    level: string;
};

export default function PlayersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const competitionId = searchParams.get('competitionId');
    const [competitionTitle, setCompetitionTitle] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayer, setNewPlayer] = useState<Player>(emptyPlayer());
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'Kyorugi' | 'Poomsae' | 'Poomsae Team'>('Kyorugi');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isSexDropdownOpen, setIsSexDropdownOpen] = useState(false);
    const [isBeltDropdownOpen, setIsBeltDropdownOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successType, setSuccessType] = useState<'add' | 'update' | 'delete'>('add');
    const [showNoPlayersModal, setShowNoPlayersModal] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showCheckboxError, setShowCheckboxError] = useState(false);
    const [isTeamRegistered, setIsTeamRegistered] = useState(false);
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [showReloadWarningModal, setShowReloadWarningModal] = useState(false);

    const columns = [
        { label: 'Last Name', key: 'lastName', width: 'w-[120px]' },
        { label: 'First Name', key: 'firstName', width: 'w-[130px]' },
        { label: 'Middle Name', key: 'middleName', width: 'w-[130px]' },
        { label: 'Sex', key: 'sex', width: 'w-[70px]' },
        { label: 'Age', key: 'age', width: 'w-[60px]' },
        { label: 'Height (cm)', key: 'height', width: 'w-[120px]' },
        { label: 'Weight (kg)', key: 'weight', width: 'w-[120px]' },
        { label: 'Belt', key: 'belt', width: 'w-[100px]' },
        { label: 'Level', key: 'level', width: 'w-[90px]' },
        { label: 'Group', key: 'group', width: 'w-[250px]' },
    ];

    const tabs = [
        { key: 'Kyorugi', label: 'Kyorugi' },
        { key: 'Poomsae', label: 'Poomsae' },
        { key: 'Poomsae Team', label: 'Poomsae Team' },
    ];

    const categoryOptions = ['Kyorugi', 'Poomsae', 'Poomsae Team'];

    useEffect(() => {
        const fetchCompetition = async () => {
            if (!competitionId) return;

            const { data, error } = await supabase
                .from('competitions')
                .select('title')
                .eq('uuid', competitionId)
                .single();

            if (!error && data) {
                setCompetitionTitle(data.title);
            }
        };

        const checkTeamRegistration = async () => {
            setIsCheckingRegistration(true);

            try {
                // Ensure we have a competition ID
                if (!competitionId) {
                    console.log('No competition ID provided');
                    setIsCheckingRegistration(false);
                    return;
                }

                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError || !userData?.user) {
                    console.log('User not authenticated:', userError);
                    setIsCheckingRegistration(false);
                    return;
                }

                const userId = userData.user.id;

                // Fetch the user's team
                const { data: teamData, error: teamError } = await supabase
                    .from('teams')
                    .select('id')
                    .eq('user_id', userId)
                    .maybeSingle();

                if (teamError || !teamData) {
                    console.log('Team not found for user:', userId);
                    setDebugInfo({ error: 'Team not found', userId });
                    setIsCheckingRegistration(false);
                    return;
                }

                const teamId = teamData.id;

                // Check if team is already registered for this specific competition
                console.log('Checking registration for competition:', competitionId, 'and team:', teamId);

                const { data: existingRegistration, error: registrationError } = await supabase
                    .from('registrations')
                    .select('id, competition_id, team_id')
                    .eq('competition_id', competitionId)
                    .eq('team_id', teamId)
                    .maybeSingle();

                console.log('Registration check result:', { existingRegistration, registrationError });

                // Store debug info
                setDebugInfo({
                    userId,
                    teamId,
                    competitionId,
                    existingRegistration,
                    registrationError
                });

                if (registrationError) {
                    console.error('Error checking registration:', registrationError);
                    setIsCheckingRegistration(false);
                    return;
                }

                if (existingRegistration) {
                    console.log('Team already registered for competition:', competitionId, 'Registration ID:', existingRegistration.id);
                    setIsTeamRegistered(true);
                } else {
                    console.log('Team not yet registered for competition:', competitionId);
                    setIsTeamRegistered(false);
                }

            } catch (error) {
                console.error('Error in checkTeamRegistration:', error);
            } finally {
                setIsCheckingRegistration(false);
            }
        };

        fetchCompetition();
        checkTeamRegistration();
    }, [competitionId]);

    // Add beforeunload event listener when there's exactly one player
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (players.length === 1) {
                const message = 'Your team will not be saved if you reload the page. All unsaved changes will be lost.';
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (players.length === 1) {
                // Detect F5 or Ctrl+R
                if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                    e.preventDefault();
                    setShowReloadWarningModal(true);
                }
            }
        };

        if (players.length === 1) {
            window.addEventListener('beforeunload', handleBeforeUnload);
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [players.length]);

    function emptyPlayer(): Player {
        return {
            lastName: '',
            firstName: '',
            middleName: '',
            sex: '',
            age: '',
            height: '',
            weight: '',
            belt: '',
            categories: [],
            group: '',
            level: '',
        };
    }

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleAddPlayer = () => {
        const requiredFields = ['lastName', 'firstName', 'sex', 'age', 'height', 'belt'];

        // Add weight as required for Kyorugi categories
        const isKyorugiSelected = newPlayer.categories.includes('Kyorugi');
        if (isKyorugiSelected) {
            requiredFields.push('weight');
        }

        // Clear previous errors
        const errors: { [key: string]: string } = {};

        // Check each required field
        requiredFields.forEach((field) => {
            const value = newPlayer[field as keyof Player]?.toString().trim();
            if (!value) {
                errors[field] = 'Fill out this field';
            }
        });

        //Add specific validation for age
        const age = parseInt(newPlayer.age);
        if (!isNaN(age) && age > 99) {
            errors['age'] = 'Invalid age';
        }

        // Check if categories are selected
        if (newPlayer.categories.length === 0) {
            errors['categories'] = 'Fill out this field';
        }

        // Check for duplicate players in the same categories (only for new players, not edits)
        if (editIndex === null) {
            const duplicateCategories: string[] = [];

            newPlayer.categories.forEach(category => {
                const existingPlayer = players.find(p =>
                    p.lastName.toLowerCase() === newPlayer.lastName.toLowerCase() &&
                    p.firstName.toLowerCase() === newPlayer.firstName.toLowerCase() &&
                    p.middleName.toLowerCase() === newPlayer.middleName.toLowerCase() &&
                    p.categories.includes(category)
                );

                if (existingPlayer) {
                    duplicateCategories.push(category);
                }
            });

            if (duplicateCategories.length > 0) {
                errors['categories'] = `This player has already been added in this category: ${duplicateCategories.join(', ')}`;
            }
        }

        // Set errors state
        setFieldErrors(errors);

        // If there are any errors, don't proceed
        if (Object.keys(errors).length > 0) {
            return;
        }

        // Create a player entry for each selected category
        const ageNum = parseInt(newPlayer.age);
        const heightNum = parseFloat(newPlayer.height);
        const weightNum = parseFloat(newPlayer.weight);

        const newPlayers = newPlayer.categories.map(category => ({
            ...newPlayer,
            categories: [category], // Each entry has only one category for proper filtering
            group: getGroup(ageNum, category, newPlayer.sex, heightNum, weightNum), // Get group for this specific category
        }));

        if (editIndex !== null) {
            // For editing, find all players with the same name and remove them
            const playerToEdit = players[editIndex];
            const updated = players.filter(p =>
                !(p.lastName === playerToEdit.lastName &&
                    p.firstName === playerToEdit.firstName &&
                    p.middleName === playerToEdit.middleName)
            );
            // Add new entries for each category
            setPlayers([...updated, ...newPlayers]);
            setSuccessMessage('Player updated successfully!');
            setSuccessType('update');
        } else {
            setPlayers([...players, ...newPlayers]);
            setSuccessMessage('Player added successfully!');
            setSuccessType('add');
        }

        setNewPlayer(emptyPlayer());
        setIsModalOpen(false);
        setEditIndex(null);
        // Reset all dropdown states
        setIsCategoryDropdownOpen(false);
        setIsSexDropdownOpen(false);
        setIsBeltDropdownOpen(false);
        // Clear field errors
        setFieldErrors({});
    };

    const handleSubmitPlayers = async () => {
        if (!players || players.length === 0) {
            setShowNoPlayersModal(true);
            return;
        }

        // Show confirmation modal first
        setShowSubmitConfirmModal(true);
    };

    const confirmSubmitPlayers = async () => {
        if (!agreeToTerms) {
            setShowCheckboxError(true);
            return;
        }

        // Clear checkbox error if user has agreed
        setShowCheckboxError(false);

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            alert("You must be logged in to register.");
            return;
        }

        const userId = userData.user.id;
        const userEmail = userData.user.email;

        if (!competitionId) {
            alert("Missing competition ID.");
            return;
        }

        // Fetch the user's team
        const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (teamError || !teamData) {
            alert("Team not found. Please create a team first.");
            return;
        }

        const teamId = teamData.id;

        // Double-check if already registered for this specific competition
        console.log('Double-checking registration for competition:', competitionId, 'and team:', teamId);

        const { data: existingRegistration, error: checkError } = await supabase
            .from('registrations')
            .select('id, competition_id, team_id')
            .eq('competition_id', competitionId)
            .eq('team_id', teamId)
            .maybeSingle();

        console.log('Submit check result:', { existingRegistration, checkError });

        if (checkError) {
            console.error('Error checking registration:', checkError);
            alert("Error checking registration status. Please try again.");
            return;
        }

        if (existingRegistration) {
            alert("This team has already registered for this competition.");
            // Update the local state to reflect the registration status
            setIsTeamRegistered(true);
            setShowSubmitConfirmModal(false);
            return;
        }

        // Insert into registrations
        const { data: regData, error: regError } = await supabase
            .from('registrations')
            .insert([
                {
                    competition_id: competitionId,
                    team_id: teamId,
                    user_email: userEmail,
                    user_id: userId
                }
            ])
            .select()
            .single();

        if (regError || !regData) {
            console.error(regError);
            alert("Failed to create registration.");
            return;
        }

        // Prepare entries for `registered_players`
        const snapshots = players.map(p => ({
            registration_id: regData.id,
            first_name: p.firstName,
            last_name: p.lastName,
            middle_name: p.middleName,
            sex: p.sex,
            age: parseInt(p.age),
            height: parseInt(p.height),
            weight: p.weight ? parseInt(p.weight) : null,
            belt: p.belt,
            group_name: p.group,
            level: p.level,
            is_kyorugi: p.categories.includes('Kyorugi'),
            is_poomsae: p.categories.includes('Poomsae'),
            is_poomsae_team: p.categories.includes('Poomsae Team')
        }));

        const { error: snapshotError } = await supabase
            .from('registered_players')
            .insert(snapshots);

        if (snapshotError) {
            console.error(snapshotError);
            alert("Failed to save registered players.");
            return;
        }

        setSuccessMessage("Team and players successfully registered!");
        setSuccessType("add");

        // Close modal and reset state
        setShowSubmitConfirmModal(false);
        setAgreeToTerms(false);
        setShowCheckboxError(false);

        setTimeout(() => {
            window.location.href = "/registration";
        }, 1000);
    };



    const getGroup = (
        age: number,
        category: string,
        sex: string,
        height?: number,
        weight?: number
    ): string => {
        if (category === 'Poomsae' || category === 'Poomsae Team') {
            if (age <= 6) return 'Toddlers';
            if (age <= 9) return 'Group 1';
            if (age <= 13) return 'Group 2';
            if (age <= 17) return 'Group 3';
            if (age <= 18) return 'Group 4';
            // Add logic for ages above 18
            return 'Adult Group';
        }

        if (category === 'Kyorugi') {
            if (height == null || weight == null) {
                return 'Kyorugi: Incomplete Data';
            }

            if (age <= 11) {
                if (sex === 'Female') {
                    if (age <= 7 && height <= 112) return 'GS GIRLS U7 GROUP 00';
                    if (age <= 8 && height > 112 && height <= 120) return 'GS GIRLS U8 GROUP 0';
                    if (age <= 10 && height > 120 && height <= 128) return 'GS GIRLS U10 GROUP 1';
                    if (age <= 11 && height > 128 && height <= 136) return 'GS GIRLS U11 GROUP 2';
                    if (age <= 11 && height > 136 && height <= 144) return 'GS GIRLS U11 GROUP 3';
                    if (age <= 11 && height > 144 && height <= 152) return 'GS GIRLS U11 GROUP 4';
                    if (age <= 11 && height > 152 && height <= 160) return 'GS GIRLS U11 GROUP 5';
                } else {
                    if (age <= 7 && height <= 120) return 'GS BOYS U8 GROUP 0';
                    if (age <= 11 && height > 120 && height <= 128) return 'GS BOYS U11 GROUP 1';
                    if (age <= 11 && height > 128 && height <= 136) return 'GS BOYS U11 GROUP 2';
                    if (age <= 11 && height > 136 && height <= 144) return 'GS BOYS U11 GROUP 3';
                    if (age <= 11 && height > 144 && height <= 152) return 'GS BOYS U11 GROUP 4';
                    if (age <= 11 && height > 152 && height <= 160) return 'GS BOYS U11 GROUP 5';
                }
            }

            if (age >= 12 && age <= 14) {
                if (sex === 'Female') {
                    if (weight <= 33.0) return 'CADET GIRLS FLY';
                    if (weight <= 37.0) return 'CADET GIRLS BANTAM';
                    if (weight <= 41.0) return 'CADET GIRLS FEATHER';
                    if (weight <= 44.0) return 'CADET GIRLS LIGHT';
                    if (weight <= 51.0) return 'CADET GIRLS WELTER'
                    if (weight > 51.0) return 'CADET GIRLS MIDDLE';
                } else {
                    if (weight <= 33.0) return 'CADET BOYS FIN';
                    if (weight <= 37.0) return 'CADET BOYS FLY';
                    if (weight <= 41.0) return 'CADET BOYS BANTAM';
                    if (weight <= 45.0) return 'CADET BOYS FEATHER';
                    if (weight <= 49.0) return 'CADET BOYS LIGHT';
                    if (weight <= 53.0) return 'CADET BOYS WELTER';
                    if (weight > 53.0) return 'CADET BOYS MIDDLE';
                }
            }

            if (age >= 15 && age <= 17) {
                if (sex === 'Female') {
                    if (weight <= 42.0) return 'JR WOMEN FIN';
                    if (weight <= 44.0) return 'JR WOMEN FLY';
                    if (weight <= 46.0) return 'JR WOMEN BANTAM';
                    if (weight <= 49.0) return 'JR WOMEN FEATHER';
                    if (weight <= 52.0) return 'JR WOMEN LIGHT';
                    if (weight <= 59.0) return 'JR WOMEN WELTER';
                    if (weight > 59.0) return 'JR WOMEN MIDDLE';
                } else {
                    if (weight <= 45.0) return 'JR MEN FIN';
                    if (weight <= 48.0) return 'JR MEN FLY';
                    if (weight <= 51.0) return 'JR MEN BANTAM';
                    if (weight <= 55.0) return 'JR MEN FEATHER';
                    if (weight <= 59.0) return 'JR MEN LIGHT';
                    if (weight <= 68.0) return 'JR MEN WELTER';
                    if (weight > 68.0) return 'JR MEN MIDDLE';
                }
            }

            // Senior (18+)
            if (sex === 'Female') {
                if (weight <= 46.0) return 'SR WOMEN FIN';
                if (weight <= 49.0) return 'SR WOMEN FLY';
                if (weight <= 53.0) return 'SR WOMEN BANTAM';
                if (weight <= 57.0) return 'SR WOMEN FEATHER';
                if (weight <= 62.0) return 'SR WOMEN LIGHT';
                if (weight <= 67.0) return 'SR WOMEN WELTER';
                if (weight > 67.0) return 'SR WOMEN MIDDLE';
            } else {
                if (weight <= 54.0) return 'SR MEN FIN';
                if (weight <= 58.0) return 'SR MEN FLY';
                if (weight <= 63.0) return 'SR MEN BANTAM';
                if (weight <= 68.0) return 'SR MEN FEATHER';
                if (weight <= 74.0) return 'SR MEN LIGHT';
                if (weight <= 80.0) return 'SR MEN WELTER';
                if (weight > 80.0) return 'SR MEN MIDDLE';
            }
        }

        return '';
    };

    // Function to get groups for all selected categories
    const getAllGroups = (
        age: number,
        categories: string[],
        sex: string,
        height: number,
        weight: number
    ): string => {
        const groups = categories
            .map(cat => getGroup(age, cat, sex, height, weight))
            .filter(g => g);           // drop empty strings
        return [...new Set(groups)] // remove duplicates
            .join(', ');
    };

    const getLevel = (belt: string): string => {
        const noviceBelts = ['White', 'Yellow', 'Orange', 'Green', 'Blue'];
        const advancedBelts = ['Purple', 'Brown', 'Red', 'Red Stripe', 'Black'];

        if (noviceBelts.includes(belt)) {
            return 'Novice';
        } else if (advancedBelts.includes(belt)) {
            return 'Advanced';
        }
        return '';
    };

    const handleDeletePlayer = (index: number) => {
        setDeleteIndex(index);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deleteIndex === null) return;
        const updatedPlayers = [...players];
        updatedPlayers.splice(deleteIndex, 1);
        setPlayers(updatedPlayers);
        setDeleteIndex(null);
        setIsDeleteModalOpen(false);
        setSuccessMessage('Player deleted successfully!');
        setSuccessType('delete');
    };

    const handleEditPlayer = (index: number) => {
        const player = players[index];
        // Find all entries for this player across all categories
        const playerEntries = players.filter(p =>
            p.lastName === player.lastName &&
            p.firstName === player.firstName &&
            p.middleName === player.middleName
        );

        // Combine all categories from different entries
        const allCategories = playerEntries.map(p => p.categories[0]).filter(Boolean);

        setNewPlayer({
            ...player,
            categories: allCategories,
        });
        setEditIndex(index);
        // Reset all dropdown states when opening edit
        setIsCategoryDropdownOpen(false);
        setIsSexDropdownOpen(false);
        setIsBeltDropdownOpen(false);
        // Clear field errors
        setFieldErrors({});
        setIsModalOpen(true);
    };

    const handleCategoryChange = (category: string, checked: boolean) => {
        setNewPlayer(prev => {
            const updatedCategories = checked
                ? [...prev.categories, category]
                : prev.categories.filter(cat => cat !== category);

            const ageNum = parseInt(prev.age);
            const heightNum = parseFloat(prev.height);
            const weightNum = parseFloat(prev.weight);

            const updatedGroup = getAllGroups(ageNum, updatedCategories, prev.sex, heightNum, weightNum);
            const updatedLevel = getLevel(prev.belt);

            return {
                ...prev,
                categories: updatedCategories,
                group: updatedGroup,
                level: updatedLevel,
            };
        });
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        const ageNum = parseInt(newPlayer.age);
        const heightNum = parseFloat(newPlayer.height);
        const weightNum = parseFloat(newPlayer.weight);
        const level = getLevel(newPlayer.belt);

        if (!isNaN(ageNum) && newPlayer.categories.length > 0 && newPlayer.sex) {
            const group = getAllGroups(ageNum, newPlayer.categories, newPlayer.sex, heightNum, weightNum);

            // Only update if the values actually changed to prevent infinite loops
            if (newPlayer.group !== group || newPlayer.level !== level) {
                setNewPlayer((prev) => ({ ...prev, group, level }));
            }
        } else if (newPlayer.belt && newPlayer.level !== level) {
            setNewPlayer((prev) => ({ ...prev, level }));
        }
    }, [newPlayer.age, newPlayer.height, newPlayer.weight, newPlayer.sex, newPlayer.categories, newPlayer.belt]); // Keep the same dependencies but add conditional updates



    // Get player count for each tab
    const getPlayerCount = (category: string) => {
        return players.filter(player => player.categories.includes(category)).length;
    };

    // Filter players by active tab and search
    let filteredPlayers = players.filter((player) => {
        const matchesTab = player.categories.includes(activeTab);
        const matchesSearch = Object.values(player).join(' ').toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    if (sortColumn) {
        filteredPlayers = [...filteredPlayers].sort((a, b) => {
            const valueA = a[sortColumn as keyof typeof a];
            const valueB = b[sortColumn as keyof typeof b];
            return sortDirection === 'asc'
                ? String(valueA).localeCompare(String(valueB))
                : String(valueB).localeCompare(String(valueA));
        });
    }

    // Check if Kyorugi is selected to show weight field
    const isKyorugiSelected = newPlayer.categories.includes('Kyorugi');

    return (
        <div className="font-geist px-6 py-3 lg:p-6 lg:ml-10 lg:mr-10 min-h-screen">
            {/* Header */}
            <div className="md:mt-30 mt-25 flex justify-between items-start">
                <div>
                    <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
                        {competitionTitle || 'Loading...'}
                    </h1>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 lg:px-6 lg:py-3 border rounded shadow-lg text-sm lg:text-base font-regular transition-all duration-300 whitespace-nowrap ${successType === 'add' ? 'bg-green-100 border-green-400 text-green-700' :
                    successType === 'update' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
                        'bg-red-100 border-red-400 text-red-700'
                    }`}>
                    {successMessage}
                </div>
            )}

            {isCheckingRegistration ? (
                <div className="text-center py-8 lg:py-16 h-40 lg:h-60">
                    <p className="text-gray-600">Checking registration status...</p>

                </div>
            ) : isTeamRegistered ? (
                <div className="text-center py-8 lg:py-16 h-40 lg:h-60">
                    <p className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
                        Your team has already been registered in this competition.
                    </p>



                    <button
                        onClick={() => router.push('/registration')}
                        className="px-4 py-2 lg:px-6 lg:py-3 bg-[#EAB044] text-white rounded-md font-bold hover:bg-[#d49a35] transition-colors cursor-pointer"
                    >
                        REGISTRATION
                    </button>

                </div>
            ) : (
                <>
                    <div className="mb-4 lg:mb-2 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
                        <div>
                            <p className=" text-gray-400 text-sm lg:text-base mb-3 md:mb-1">
                                Note: Add players to their respective categories.
                            </p>
                        </div>
                        <div className="flex justify-end lg:justify-start gap-2 -mb-1 md:mb-2">
                            <button
                                onClick={() => {
                                    setNewPlayer(emptyPlayer());
                                    setEditIndex(null);
                                    setIsCategoryDropdownOpen(false); // Reset dropdown state
                                    setIsSexDropdownOpen(false); // Reset sex dropdown
                                    setIsBeltDropdownOpen(false); // Reset belt dropdown
                                    setFieldErrors({}); // Clear field errors
                                    setIsModalOpen(true);
                                }}
                                className="cursor-pointer font-bold bg-[#EAB044] text-white px-3 py-2 lg:px-4 lg:py-2 rounded-md text-xs lg:text-sm hover:bg-[#d49a35]"
                            >
                                ADD PLAYER
                            </button>
                        </div>
                    </div>

                    {/* Search + Table */}
                    <div className="bg-white border border-[rgba(0,0,0,0.2)] rounded-md overflow-hidden">
                        {/* Search Bar */}
                        <div className="flex justify-end p-3 lg:p-4 border-b border-[rgba(0,0,0,0.2)]">
                            <div className="relative w-full lg:max-w-xs">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#EAB044] text-sm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                                    <Image src="/icons/search.svg" alt="Search Icon" width={16} height={16} />
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-[rgba(0,0,0,0.2)]">
                            <div className="flex overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key as 'Kyorugi' | 'Poomsae' | 'Poomsae Team')}
                                        className={`cursor-pointer relative flex items-center gap-2 px-4 lg:px-6 py-3 text-xs lg:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                                            ? 'border-[#EAB044] text-[#EAB044] bg-orange-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span className="inline-flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 text-xs font-semibold text-white bg-[#EAB044] rounded-full">
                                            {getPlayerCount(tab.key)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`w-full ${filteredPlayers.length > 8 ? 'max-h-[310px] overflow-y-auto' : ''}`}>
                            {/* Mobile Table View */}
                            <div className="lg:hidden">
                                {filteredPlayers.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        No players found in {activeTab} category.
                                    </div>
                                ) : (
                                    <div>
                                        <table className="w-full text-xs">
                                            <thead className="bg-orange-50 border-b border-[rgba(0,0,0,0.2)]">
                                                <tr>
                                                    <th className="p-2 text-left text-gray-700 font-medium w-[45%]">Name</th>
                                                    <th className="p-2 text-left text-gray-700 font-medium w-[35%]">Group</th>
                                                    <th className="p-2 w-[20%]"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredPlayers.map((player, index) => (
                                                    <tr key={index} className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                        <td className="p-2 w-[45%]">
                                                            <div className="text-xs font-medium text-gray-900 leading-tight break-words">
                                                                {player.firstName} {player.lastName}
                                                            </div>
                                                        </td>
                                                        <td className="p-2 text-xs w-[35%]">
                                                            <div className="break-words text-xs leading-tight">
                                                                {player.group}
                                                            </div>
                                                        </td>
                                                        <td className="p-2 w-[20%]">
                                                            <div className="flex gap-1 justify-center">
                                                                <button
                                                                    onClick={() => handleEditPlayer(players.indexOf(player))}
                                                                    className="cursor-pointer p-1"
                                                                    title="Edit"
                                                                >
                                                                    <Image src="/icons/edit.svg" alt="Edit" width={16} height={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeletePlayer(players.indexOf(player))}
                                                                    className="cursor-pointer p-1"
                                                                    title="Delete"
                                                                >
                                                                    <Image src="/icons/delete.svg" alt="Delete" width={16} height={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <table className="w-full table-fixed text-sm">
                                    <thead className="bg-orange-50 border-b border-[rgba(0,0,0,0.2)]">
                                        <tr>
                                            {columns.map((col) => (
                                                <th
                                                    key={col.key}
                                                    className={`p-3 ${col.width} text-left text-gray-700 font-medium cursor-pointer`}
                                                    onClick={() => handleSort(col.key)}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        {col.label}
                                                        <Image
                                                            src="/icons/down-arrow.svg"
                                                            alt="Sort"
                                                            width={12}
                                                            height={12}
                                                            className={`transition-transform ${sortColumn === col.key && sortDirection === 'desc' ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="p-3 w-[120px] text-left text-gray-700 font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPlayers.length === 0 ? (
                                            <tr>
                                                <td colSpan={columns.length + 1} className="p-8 text-center text-gray-500">
                                                    No players found in {activeTab} category.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredPlayers.map((player, index) => (
                                                <tr key={index} className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                    }`}>
                                                    {columns.map((col) => (
                                                        <td key={col.key} className="p-3">
                                                            {player[col.key as keyof typeof player]}
                                                        </td>
                                                    ))}
                                                    <td className="p-3 text-left">
                                                        <div className="flex items-center gap-3 -ml-8">
                                                            <button
                                                                onClick={() => handleEditPlayer(players.indexOf(player))}
                                                                className="cursor-pointer flex items-center gap-1 hover:underline text-sm text-[#EAB044]"
                                                            >
                                                                <Image src="/icons/edit.svg" alt="Edit" width={14} height={14} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePlayer(players.indexOf(player))}
                                                                className="cursor-pointer flex items-center gap-1 hover:underline text-sm text-red-500"
                                                            >
                                                                <Image src="/icons/delete.svg" alt="Delete" width={14} height={14} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        {showNoPlayersModal && (
                            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                                <div className="bg-white p-6 rounded-md w-full max-w-md border border-[rgba(0,0,0,0.2)] shadow-lg relative">
                                    <h3 className="text-xl font-semibold mb-4">No Players Found</h3>
                                    <p className="mb-4">Please add at least one player before submitting.</p>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => setShowNoPlayersModal(false)}
                                            className="font-bold px-6 py-2 bg-[#EAB044] text-white rounded-md text-sm hover:bg-[#d49a35] cursor-pointer"
                                        >
                                            CONFIRM
                                        </button>
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSubmitPlayers}
                            className="px-3 py-2 lg:px-4 lg:py-2 bg-[#EAB044] font-bold text-white rounded-md text-xs lg:text-sm hover:bg-[#d49a35] cursor-pointer"
                        >
                            SUBMIT
                        </button>
                    </div>
                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
                            <div className="bg-white p-4 lg:p-6 rounded-md w-full max-w-[1400px] max-h-[90vh] overflow-y-auto border border-[rgba(0,0,0,0.2)] shadow-lg relative">
                                <button
                                    className="absolute top-2 right-3 text-xl font-bold text-gray-600 cursor-pointer z-10"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditIndex(null);
                                        setIsCategoryDropdownOpen(false);
                                        setIsSexDropdownOpen(false); // Reset sex dropdown
                                        setIsBeltDropdownOpen(false); // Reset belt dropdown
                                        setFieldErrors({}); // Clear field errors
                                    }}
                                >
                                    ×
                                </button>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleAddPlayer();
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                                        {inputField({ label: 'Last Name', value: newPlayer.lastName, onChange: (v: string) => setNewPlayer({ ...newPlayer, lastName: v }), required: true })}
                                        {inputField({ label: 'First Name', value: newPlayer.firstName, onChange: (v: string) => setNewPlayer({ ...newPlayer, firstName: v }), required: true })}
                                        {inputField({ label: 'Middle Name', value: newPlayer.middleName, onChange: (v: string) => setNewPlayer({ ...newPlayer, middleName: v }) })}
                                        {selectField({
                                            label: 'Sex',
                                            value: newPlayer.sex,
                                            onChange: (v: string) => setNewPlayer({ ...newPlayer, sex: v }),
                                            required: true,
                                            options: ['Male', 'Female'],
                                            isOpen: isSexDropdownOpen,
                                            setIsOpen: setIsSexDropdownOpen
                                        })}
                                        {inputField({ label: 'Age', value: newPlayer.age, onChange: (v: string) => setNewPlayer({ ...newPlayer, age: v }), required: true, type: 'number' })}
                                        {inputField({ label: 'Height (cm)', value: newPlayer.height, onChange: (v: string) => setNewPlayer({ ...newPlayer, height: v }), required: true, type: 'number' })}
                                        {inputField({ label: 'Weight (kg)', value: newPlayer.weight, onChange: (v: string) => setNewPlayer({ ...newPlayer, weight: v }), required: isKyorugiSelected, type: 'number' })}
                                        {selectField({
                                            label: 'Belt',
                                            value: newPlayer.belt,
                                            onChange: (v: string) => setNewPlayer({ ...newPlayer, belt: v }),
                                            required: true,
                                            options: [
                                                'White',
                                                'Yellow',
                                                'Orange',
                                                'Green',
                                                'Blue',
                                                'Purple',
                                                'Brown',
                                                'Red',
                                                'Red Stripe',
                                                'Black',
                                            ],
                                            isOpen: isBeltDropdownOpen,
                                            setIsOpen: setIsBeltDropdownOpen
                                        })}
                                        {inputField({
                                            label: 'Level',
                                            value: newPlayer.level || 'Auto-generated',
                                            onChange: () => { },
                                            disabled: true,
                                        })}
                                        {checklistDropdownField({
                                            label: 'Category',
                                            selectedValues: newPlayer.categories,
                                            options: categoryOptions,
                                            onChange: handleCategoryChange,
                                            required: true,
                                            isOpen: isCategoryDropdownOpen,
                                            setIsOpen: setIsCategoryDropdownOpen
                                        })}
                                        {inputField({
                                            label: 'Group',
                                            value: newPlayer.group || 'Auto-generated',
                                            onChange: () => { },
                                            disabled: true,
                                        })}
                                    </div>
                                    <div className="mt-4 lg:mt-6 flex justify-end">
                                        <button type="submit" className="font-bold bg-[#EAB044] cursor-pointer text-white px-4 py-2 lg:px-6 lg:py-2 rounded-md text-sm hover:bg-[#d49a35] w-full md:w-auto">
                                            {editIndex !== null ? 'SAVE CHANGES' : 'ADD PLAYER'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Delete Modal */}
                    {isDeleteModalOpen && deleteIndex !== null && (
                        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
                            <div className="bg-white p-3 lg:p-6 rounded-md w-full max-w-xs lg:max-w-md border border-[rgba(0,0,0,0.2)] shadow-lg relative">
                                <p className="mb-3 lg:mb-6 text-gray-700 text-xs lg:text-base">Are you sure you want to <span className="font-bold text-red-600">DELETE</span> this player? This action cannot be undone.</p>
                                <div className="flex flex-col md:flex-row justify-end gap-2 lg:gap-3">
                                    <button
                                        className="px-3 py-1.5 lg:px-4 lg:py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer text-xs lg:text-base order-2 md:order-1"
                                        onClick={() => {
                                            setIsDeleteModalOpen(false);
                                            setDeleteIndex(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-3 py-1.5 lg:px-4 lg:py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer text-xs lg:text-base order-1 md:order-2"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Confirmation Modal */}
                    {showSubmitConfirmModal && (
                        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
                            <div className="bg-white p-3 lg:p-6 rounded-md w-full max-w-xs lg:max-w-md border border-[rgba(0,0,0,0.2)] shadow-lg relative">
                                <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-4 text-gray-800">Confirm Registration</h3>
                                <p className="mb-3 lg:mb-6 text-gray-700 text-xs lg:text-base">
                                    These players will be registered to the competition, you cannot edit or delete them after submission.
                                </p>

                                <div className="mb-3 lg:mb-6">
                                    <label className="flex items-start space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={agreeToTerms}
                                            onChange={(e) => {
                                                setAgreeToTerms(e.target.checked);
                                                // Clear error when user checks the checkbox
                                                if (e.target.checked) {
                                                    setShowCheckboxError(false);
                                                }
                                            }}
                                            className={`mt-1 rounded border-gray-300 text-[#EAB044] focus:ring-[#EAB044] ${showCheckboxError ? 'ring-2 ring-red-500' : ''
                                                }`}
                                        />
                                        <span className="text-xs lg:text-sm text-gray-700 leading-relaxed">
                                            I agree that the information I provided is correct and true.
                                        </span>
                                    </label>
                                    {showCheckboxError && (
                                        <span className="text-red-500 text-xs mt-2 ml-6">
                                            Please agree to the terms before submitting.
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row justify-end gap-2 lg:gap-3">
                                    <button
                                        className="px-3 py-1.5 lg:px-4 lg:py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer text-xs lg:text-base order-2 md:order-1"
                                        onClick={() => {
                                            setShowSubmitConfirmModal(false);
                                            setAgreeToTerms(false);
                                            setShowCheckboxError(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmSubmitPlayers}
                                        className="px-3 py-1.5 lg:px-4 lg:py-2 rounded bg-[#EAB044] hover:bg-[#d49a35] text-white cursor-pointer text-xs lg:text-base order-1 md:order-2"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reload Warning Modal */}
                    {showReloadWarningModal && (
                        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
                            <div className="bg-white p-4 lg:p-6 rounded-md w-full max-w-md border border-[rgba(0,0,0,0.2)] shadow-lg relative">
                                <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4 text-gray-800">Warning</h3>
                                <p className="mb-4 lg:mb-6 text-gray-700 text-sm lg:text-base">
                                    Your team will not be saved if you reload the page. All unsaved changes will be lost.
                                </p>

                                <div className="flex flex-col md:flex-row justify-end gap-3">
                                    <button
                                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer text-sm lg:text-base order-2 md:order-1"
                                        onClick={() => {
                                            setShowReloadWarningModal(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReloadWarningModal(false);
                                            window.location.reload();
                                        }}
                                        className="px-4 lg:px-6 py-2 rounded bg-[#EAB044] hover:bg-[#d49a35] text-white cursor-pointer text-sm lg:text-base order-1 md:order-2"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    function inputField({ label, value, onChange, required = false, type = 'text', disabled = false }: any) {
        // Map label to field key used in validation
        const fieldKeyMap: { [key: string]: string } = {
            'Last Name': 'lastName',
            'First Name': 'firstName',
            'Middle Name': 'middleName',
            'Age': 'age',
            'Height (cm)': 'height',
            'Weight (kg)': 'weight'
        };

        // Custom placeholders for specific fields
        const placeholderMap: { [key: string]: string } = {
            'Last Name': 'Enter last name (e.g. Dela Cruz)',
            'First Name': 'Enter first name (e.g. Juan)'
        };

        const fieldKey = fieldKeyMap[label] || label.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '');
        const hasError = fieldErrors[fieldKey];
        const placeholder = placeholderMap[label] || `Enter ${label.toLowerCase()}`;

        return (
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        // Clear error when user starts typing
                        if (hasError) {
                            setFieldErrors(prev => ({ ...prev, [fieldKey]: '' }));
                        }
                    }}
                    placeholder={placeholder}
                    className={`w-full rounded p-2 ${disabled ? 'bg-gray-100' : ''} ${hasError ? 'border-2 border-red-500' : 'border border-[rgba(0,0,0,0.2)]'}`}
                    disabled={disabled}
                />
                {hasError && (
                    <p className="text-red-500 text-xs mt-1">{hasError}</p>
                )}
            </div>
        );
    }

    function selectField({ label, value, onChange, required = false, options = [], isOpen, setIsOpen }: any) {
        // Map label to field key used in validation
        const fieldKeyMap: { [key: string]: string } = {
            'Sex': 'sex',
            'Belt': 'belt'
        };

        const fieldKey = fieldKeyMap[label] || label.toLowerCase();
        const hasError = fieldErrors[fieldKey];

        return (
            <div className="relative">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                    <select
                        value={value}
                        onChange={(e) => {
                            onChange(e.target.value);
                            // Clear error when user makes selection
                            if (hasError) {
                                setFieldErrors(prev => ({ ...prev, [fieldKey]: '' }));
                            }
                        }}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setIsOpen(false)}
                        className={`cursor-pointer w-full rounded p-2 pr-10 appearance-none text-gray-700 ${hasError ? 'border-2 border-red-500' : 'border border-[rgba(0,0,0,0.2)]'
                            }`}
                    >
                        <option value="">Select {label.toLowerCase()}</option>
                        {options.map((opt: string) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>

                    {/* Custom down arrow with rotation */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600">
                        <svg
                            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
                {hasError && (
                    <p className="text-red-500 text-xs mt-1">{hasError}</p>
                )}
            </div>
        );
    }

    function checklistDropdownField({ label, selectedValues, options, onChange, required = false, isOpen, setIsOpen }: any) {
        const displayValue = selectedValues.length === 0
            ? 'Select category'
            : selectedValues.join(', ');

        const fieldKey = 'categories';
        const hasError = fieldErrors[fieldKey];

        return (
            <div className="relative">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={`cursor-pointer w-full rounded p-2 pr-10 bg-white text-gray-700 flex items-center justify-between transition-colors ${hasError
                            ? 'border-2 border-red-500'
                            : isOpen
                                ? 'border-2 border-black'
                                : 'border border-[rgba(0,0,0,0.2)] hover:border-gray-300'
                            }`}
                    >
                        <span className={selectedValues.length === 0 ? 'text-gray-500' : ''}>
                            {displayValue}
                        </span>
                    </div>

                    {/* Custom down arrow - matching other select fields */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600">
                        <svg
                            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[rgba(0,0,0,0.2)] rounded shadow-lg z-10">
                            <div className="p-3 space-y-2">
                                {options.map((option: string) => (
                                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedValues.includes(option)}
                                            onChange={(e) => {
                                                onChange(option, e.target.checked);
                                                // Clear error when user makes selection
                                                if (hasError) {
                                                    setFieldErrors(prev => ({ ...prev, [fieldKey]: '' }));
                                                }
                                            }}
                                            className="rounded border-gray-300 text-[#EAB044] focus:ring-[#EAB044]"
                                        />
                                        <span className="text-sm text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {hasError && (
                    <p className="text-red-500 text-xs mt-1">{hasError}</p>
                )}
            </div>
        );
    }
}