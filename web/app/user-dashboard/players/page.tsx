'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

export default function PlayersPage() {
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const columns = useMemo(() => [
    { label: 'Last Name', key: 'last_name', width: 'w-[120px]' },
    { label: 'First Name', key: 'first_name', width: 'w-[130px]' },
    { label: 'Middle Name', key: 'middle_name', width: 'w-[130px]' },
    { label: 'Sex', key: 'sex', width: 'w-[70px]' },
    { label: 'Age', key: 'age', width: 'w-[60px]' },
    { label: 'Height (cm)', key: 'height', width: 'w-[120px]' },
    { label: 'Belt', key: 'belt', width: 'w-[130px]' },
    { label: 'Category', key: 'category', width: 'w-[90px]' },
    { label: 'Group', key: 'group_name', width: 'w-[130px]' },
  ], []);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(handler);
  }, [search]);

  // Memoized filtered and sorted players
  const filteredPlayers = useMemo(() => {
    let result = players.filter((player) => {
      const playerValues = Object.values(player).join(' ').toLowerCase();
      return playerValues.includes(debouncedSearch.toLowerCase());
    });
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const valueA = a[sortColumn as keyof Player];
        const valueB = b[sortColumn as keyof Player];
        return sortDirection === 'asc'
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      });
    }
    return result;
  }, [players, debouncedSearch, sortColumn, sortDirection]);

  // Session helper
  const getSession = useCallback(async () => {
    let { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshed.session) return null;
      session = refreshed.session;
    }
    return session;
  }, []);

  // Load players
  const loadPlayers = useCallback(async () => {
    try {
      const session = await getSession();
      if (!session) return;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch('/api/players', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response) return;
      const data = await response.json();
      if (response.ok && data.players) {
        setPlayers(data.players);
      }
    } catch { }
  }, [getSession]);

  useEffect(() => {
    let mounted = true;
    const checkAuthAndLoadPlayers = async () => {
      const session = await getSession();
      if (!session?.user) {
        router.push('/auth/sign-in?redirectTo=/user-dashboard/players');
        return;
      }
      setUser(session.user);
      await loadPlayers();
      if (mounted) setIsLoading(false);
    };
    checkAuthAndLoadPlayers();

    // Debounce auth change API calls
    let debounceTimer: NodeJS.Timeout | null = null;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          if (event === 'SIGNED_OUT' || !session?.user) {
            router.push('/auth/sign-in?redirectTo=/user-dashboard/players');
          } else if (session?.user) {
            setUser(session.user);
            await loadPlayers();
          }
        }, 200);
      }
    );
    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [router, loadPlayers, getSession]);

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  const getGroup = useCallback((age: number, category: string): string => {
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
  }, []);

  useEffect(() => {
    const ageNum = parseInt(newPlayer.age);
    if (!isNaN(ageNum) && newPlayer.category) {
      const group = getGroup(ageNum, newPlayer.category);
      setNewPlayer((prev) => ({ ...prev, group_name: group }));
    }
  }, [newPlayer.age, newPlayer.category, getGroup]);

  const handleAddPlayer = useCallback(async () => {
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');
    const errorsObj: { [key: string]: string } = {};
    if (!newPlayer.last_name.trim()) errorsObj.last_name = 'Last name is required.';
    if (!newPlayer.first_name.trim()) errorsObj.first_name = 'First name is required.';
    if (!newPlayer.sex.trim()) errorsObj.sex = 'Sex is required.';
    if (!newPlayer.age.trim() || isNaN(Number(newPlayer.age)) || Number(newPlayer.age) <= 0) errorsObj.age = 'Valid age is required.';
    if (!newPlayer.height.trim() || isNaN(Number(newPlayer.height)) || Number(newPlayer.height) <= 0) errorsObj.height = 'Valid height is required.';
    if (!newPlayer.belt.trim()) errorsObj.belt = 'Belt is required.';
    if (!newPlayer.category.trim()) errorsObj.category = 'Category is required.';

    const normalizedLastName = newPlayer.last_name.trim().toLowerCase();
    const normalizedFirstName = newPlayer.first_name.trim().toLowerCase();
    const isDuplicate = players.some((p, idx) => {
      if (editIndex !== null && idx === editIndex) return false;
      return (
        p.last_name.trim().toLowerCase() === normalizedLastName &&
        p.first_name.trim().toLowerCase() === normalizedFirstName
      );
    });
    if (isDuplicate) errorsObj.general = 'This player has already been added.';

    if (Object.keys(errorsObj).length > 0) {
      setErrors(errorsObj);
      setIsSubmitting(false);
      return;
    }

    try {
      const session = await getSession();
      if (!session) {
        setErrors({ general: 'Authentication expired. Please sign in again.' });
        setIsSubmitting(false);
        return;
      }
      const ageNum = parseInt(newPlayer.age);
      const generatedGroup = !isNaN(ageNum) && newPlayer.category ? getGroup(ageNum, newPlayer.category) : '';
      if (!generatedGroup) {
        setErrors({ general: 'Unable to determine group based on age and category. Please check your inputs.' });
        setIsSubmitting(false);
        return;
      }
      const playerData = {
        last_name: newPlayer.last_name.trim(),
        first_name: newPlayer.first_name.trim(),
        middle_name: newPlayer.middle_name.trim(),
        sex: newPlayer.sex.trim(),
        age: newPlayer.age.trim(),
        height: newPlayer.height.trim(),
        belt: newPlayer.belt.trim(),
        category: newPlayer.category.trim(),
        group_name: generatedGroup.trim(),
      };
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      let response;
      let updatedPlayers;
      if (editIndex !== null && players[editIndex]?.id) {
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
      if (!response) throw new Error('No response received from server');
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(''), 5000);
        if (editIndex !== null && players[editIndex]?.id) {
          updatedPlayers = [...players];
          updatedPlayers[editIndex] = { ...updatedPlayers[editIndex], ...playerData };
          setPlayers(updatedPlayers);
        } else {
          setPlayers((prev) => [...prev, { ...playerData, id: data.id }]);
        }
        setNewPlayer(emptyPlayer());
        setIsModalOpen(false);
        setEditIndex(null);
      } else {
        setErrors({ general: data.error || 'Failed to save player. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
    setIsSubmitting(false);
  }, [newPlayer, players, editIndex, getSession, getGroup]);

  const handleDeletePlayer = useCallback((index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  }, []);

  const handleEditPlayer = useCallback((index: number) => {
    setNewPlayer({ ...players[index] });
    setEditIndex(index);
    setIsModalOpen(true);
  }, [players]);

  const confirmDeletePlayer = useCallback(async () => {
    const indexToDelete = deleteIndex;
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
    if (indexToDelete === null) return;
    const player = players[indexToDelete];
    if (!player?.id) return;
    try {
      const session = await getSession();
      if (!session) {
        alert('Authentication expired. Please sign in again.');
        return;
      }
      const response = await fetch(`/api/players?id=${player.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(''), 5000);
        setPlayers((prev) => prev.filter((_, i) => i !== indexToDelete));
      } else {
        alert(data.error || 'Failed to delete player. Please try again.');
      }
    } catch {
      alert('An unexpected error occurred. Please try again.');
    }
  }, [deleteIndex, players, getSession]);

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
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
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
                      className={`transition-transform ${sortColumn === col.key && sortDirection === 'desc' ? 'rotate-180' : ''}`}
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
                    {player[col.key as keyof Player]}
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
                  onClick={confirmDeletePlayer}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Pagination UI (static, for future use) */}
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
}