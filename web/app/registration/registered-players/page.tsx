'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

type Player = {
  id?: string;
  registration_id?: string;
  first_name: string;
  last_name: string;
  middle_name: string;
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
  group_name: string;
  level: string;
  is_kyorugi: boolean;
  is_poomsae: boolean;
  is_poomsae_team: boolean;
};

export default function PlayersPage() {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<'Kyorugi' | 'Poomsae' | 'Poomsae Team'>('Kyorugi');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const columns = [
    { label: 'Last Name', key: 'last_name', width: 'w-[120px]' },
    { label: 'First Name', key: 'first_name', width: 'w-[130px]' },
    { label: 'Middle Name', key: 'middle_name', width: 'w-[130px]' },
    { label: 'Sex', key: 'sex', width: 'w-[70px]' },
    { label: 'Age', key: 'age', width: 'w-[60px]' },
    { label: 'Height (cm)', key: 'height', width: 'w-[120px]' },
    { label: 'Weight (kg)', key: 'weight', width: 'w-[120px]' },
    { label: 'Belt', key: 'belt', width: 'w-[100px]' },
    { label: 'Level', key: 'level', width: 'w-[90px]' },
    { label: 'Group', key: 'group_name', width: 'w-[250px]' },
  ];

  const tabs = [
    { key: 'Kyorugi', label: 'Kyorugi' },
    { key: 'Poomsae', label: 'Poomsae' },
    { key: 'Poomsae Team', label: 'Poomsae Team' },
  ];

  const categoryOptions = ['Kyorugi', 'Poomsae', 'Poomsae Team'];

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
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

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          setError('Please sign in to view players');
          router.push('/auth/sign-in?redirectTo=/registration/players');
          return;
        }

        // Get access token for API call
        const accessToken = session.access_token;

        // Fetch players from API
        const response = await fetch('/api/registered-players', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch players');
        }

        const data = await response.json();

        // Transform database data to match component expectations
        const transformedPlayers = data.map((dbPlayer: any) => {
          const categories = [];
          if (dbPlayer.is_kyorugi) categories.push('Kyorugi');
          if (dbPlayer.is_poomsae) categories.push('Poomsae');
          if (dbPlayer.is_poomsae_team) categories.push('Poomsae Team');

          return {
            id: dbPlayer.id,
            registration_id: dbPlayer.registration_id,
            first_name: dbPlayer.first_name || '',
            last_name: dbPlayer.last_name || '',
            middle_name: dbPlayer.middle_name || '',
            lastName: dbPlayer.last_name || '',
            firstName: dbPlayer.first_name || '',
            middleName: dbPlayer.middle_name || '',
            sex: dbPlayer.sex || '',
            age: dbPlayer.age?.toString() || '',
            height: dbPlayer.height?.toString() || '',
            weight: dbPlayer.weight?.toString() || '',
            belt: dbPlayer.belt || '',
            categories: categories,
            group: dbPlayer.group_name || '',
            group_name: dbPlayer.group_name || '',
            level: dbPlayer.level || '',
            is_kyorugi: dbPlayer.is_kyorugi || false,
            is_poomsae: dbPlayer.is_poomsae || false,
            is_poomsae_team: dbPlayer.is_poomsae_team || false,
          };
        });

        setPlayers(transformedPlayers);
      } catch (error) {
        console.error('Error fetching players:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch players');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [router]);

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

  return (
    <div className="font-geist px-6 py-3 lg:p-6 lg:ml-10 lg:mr-10 min-h-screen">
      {/* Header */}
      <div className="md:mt-40 mt-25 flex justify-between items-start">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">Registered Players</h1>
        </div>
      </div>

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="mb-4 lg:mb-2 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
        <div>
          <p className="text-gray-400 text-sm lg:text-base mb-3 md:mb-1">
            View your registered players by category.
          </p>
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
              disabled={isLoading}
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
                disabled={isLoading}
              >
                <span>{tab.label}</span>
                <span className="inline-flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 text-xs font-semibold text-white bg-[#EAB044] rounded-full">
                  {getPlayerCount(tab.key)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={`w-full ${filteredPlayers.length >= 7 ? 'max-h-[310px] overflow-y-auto' : ''}`}>
          {/* Mobile Table View */}
          <div className="lg:hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading players...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">Error: {error}</div>
            ) : filteredPlayers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {search.trim() ? `No players found matching "${search}" in ${activeTab} category.` : `No players found in ${activeTab} category.`}
              </div>
            ) : (
              <div>
                <table className="w-full text-xs">
                  <thead className="bg-orange-50 border-b border-[rgba(0,0,0,0.2)] sticky top-0 z-10">
                    <tr>
                      <th className="p-2 text-left text-gray-700 font-medium w-[35%]">Name</th>
                      <th className="p-2 text-left text-gray-700 font-medium w-[20%]">Belt</th>
                      <th className="p-2 text-left text-gray-700 font-medium w-[45%]">Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player, index) => (
                      <tr key={player.id || `player-${index}`} className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-2 w-[35%]">
                          <div className="text-xs font-medium text-gray-900 leading-tight break-words">
                            {player.first_name} {player.last_name}
                          </div>
                        </td>
                        <td className="p-2 text-xs w-[20%]">
                          <div className="break-words text-xs leading-tight">
                            {player.belt}
                          </div>
                        </td>
                        <td className="p-2 text-xs w-[45%]">
                          <div className="break-words text-xs leading-tight">
                            {player.group_name}
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
              <thead className="bg-orange-50 border-b border-[rgba(0,0,0,0.2)] sticky top-0 z-10">
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
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                      Loading players...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={columns.length} className="p-8 text-center text-red-600">
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                      {search.trim() ? `No players found matching "${search}" in ${activeTab} category.` : `No players found in ${activeTab} category.`}
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player, index) => (
                    <tr key={player.id || `player-${index}`} className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}>
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
      </div>
    </div>
  );
}