'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

type Player = {
  id?: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  sex: string;
  age: string;
  height: string;
  belt: string;
  category: string;
  group_name: string;
};

export default function PlayersPage() {
  // State for delete confirmation modal
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Player>(emptyPlayer());
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Error and success states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const columns = [
    { label: 'Last Name', key: 'last_name', width: 'w-[120px]' },
    { label: 'First Name', key: 'first_name', width: 'w-[130px]' },
    { label: 'Middle Name', key: 'middle_name', width: 'w-[130px]' },
    { label: 'Sex', key: 'sex', width: 'w-[70px]' },
    { label: 'Age', key: 'age', width: 'w-[60px]' },
    { label: 'Height (cm)', key: 'height', width: 'w-[120px]' },
    { label: 'Belt', key: 'belt', width: 'w-[130px]' },
    { label: 'Category', key: 'category', width: 'w-[90px]' },
    { label: 'Group', key: 'group_name', width: 'w-[130px]' },
  ];

  function emptyPlayer(): Player {
    return {
      last_name: '',
      first_name: '',
      middle_name: '',
      sex: '',
      age: '',
      height: '',
      belt: '',
      category: '',
      group_name: '',
    };
  }

  useEffect(() => {
    const checkAuthAndLoadPlayers = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          router.push('/auth/sign-in?redirectTo=/user-dashboard/players');
          return;
        }

        if (!session?.user) {
          router.push('/auth/sign-in?redirectTo=/user-dashboard/players');
          return;
        }

        setUser(session.user);
        await loadPlayers();

      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/auth/sign-in?redirectTo=/user-dashboard/players');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadPlayers();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          router.push('/auth/sign-in?redirectTo=/user-dashboard/players');
        } else if (session?.user) {
          setUser(session.user);
          await loadPlayers();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const loadPlayers = async () => {
    try {
      console.log('📥 Loading players...');
      // Get current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('❌ No session for loading players');
        return;
      }

      console.log('🔐 Session found, making API request...');

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/players', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📡 Load players response status:', response.status);

      if (!response) {
        throw new Error('No response received from server');
      }

      const data = await response.json();
      console.log('📡 Load players response data:', data);

      if (response.ok && data.players) {
        console.log('✅ Players loaded successfully:', data.players.length, 'players');
        setPlayers(data.players);
      } else {
        console.error('❌ Failed to load players:', data.error);
      }
    } catch (error) {
      console.error('💥 Error loading players:', error);

      // Handle specific error types
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ Load players request timed out');
      }
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleAddPlayer = async () => {
    console.log('🚀 Starting handleAddPlayer...');
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    // Improved validation for required fields
    const errorsObj: { [key: string]: string } = {};
    if (!newPlayer.last_name || newPlayer.last_name.trim() === '') {
      errorsObj.last_name = 'Last name is required.';
    }
    if (!newPlayer.first_name || newPlayer.first_name.trim() === '') {
      errorsObj.first_name = 'First name is required.';
    }
    if (!newPlayer.sex || newPlayer.sex.trim() === '') {
      errorsObj.sex = 'Sex is required.';
    }
    const ageStr = typeof newPlayer.age === 'string' ? newPlayer.age : String(newPlayer.age ?? '');
    const heightStr = typeof newPlayer.height === 'string' ? newPlayer.height : String(newPlayer.height ?? '');
    if (!ageStr || ageStr.trim() === '' || isNaN(Number(ageStr)) || Number(ageStr) <= 0) {
      errorsObj.age = 'Valid age is required.';
    }
    if (!heightStr || heightStr.trim() === '' || isNaN(Number(heightStr)) || Number(heightStr) <= 0) {
      errorsObj.height = 'Valid height is required.';
    }
    if (!newPlayer.belt || newPlayer.belt.trim() === '') {
      errorsObj.belt = 'Belt is required.';
    }
    if (!newPlayer.category || newPlayer.category.trim() === '') {
      errorsObj.category = 'Category is required.';
    }

    // Check for duplicate player (last name and first name identical)
    const normalizedLastName = newPlayer.last_name.trim().toLowerCase();
    const normalizedFirstName = newPlayer.first_name.trim().toLowerCase();
    const isDuplicate = players.some((p, idx) => {
      // If updating, skip the current index
      if (editIndex !== null && idx === editIndex) return false;
      return (
        p.last_name.trim().toLowerCase() === normalizedLastName &&
        p.first_name.trim().toLowerCase() === normalizedFirstName
      );
    });
    if (isDuplicate) {
      errorsObj.general = 'This player has already been added.';
    }

    if (Object.keys(errorsObj).length > 0) {
      setErrors(errorsObj);
      setIsSubmitting(false);
      return;
    }

    try {
      // Always refresh session before API call
      let { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Try to refresh session
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshed.session) {
          setErrors({ general: 'Authentication expired. Please sign in again.' });
          setIsSubmitting(false);
          return;
        }
        session = refreshed.session;
      }
      const ageNum = parseInt(newPlayer.age);
      const generatedGroup = !isNaN(ageNum) && newPlayer.category ? getGroup(ageNum, newPlayer.category) : '';
      if (!generatedGroup) {
        setErrors({ general: 'Unable to determine group based on age and category. Please check your inputs.' });
        setIsSubmitting(false);
        return;
      }
      const playerData = {
        last_name: typeof newPlayer.last_name === 'string' ? newPlayer.last_name.trim() : String(newPlayer.last_name ?? '').trim(),
        first_name: typeof newPlayer.first_name === 'string' ? newPlayer.first_name.trim() : String(newPlayer.first_name ?? '').trim(),
        middle_name: typeof newPlayer.middle_name === 'string' ? newPlayer.middle_name.trim() : String(newPlayer.middle_name ?? '').trim(),
        sex: typeof newPlayer.sex === 'string' ? newPlayer.sex.trim() : String(newPlayer.sex ?? '').trim(),
        age: typeof newPlayer.age === 'string' ? newPlayer.age.trim() : String(newPlayer.age ?? '').trim(),
        height: typeof newPlayer.height === 'string' ? newPlayer.height.trim() : String(newPlayer.height ?? '').trim(),
        belt: typeof newPlayer.belt === 'string' ? newPlayer.belt.trim() : String(newPlayer.belt ?? '').trim(),
        category: typeof newPlayer.category === 'string' ? newPlayer.category.trim() : String(newPlayer.category ?? '').trim(),
        group_name: typeof generatedGroup === 'string' ? generatedGroup.trim() : String(generatedGroup ?? '').trim(),
      };
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      let response;
      let updatedPlayers;
      if (editIndex !== null && players[editIndex]?.id) {
        // Update existing player
        response = await fetch('/api/players', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            id: players[editIndex].id,
            ...playerData,
          }),
          signal: controller.signal,
        });
      } else {
        // Create new player
        response = await fetch('/api/players', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(playerData),
          signal: controller.signal,
        });
      }
      clearTimeout(timeoutId);
      if (!response) {
        throw new Error('No response received from server');
      }
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(''), 5000);
        if (editIndex !== null && players[editIndex]?.id) {
          // Optimistically update player in local state
          updatedPlayers = [...players];
          updatedPlayers[editIndex] = { ...updatedPlayers[editIndex], ...playerData };
          setPlayers(updatedPlayers);
        } else {
          // Optimistically add new player to local state
          setPlayers((prev) => [...prev, { ...playerData, id: data.id }]);
        }
        setNewPlayer(emptyPlayer());
        setIsModalOpen(false);
        setEditIndex(null);
      } else {
        setErrors({ general: data.error || 'Failed to save player. Please try again.' });
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrors({ general: 'Request timed out. Please check your connection and try again.' });
        } else {
          setErrors({ general: `An unexpected error occurred: ${error.message}` });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
    setIsSubmitting(false);
  };

  const getGroup = (age: number, category: string): string => {
    if (category === 'Kyorugi') {
      if (age <= 11) return 'Grade School';
      if (age <= 14) return 'Cadet';
      if (age <= 17) return 'Junior';
      return 'Senior';
    } else if (category === 'Poomsae') {
      if (age <= 6) return 'Toddlers';
      if (age <= 9) return 'Group 1';
      if (age <= 13) return 'Group 2';
      if (age <= 17) return 'Group 3';
      return 'Group 4';
    }
    return '';
  };

  const handleDeletePlayer = async (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleEditPlayer = (index: number) => {
    setNewPlayer({ ...players[index] });
    setEditIndex(index);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const ageNum = parseInt(newPlayer.age);
    if (!isNaN(ageNum) && newPlayer.category) {
      const group = getGroup(ageNum, newPlayer.category);
      setNewPlayer((prev) => ({ ...prev, group_name: group }));
    }
  }, [newPlayer.age, newPlayer.category]);

  let filteredPlayers = players.filter((player) => {
    const playerValues = Object.values(player).join(' ').toLowerCase();
    return playerValues.includes(search.toLowerCase());
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

  if (isLoading) {
    return (
      <div className="font-geist p-6 ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#EAB044] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-geist p-6 ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Players</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              setNewPlayer(emptyPlayer());
              setEditIndex(null);
              setIsModalOpen(true);
              setErrors({});
              setSuccessMessage('');
            }}
            className="cursor-pointer bg-[#EAB044] text-white px-4 py-2 rounded-md text-sm hover:bg-[#d49a35]"
          >
            Add Player
          </button>
        </div>
      </div>
      <div className="mb-2">
        <p className=" text-gray-400">Note: If you don't see your player listed, please refresh the page.</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Search + Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.2)] rounded-md overflow-x-auto">
        <div className="flex justify-end p-4 border-b border-[rgba(0,0,0,0.2)]">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#EAB044]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <Image src="/icons/search.svg" alt="Search Icon" width={16} height={16} />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full table-fixed text-sm">
          <thead className="bg-gray-50 border-b border-[rgba(0,0,0,0.2)]">
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
            {filteredPlayers.map((player, index) => (
              <tr key={player.id || index} className="border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="p-3">
                    {player[col.key as keyof typeof player]}
                  </td>
                ))}
                <td className="p-3 text-left">
                  <div className="flex items-center gap-3 -ml-8">
                    <button
                      onClick={() => handleEditPlayer(index)}
                      className="cursor-pointer flex items-center gap-1 hover:underline text-sm text-[#EAB044]"
                    >
                      <Image src="/icons/edit.svg" alt="Edit" width={14} height={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(index)}
                      className="cursor-pointer flex items-center gap-1 hover:underline text-sm text-red-500"
                    >
                      <Image src="/icons/delete.svg" alt="Delete" width={14} height={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && deleteIndex !== null && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md border border-[rgba(0,0,0,0.2)] shadow-lg relative">

              <p className="mb-6 text-gray-700">Are you sure you want to <span className="font-bold text-red-600">DELETE</span> this player? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteIndex(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  onClick={async () => {
                    const indexToDelete = deleteIndex;
                    setIsDeleteModalOpen(false);
                    setDeleteIndex(null);
                    if (indexToDelete === null) return;
                    const player = players[indexToDelete];
                    if (!player?.id) {
                      return;
                    }
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      if (!session) {
                        alert('Authentication expired. Please sign in again.');
                        return;
                      }
                      const response = await fetch(`/api/players?id=${player.id}`, {
                        method: 'DELETE',
                        headers: {
                          'Authorization': `Bearer ${session.access_token}`,
                        },
                      });
                      const data = await response.json();
                      if (response.ok && data.success) {
                        setSuccessMessage(data.message);
                        setTimeout(() => setSuccessMessage(''), 5000);
                        // Optimistically remove player from local state
                        setPlayers((prev) => prev.filter((_, i) => i !== indexToDelete));
                      } else {
                        alert(data.error || 'Failed to delete player. Please try again.');
                      }
                    } catch (error) {
                      console.error('Delete player error:', error);
                      alert('An unexpected error occurred. Please try again.');
                    }
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="grid grid-cols-3 items-center mt-4 text-sm text-gray-600">
        <p className="justify-self-start">
          Showing 1 to {filteredPlayers.length} of {filteredPlayers.length} results
        </p>
        <div className="flex items-center justify-center gap-1 relative">
          <div className="relative">
            <select className="appearance-none border border-[rgba(0,0,0,0.2)] rounded-md px-3 py-1 text-sm text-center pr-6 cursor-pointer">
              <option value="10">10</option>
            </select>
            <Image
              src="/icons/down-arrow.svg"
              alt="Dropdown"
              width={12}
              height={12}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none cursor-pointer"
            />
          </div>
          <span className="text-sm">per page</span>
        </div>
        <div className="flex justify-end items-center gap-3">
          <div className="flex items-center border border-[rgba(0,0,0,0.2)] rounded overflow-hidden h-[36px]">
            <button className="px-3 h-full border-r border-[rgba(0,0,0,0.2)] cursor-pointer">
              <Image src="/icons/previous.svg" alt="Previous" width={20} height={20} />
            </button>
            <div className="px-4 bg-[#00000010] text-[#EAB044] font-semibold text-sm h-full flex items-center">1</div>
            <button className="px-3 h-full border-l border-[rgba(0,0,0,0.2)] cursor-pointer">
              <Image src="/icons/next.svg" alt="Next" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-start items-center z-50" style={{ paddingLeft: '16rem' }}>
          <div className="bg-white p-6 ml-14 rounded-md w-full max-w-[1126px] border border-[rgba(0,0,0,0.2)] shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-xl font-bold text-gray-600 cursor-pointer"
              onClick={() => {
                setIsModalOpen(false);
                setEditIndex(null);
                setErrors({});
                setSuccessMessage('');
              }}
            >
              ×
            </button>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPlayer();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {inputField({
                  label: 'Last Name',
                  value: newPlayer.last_name,
                  onChange: (v: string) => setNewPlayer({ ...newPlayer, last_name: v }),
                  required: true
                })}
                {inputField({
                  label: 'First Name',
                  value: newPlayer.first_name,
                  onChange: (v: string) => setNewPlayer({ ...newPlayer, first_name: v }),
                  required: true
                })}
                {inputField({
                  label: 'Middle Name',
                  value: newPlayer.middle_name,
                  onChange: (v: string) => setNewPlayer({ ...newPlayer, middle_name: v })
                })}
                {selectField({
                  label: 'Sex',
                  value: newPlayer.sex,
                  onChange: (v: string) => setNewPlayer({ ...newPlayer, sex: v }),
                  required: true,
                  options: ['Male', 'Female']
                })}
                {inputField({
                  label: 'Age',
                  value: newPlayer.age,
                  onChange: (v: string) => setNewPlayer({ ...newPlayer, age: v }),
                  required: true,
                  type: 'number'
                })}
                {inputField({
                  label: 'Height (cm)',
                  value: newPlayer.height,
                  onChange: (v: string) => setNewPlayer({ ...newPlayer, height: v }),
                  required: true,
                  type: 'number'
                })}
                {selectField({
                  label: 'Belt',
                  value: newPlayer.belt,
                  onChange: (v: string) => setNewPlayer({ ...newPlayer, belt: v }),
                  required: true,
                  options: [
                    'White Belt',
                    'Yellow Belt',
                    'Orange Belt',
                    'Green Belt',
                    'Blue Belt',
                    'Brown Belt',
                    'Senior Brown Belt',
                    'Red Belt',
                    'Senior Red Belt',
                    'Poom Belt',
                    'Black Belt',
                  ],
                })}
                {selectField({
                  label: 'Category',
                  value: newPlayer.category,
                  onChange: (v: string) => setNewPlayer({ ...newPlayer, category: v }),
                  required: true,
                  options: ['Kyorugi', 'Poomsae']
                })}
                {inputField({
                  label: 'Group',
                  value: newPlayer.group_name || 'Auto-generated based on age and category',
                  onChange: () => { },
                  disabled: true,
                })}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#EAB044] cursor-pointer text-white px-6 py-2 rounded-md text-sm hover:bg-[#d49a35] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editIndex !== null ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      {editIndex !== null ? 'Save Changes' : '+ Add Player'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function inputField({ label, value, onChange, required = false, type = 'text', disabled = false }: any) {
    return (
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={`w-full border border-[rgba(0,0,0,0.2)] rounded p-2 ${disabled ? 'bg-gray-100' : ''}`}
          disabled={disabled}
        />
      </div>
    );
  }

  function selectField({ label, value, onChange, required = false, options = [] }: any) {
    return (
      <div className="relative">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="cursor-pointer w-full border border-[rgba(0,0,0,0.2)] rounded p-2 pr-10 appearance-none text-gray-700"
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {/* Custom down arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600">
            <svg
              className="h-4 w-4"
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
      </div>
    );
  }
}