'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';

type Player = {
  middle_name: string;
  group_name: any;
  first_name: any;
  last_name: any;
  id: string;
  registration_id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  sex: string;
  age: string;
  height: string;
  weight: string;
  belt: string;
  group: string;
  level: string;
  is_kyorugi: boolean;
  is_poomsae: boolean;
  is_poomsae_team: boolean;
  categories: string[];
  team_name: string;
};

type FilterState = {
  sex: string;
  belt: string;
  level: string;
  group: string;
  ageMin: string;
  ageMax: string;
  heightMin: string;
  heightMax: string;
  weightMin: string;
  weightMax: string;
};

export default function PlayersPage() {
  const { competitionId, teamId } = useParams<{ competitionId: string; teamId: string }>();
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<'Kyorugi' | 'Poomsae' | 'Poomsae Team'>('Kyorugi');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    sex: '',
    belt: '',
    level: '',
    group: '',
    ageMin: '',
    ageMax: '',
    heightMin: '',
    heightMax: '',
    weightMin: '',
    weightMax: '',
  });
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const columns = [
    { label: 'First Name', key: 'first_name', width: 'w-[130px]' },
    { label: 'Last Name', key: 'last_name', width: 'w-[120px]' },
    { label: 'Middle Name', key: 'middle_name', width: 'w-[130px]' },
    { label: 'Sex', key: 'sex', width: 'w-[70px]' },
    { label: 'Age', key: 'age', width: 'w-[60px]' },
    { label: 'Height (cm)', key: 'height', width: 'w-[120px]' },
    { label: 'Weight (kg)', key: 'weight', width: 'w-[120px]' },
    { label: 'Belt', key: 'belt', width: 'w-[100px]' },
    { label: 'Level', key: 'level', width: 'w-[90px]' },
    { label: 'Group', key: 'group_name', width: 'w-[170px]' },
  ];

  const tabs = [
    { key: 'Kyorugi', label: 'Kyorugi' },
    { key: 'Poomsae', label: 'Poomsae' },
    { key: 'Poomsae Team', label: 'Poomsae Team' },
  ];

  const categoryOptions = ['Kyorugi', 'Poomsae', 'Poomsae Team'];
  const sexOptions = ['Male', 'Female'];
  const beltOptions = ['White', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Brown', 'Red', 'Red Stripe', 'Black'];
  const levelOptions = ['Novice', 'Advanced'];

  // Kyorugi group options
  const kyorugiGroupOptions = [
    // Grade School (11 years and below)
    'GS GIRLS U7 GROUP 00',
    'GS GIRLS U8 GROUP 0',
    'GS GIRLS U10 GROUP 1',
    'GS GIRLS U11 GROUP 2',
    'GS GIRLS U11 GROUP 3',
    'GS GIRLS U11 GROUP 4',
    'GS GIRLS U11 GROUP 5',
    'GS BOYS U8 GROUP 0',
    'GS BOYS U11 GROUP 1',
    'GS BOYS U11 GROUP 2',
    'GS BOYS U11 GROUP 3',
    'GS BOYS U11 GROUP 4',
    'GS BOYS U11 GROUP 5',
    // Cadet (12 to 14 years old)
    'CADET GIRLS FLY',
    'CADET GIRLS BANTAM',
    'CADET GIRLS FEATHER',
    'CADET GIRLS LIGHT',
    'CADET GIRLS WELTER',
    'CADET GIRLS MIDDLE',
    'CADET BOYS FIN',
    'CADET BOYS FLY',
    'CADET BOYS BANTAM',
    'CADET BOYS FEATHER',
    'CADET BOYS LIGHT',
    'CADET BOYS WELTER',
    'CADET BOYS MIDDLE',
    // Junior (15 to 17 years old)
    'JR WOMEN FIN',
    'JR WOMEN FLY',
    'JR WOMEN BANTAM',
    'JR WOMEN FEATHER',
    'JR WOMEN LIGHT',
    'JR WOMEN WELTER',
    'JR WOMEN MIDDLE',
    'JR MEN FIN',
    'JR MEN FLY',
    'JR MEN BANTAM',
    'JR MEN FEATHER',
    'JR MEN LIGHT',
    'JR MEN WELTER',
    'JR MEN MIDDLE',
    // Senior (18 years old and above)
    'SR WOMEN FIN',
    'SR WOMEN FLY',
    'SR WOMEN BANTAM',
    'SR WOMEN FEATHER',
    'SR WOMEN LIGHT',
    'SR WOMEN WELTER',
    'SR WOMEN MIDDLE',
    'SR MEN FIN',
    'SR MEN FLY',
    'SR MEN BANTAM',
    'SR MEN FEATHER',
    'SR MEN LIGHT',
    'SR MEN WELTER',
    'SR MEN MIDDLE',
  ];

  // Poomsae group options (same for both Poomsae and Poomsae Team)
  const poomsaeGroupOptions = [
    'Toddlers',
    'Group 1',
    'Group 2',
    'Group 3',
    'Group 4'
  ];

  // Complete list of group options (for add player functionality)
  const groupOptions = [...kyorugiGroupOptions, ...poomsaeGroupOptions];

  // Get filtered group options based on active tab
  const getFilterGroupOptions = () => {
    switch (activeTab) {
      case 'Kyorugi':
        return kyorugiGroupOptions;
      case 'Poomsae':
      case 'Poomsae Team':
        return poomsaeGroupOptions;
      default:
        return groupOptions;
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


  // Filter functions
  const handleFilterOpen = () => {
    setTempFilters(filters);
    setIsFilterModalOpen(true);
  };

  const handleFilterApply = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const handleFilterClear = () => {
    const emptyFilters: FilterState = {
      sex: '',
      belt: '',
      level: '',
      group: '',
      ageMin: '',
      ageMax: '',
      heightMin: '',
      heightMax: '',
      weightMin: '',
      weightMax: '',
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setIsFilterModalOpen(false);
  };

  const handleFilterCancel = () => {
    setTempFilters(filters);
    setIsFilterModalOpen(false);
  };

  // Export function to download filtered players as Excel using template
  const handleExportExcel = async () => {
    try {
      // 1. Load the template file
      const templatePath = '/templates/players_template.xlsx';
      const response = await fetch(templatePath);

      if (!response.ok) {
        throw new Error('Template file not found');
      }

      const templateBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(templateBuffer, {
        type: 'buffer',
        cellStyles: true,
        cellNF: true,
        cellHTML: true
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // 2. Add player data to worksheet starting from row 2 (preserving template formatting)
      filteredPlayers.forEach((player, index) => {
        const rowIndex = index + 2; // Start from row 2 (1-indexed)

        // Set cell values while preserving any existing cell properties
        const setCell = (col: string, value: any) => {
          const cellRef = `${col}${rowIndex}`;
          const existingCell = worksheet[cellRef] || {};
          worksheet[cellRef] = {
            ...existingCell,
            v: value,
            t: typeof value === 'number' ? 'n' : 's'
          };
        };

        setCell('A', player.last_name);
        setCell('B', player.first_name);
        setCell('C', player.middle_name || ''); // Handle optional middle name
        setCell('D', player.sex);
        setCell('E', parseInt(player.age));
        setCell('F', parseFloat(player.height));
        setCell('G', parseFloat(player.weight));
        setCell('H', player.belt);
        setCell('I', player.level);
        setCell('J', player.group_name);
        const filteredCategory = player.categories.find(cat => cat === activeTab) || '';
        setCell('K', filteredCategory);
      });

      // 3. Update the worksheet range to include all data
      if (filteredPlayers.length > 0) {
        const lastRow = filteredPlayers.length + 1;
        worksheet['!ref'] = `A1:K${lastRow}`;
      }

      // 4. Generate filename with team name, category, and filters
      const teamName = players[0]?.team_name?.replace(/[^a-zA-Z0-9]/g, '') || 'UnknownTeam';
      const category = activeTab.replace(/\s+/g, '');
      
      // Build filter string from active filters
      const filterParts = [];
      if (filters.sex) filterParts.push(filters.sex);
      if (filters.belt) filterParts.push(filters.belt);
      if (filters.level) filterParts.push(filters.level);
      if (filters.group) filterParts.push(filters.group.replace(/\s+/g, ''));
      if (filters.ageMin || filters.ageMax) {
        const ageRange = `Age${filters.ageMin || '0'}-${filters.ageMax || '99'}`;
        filterParts.push(ageRange);
      }
      if (filters.heightMin || filters.heightMax) {
        const heightRange = `Height${filters.heightMin || '0'}-${filters.heightMax || '999'}`;
        filterParts.push(heightRange);
      }
      if (filters.weightMin || filters.weightMax) {
        const weightRange = `Weight${filters.weightMin || '0'}-${filters.weightMax || '999'}`;
        filterParts.push(weightRange);
      }
      
      const filterString = filterParts.length > 0 ? `_${filterParts.join('_')}` : '';
      const filename = `${teamName}_${category}${filterString}.xlsx`;

      // 5. Download the file with formatting preservation
      XLSX.writeFile(workbook, filename, {
        bookType: 'xlsx',
        cellStyles: true
      });

    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Error exporting Excel file. Please make sure the template exists in /public/templates/players_template.xlsx');
    }
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

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
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  useEffect(() => {
    const fetchPlayers = async () => {
      console.log('Team ID:', teamId);
      setIsLoading(true);
      const { data, error } = await supabase
        .rpc('get_registered_players_by_team', {
          team_uuid: teamId,

        });

      if (error) {
        console.error('Failed to fetch players:', error);
      } else {
        // Optional: add categories for filtering logic
        const formatted = data.map((p: any) => ({
          ...p,
          categories: [
            ...(p.is_kyorugi ? ['Kyorugi'] : []),
            ...(p.is_poomsae ? ['Poomsae'] : []),
            ...(p.is_poomsae_team ? ['Poomsae Team'] : []),
          ],
        }));
        setPlayers(formatted);
      }
      setIsLoading(false);
    };

    if (teamId) {
      fetchPlayers();
    }
  }, [teamId]);

  // Get player count for each tab
  const getPlayerCount = (category: string) => {
    return players.filter(player => {
      // Ensure categories exist and check for match
      return Array.isArray(player.categories) && player.categories.includes(category);
    }).length;
  };


  // Filter players by active tab, search, and filters
  let filteredPlayers = players.filter((player) => {
    const matchesTab = player.categories.includes(activeTab);
    const matchesSearch = Object.values(player).join(' ').toLowerCase().includes(search.toLowerCase());

    // Apply filters
    const age = parseInt(player.age);
    const height = parseFloat(player.height);
    const weight = parseFloat(player.weight);

    const matchesFilters =
      (filters.sex === '' || player.sex === filters.sex) &&
      (filters.belt === '' || player.belt === filters.belt) &&
      (filters.level === '' || player.level === filters.level) &&
      (filters.group === '' || player.group === filters.group) &&
      (filters.ageMin === '' || age >= parseInt(filters.ageMin)) &&
      (filters.ageMax === '' || age <= parseInt(filters.ageMax)) &&
      (filters.heightMin === '' || height >= parseFloat(filters.heightMin)) &&
      (filters.heightMax === '' || height <= parseFloat(filters.heightMax)) &&
      (filters.weightMin === '' || weight >= parseFloat(filters.weightMin)) &&
      (filters.weightMax === '' || weight <= parseFloat(filters.weightMax));

    return matchesTab && matchesSearch && matchesFilters;
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
      {/* Heading */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/admin-panel/competitions/${competitionId}`} className="font-medium group text-md text-[#EAB044] flex items-center">
            <span className="font-bold mr-1 transition-transform duration-200 group-hover:-translate-x-1">←</span>
            <span>Back</span>
          </Link>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-30 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-green-100 border border-green-400 text-green-700 rounded shadow-lg text-m font-regular transition-all duration-300">
            {successMessage}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {players[0]?.team_name ?? 'Loading Team Name...'}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 flex items-center gap-2"
            >
              <Image src="/icons/excel.svg" alt="Excel Icon" width={16} height={16} />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search + Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.2)] rounded-md overflow-x-auto">
        {/* Search Bar */}
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

        {/* Tabs */}
        <div className="border-b border-[rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'Kyorugi' | 'Poomsae' | 'Poomsae Team')}
                  className={`cursor-pointer relative flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                    ? 'border-[#EAB044] text-[#EAB044] bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <span>{tab.label}</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-[#EAB044] rounded-full">
                    {getPlayerCount(tab.key)}
                  </span>
                </button>
              ))}
            </div>
            <div className="pr-4">
              <button
                onClick={handleFilterOpen}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-sm rounded transition-colors ${hasActiveFilters
                  ? 'text-[#EAB044] bg-orange-50 border border-[#EAB044]'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-[#EAB044] rounded-full">
                    {Object.values(filters).filter(v => v !== '').length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`w-full ${filteredPlayers.length > 8 ? 'max-h-[400px] overflow-y-auto' : ''}`}>
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
              ) : filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-gray-500">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-2xl mx-20 border border-[rgba(0,0,0,0.2)] shadow-lg relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Filter Players</h3>
              <button
                className="text-xl font-bold text-gray-600 cursor-pointer"
                onClick={handleFilterCancel}
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Sex Filter */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Sex</label>
                <div className="relative">
                  <select
                    value={tempFilters.sex}
                    onChange={(e) => setTempFilters({ ...tempFilters, sex: e.target.value })}
                    className="w-full border border-[rgba(0,0,0,0.2)] rounded p-2 pr-10 appearance-none"
                  >
                    <option value="">All</option>
                    {sexOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
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

              {/* Belt Filter */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Belt</label>
                <div className="relative">
                  <select
                    value={tempFilters.belt}
                    onChange={(e) => setTempFilters({ ...tempFilters, belt: e.target.value })}
                    className="w-full border border-[rgba(0,0,0,0.2)] rounded p-2 pr-10 appearance-none"
                  >
                    <option value="">All</option>
                    {beltOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
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

              {/* Level Filter */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Level</label>
                <div className="relative">
                  <select
                    value={tempFilters.level}
                    onChange={(e) => setTempFilters({ ...tempFilters, level: e.target.value })}
                    className="w-full border border-[rgba(0,0,0,0.2)] rounded p-2 pr-10 appearance-none"
                  >
                    <option value="">All</option>
                    {levelOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
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

              {/* Group Filter */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Group</label>
                <div className="relative">
                  <select
                    value={tempFilters.group}
                    onChange={(e) => setTempFilters({ ...tempFilters, group: e.target.value })}
                    className="w-full border border-[rgba(0,0,0,0.2)] rounded p-2 pr-10 appearance-none"
                  >
                    <option value="">All</option>
                    {getFilterGroupOptions().map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
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

              {/* Age Range */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Age Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempFilters.ageMin}
                    onChange={(e) => setTempFilters({ ...tempFilters, ageMin: e.target.value })}
                    className="w-1/2 border border-[rgba(0,0,0,0.2)] rounded p-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempFilters.ageMax}
                    onChange={(e) => setTempFilters({ ...tempFilters, ageMax: e.target.value })}
                    className="w-1/2 border border-[rgba(0,0,0,0.2)] rounded p-2"
                  />
                </div>
              </div>

              {/* Height Range */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Height Range (cm)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempFilters.heightMin}
                    onChange={(e) => setTempFilters({ ...tempFilters, heightMin: e.target.value })}
                    className="w-1/2 border border-[rgba(0,0,0,0.2)] rounded p-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempFilters.heightMax}
                    onChange={(e) => setTempFilters({ ...tempFilters, heightMax: e.target.value })}
                    className="w-1/2 border border-[rgba(0,0,0,0.2)] rounded p-2"
                  />
                </div>
              </div>

              {/* Weight Range */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Weight Range (kg)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempFilters.weightMin}
                    onChange={(e) => setTempFilters({ ...tempFilters, weightMin: e.target.value })}
                    className="w-1/2 border border-[rgba(0,0,0,0.2)] rounded p-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempFilters.weightMax}
                    onChange={(e) => setTempFilters({ ...tempFilters, weightMax: e.target.value })}
                    className="w-1/2 border border-[rgba(0,0,0,0.2)] rounded p-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleFilterClear}
                className="cursor-pointer px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleFilterCancel}
                  className="cursor-pointer px-4 py-2 text-sm hover:text-gray-800 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFilterApply}
                  className="cursor-pointer px-4 py-2 text-sm bg-[#EAB044] text-white rounded hover:bg-[#d49a35] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
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

  function selectField({ label, value, onChange, required = false, options = [], isOpen, setIsOpen }: any) {
    return (
      <div className="relative">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            className="cursor-pointer w-full border border-[rgba(0,0,0,0.2)] rounded p-2 pr-10 appearance-none text-gray-700"
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
      </div>
    );
  }
}