'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

type Player = {
  id?: string;
  lastName: string;
  firstName: string;
  middleName: string | null;
  sex: string | null;
  age: string;
  height: string;
  belt: string | null;
  category: string | null;
  group: string | null;
};

export default function CompetitionPage() {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Player>(emptyPlayer());
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const columns = [
    { label: 'Last Name', key: 'lastName', width: 'w-[130px]' },
    { label: 'First Name', key: 'firstName', width: 'w-[130px]' },
    { label: 'Middle Name', key: 'middleName', width: 'w-[130px]' },
    { label: 'Sex', key: 'sex', width: 'w-[70px]' },
    { label: 'Age', key: 'age', width: 'w-[60px]' },
    { label: 'Height (cm)', key: 'height', width: 'w-[120px]' },
    { label: 'Belt', key: 'belt', width: 'w-[130px]' },
    { label: 'Category', key: 'category', width: 'w-[100px]' },
    { label: 'Group', key: 'group', width: 'w-[100px]' },
  ];

  function emptyPlayer(): Player {
    return {
      lastName: '',
      firstName: '',
      middleName: '',
      sex: '',
      age: '',
      height: '',
      belt: '',
      category: '',
      group: '',
    };
  }

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

  const fetchPlayers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('registered_players')
      .select('*');

    if (error) {
      console.error('Error fetching players:', error.message);
    } else {
      const transformed = data.map((p) => ({
        id: p.id,
        lastName: p.last_name,
        firstName: p.first_name,
        middleName: p.middle_name,
        sex: p.sex,
        age: p.age?.toString() || '',
        height: p.height?.toString() || '',
        belt: p.belt,
        category: p.category,
        group: p.group_name,
      }));
      setPlayers(transformed);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    const ageNum = parseInt(newPlayer.age);
    if (!isNaN(ageNum) && newPlayer.category) {
      const group = getGroup(ageNum, newPlayer.category);
      setNewPlayer((prev) => ({ ...prev, group }));
    }
  }, [newPlayer.age, newPlayer.category]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleEditPlayer = (index: number) => {
    setNewPlayer(players[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

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

  return (
    <div className="font-geist p-6 ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Registered Players</h1>

      </div>

      <div className="mb-2">
        <p className="text-gray-400">
          Note: Be advised that your registration is still pending, please contact <span className='text-gray-500'>(+63) 905 815 5032</span> or send us an email at{' '}
          <a href="mailto:pilipinastaekwondo@gmail.com" className="text-gray-500 underline">
            pilipinastaekwondo@gmail.com
          </a>{' '}
          for approval.
        </p>
      </div>

      {/* Search + Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.2)] rounded-md overflow-x-auto">
        <div className="flex justify-between items-center p-4 border-b border-[rgba(0,0,0,0.2)]">
          <h3 className="text-lg text-gray-800"></h3>
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
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#EAB044] mx-auto mb-2" />
                  <p>Loading players...</p>
                </td>
              </tr>
            ) : players.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center text-gray-500 py-6">
                  No players registered.
                </td>
              </tr>
            ) : filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center text-gray-500 py-6">
                  No results found.
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player, index) => (
                <tr key={index} className="border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="p-3">
                      {player[col.key as keyof typeof player]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
