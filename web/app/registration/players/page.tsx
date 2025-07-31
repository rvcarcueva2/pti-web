'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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

    const isValid = requiredFields.every((field) => newPlayer[field as keyof Player]?.toString().trim() !== '');
    
    if (!isValid || newPlayer.categories.length === 0) {
      const missingWeight = isKyorugiSelected && !newPlayer.weight.trim();
      const message = missingWeight 
        ? 'Please fill out all required fields. Weight is required for Kyorugi category.'
        : 'Please fill out all required fields and select at least one category.';
      alert(message);
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
        if (age <= 7  && height <= 112)                    return 'GS GIRLS U7 GROUP 00';
        if (age <= 8  && height > 112 && height <= 120)    return 'GS GIRLS U8 GROUP 0';
        if (age <= 10  && height > 120 && height <= 128)    return 'GS GIRLS U10 GROUP 1';
        if (age <= 11 && height > 128 && height <= 136)    return 'GS GIRLS U11 GROUP 2';
        if (age <= 11 && height > 136 && height <= 144)    return 'GS GIRLS U11 GROUP 3';
        if (age <= 11 && height > 144 && height <= 152)    return 'GS GIRLS U11 GROUP 4';
        if (age <= 11 && height > 152 && height <= 160)    return 'GS GIRLS U11 GROUP 5';
      } else {
        if (age <= 7  && height <= 120)                    return 'GS BOYS U8 GROUP 0';
        if (age <= 11 && height > 120 && height <= 128)    return 'GS BOYS U11 GROUP 1';
        if (age <= 11 && height > 128 && height <= 136)    return 'GS BOYS U11 GROUP 2';
        if (age <= 11 && height > 136 && height <= 144)    return 'GS BOYS U11 GROUP 3';
        if (age <= 11 && height > 144 && height <= 152)    return 'GS BOYS U11 GROUP 4';
        if (age <= 11 && height > 152 && height <= 160)    return 'GS BOYS U11 GROUP 5';
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

  useEffect(() => {
    const samplePlayers = [
      // Kyorugi players (10)
      {
        lastName: 'Mones',
        firstName: 'Hazel Ann',
        middleName: 'Besañez',
        sex: 'Female',
        age: '21',
        height: '153',
        weight: '50',
        belt: 'Yellow',
        categories: ['Kyorugi'],
        group: 'SR WOMEN BANTAM',
        level: 'Novice',
      },
      {
        lastName: 'Garcia',
        firstName: 'Miguel',
        middleName: 'Santos',
        sex: 'Male',
        age: '19',
        height: '175',
        weight: '68',
        belt: 'Blue',
        categories: ['Kyorugi'],
        group: 'SR MEN FEATHER',
        level: 'Novice',
      },
      {
        lastName: 'Rodriguez',
        firstName: 'Ana',
        middleName: 'Luna',
        sex: 'Female',
        age: '16',
        height: '158',
        weight: '55',
        belt: 'Green',
        categories: ['Kyorugi'],
        group: 'JR WOMEN LIGHT',
        level: 'Novice',
      },
      {
        lastName: 'Kim',
        firstName: 'David',
        middleName: 'Lee',
        sex: 'Male',
        age: '13',
        height: '145',
        weight: '38',
        belt: 'Orange',
        categories: ['Kyorugi'],
        group: 'CADET BOYS FLY',
        level: 'Novice',
      },
      {
        lastName: 'Johnson',
        firstName: 'Sarah',
        middleName: 'Marie',
        sex: 'Female',
        age: '14',
        height: '152',
        weight: '43',
        belt: 'Purple',
        categories: ['Kyorugi'],
        group: 'CADET GIRLS LIGHT',
        level: 'Advanced',
      },
      {
        lastName: 'Chen',
        firstName: 'Wei',
        middleName: 'Lin',
        sex: 'Male',
        age: '22',
        height: '168',
        weight: '62',
        belt: 'Black',
        categories: ['Kyorugi'],
        group: 'SR MEN BANTAM',
        level: 'Advanced',
      },
      {
        lastName: 'Martinez',
        firstName: 'Isabella',
        middleName: 'Rose',
        sex: 'Female',
        age: '17',
        height: '165',
        weight: '58',
        belt: 'Brown',
        categories: ['Kyorugi'],
        group: 'JR WOMEN WELTER',
        level: 'Advanced',
      },
      {
        lastName: 'Wilson',
        firstName: 'James',
        middleName: 'Robert',
        sex: 'Male',
        age: '15',
        height: '172',
        weight: '60',
        belt: 'Blue',
        categories: ['Kyorugi'],
        group: 'JR MEN LIGHT',
        level: 'Novice',
      },
      {
        lastName: 'Taylor',
        firstName: 'Emma',
        middleName: 'Grace',
        sex: 'Female',
        age: '12',
        height: '140',
        weight: '35',
        belt: 'Yellow',
        categories: ['Kyorugi'],
        group: 'CADET GIRLS BANTAM',
        level: 'Novice',
      },
      {
        lastName: 'Brown',
        firstName: 'Alex',
        middleName: 'Jordan',
        sex: 'Male',
        age: '20',
        height: '180',
        weight: '75',
        belt: 'Red',
        categories: ['Kyorugi'],
        group: 'SR MEN LIGHT',
        level: 'Advanced',
      },
      
      // Poomsae players (5)
      {
        lastName: 'Carcueva',
        firstName: 'Reycel John Emmanuel',
        middleName: 'Vejano',
        sex: 'Male',
        age: '21',
        height: '165',
        weight: '55',
        belt: 'White',
        categories: ['Poomsae'],
        group: 'Group 4',
        level: 'Novice',
      },
      {
        lastName: 'Thompson',
        firstName: 'Jessica',
        middleName: 'Claire',
        sex: 'Female',
        age: '16',
        height: '160',
        weight: '52',
        belt: 'Green',
        categories: ['Poomsae'],
        group: 'Group 3',
        level: 'Novice',
      },
      {
        lastName: 'Lee',
        firstName: 'Kevin',
        middleName: 'Min',
        sex: 'Male',
        age: '12',
        height: '150',
        weight: '40',
        belt: 'Blue',
        categories: ['Poomsae'],
        group: 'Group 2',
        level: 'Novice',
      },
      {
        lastName: 'Anderson',
        firstName: 'Sophie',
        middleName: 'Ann',
        sex: 'Female',
        age: '8',
        height: '125',
        weight: '28',
        belt: 'Orange',
        categories: ['Poomsae'],
        group: 'Group 1',
        level: 'Novice',
      },
      {
        lastName: 'Davis',
        firstName: 'Michael',
        middleName: 'Paul',
        sex: 'Male',
        age: '18',
        height: '170',
        weight: '65',
        belt: 'Black',
        categories: ['Poomsae'],
        group: 'Group 4',
        level: 'Advanced',
      },

      // Poomsae Team players (5)
      {
        lastName: 'Santos',
        firstName: 'Maria',
        middleName: 'Cruz',
        sex: 'Female',
        age: '19',
        height: '160',
        weight: '48',
        belt: 'Blue',
        categories: ['Poomsae Team'],
        group: 'Group 4',
        level: 'Novice',
      },
      {
        lastName: 'White',
        firstName: 'Ryan',
        middleName: 'Thomas',
        sex: 'Male',
        age: '17',
        height: '175',
        weight: '60',
        belt: 'Purple',
        categories: ['Poomsae Team'],
        group: 'Group 3',
        level: 'Advanced',
      },
      {
        lastName: 'Miller',
        firstName: 'Rachel',
        middleName: 'Nicole',
        sex: 'Female',
        age: '15',
        height: '155',
        weight: '45',
        belt: 'Brown',
        categories: ['Poomsae Team'],
        group: 'Group 3',
        level: 'Advanced',
      },
      {
        lastName: 'Harris',
        firstName: 'Daniel',
        middleName: 'Scott',
        sex: 'Male',
        age: '13',
        height: '160',
        weight: '32',
        belt: 'Yellow',
        categories: ['Poomsae Team'],
        group: 'Group 1',
        level: 'Novice',
      },
            {
        lastName: 'Maximoff',
        firstName: 'Wanda',
        middleName: '',
        sex: 'Female',
        age: '13',
        height: '160',
        weight: '32',
        belt: 'Yellow',
        categories: ['Poomsae Team'],
        group: 'Group 1',
        level: 'Novice',
      },
    ];
    
    setPlayers(samplePlayers);
  }, []);

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
    <div className="font-geist p-6 ml-10 mr-10 mt-30">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Competition Name</h1>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`fixed top-30 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 border rounded shadow-lg text-m font-regular transition-all duration-300 ${
          successType === 'add' ? 'bg-green-100 border-green-400 text-green-700' :
          successType === 'update' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
          'bg-red-100 border-red-400 text-red-700'
        }`}>
          {successMessage}
        </div>
      )}

      <div className="mb-2 flex justify-between items-center">
        <p className="text-gray-400">
          Note: Add players to their respective categories.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setNewPlayer(emptyPlayer());
              setEditIndex(null);
              setIsCategoryDropdownOpen(false); // Reset dropdown state
              setIsSexDropdownOpen(false); // Reset sex dropdown
              setIsBeltDropdownOpen(false); // Reset belt dropdown
              setIsModalOpen(true);
            }}
            className="cursor-pointer bg-[#EAB044] text-white px-4 py-2 rounded-md text-sm hover:bg-[#d49a35]"
          >
            Add Player
          </button>
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
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'Kyorugi' | 'Poomsae' | 'Poomsae Team')}
                className={`cursor-pointer relative flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
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
        </div>

        {/* Table */}
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
                      className={`transition-transform ${
                        sortColumn === col.key && sortDirection === 'desc' ? 'rotate-180' : ''
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
                <tr key={index} className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full mx-20 border border-[rgba(0,0,0,0.2)] shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-xl font-bold text-gray-600 cursor-pointer"
              onClick={() => {
                setIsModalOpen(false);
                setEditIndex(null);
                setIsCategoryDropdownOpen(false);
                setIsSexDropdownOpen(false); // Reset sex dropdown
                setIsBeltDropdownOpen(false); // Reset belt dropdown
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  onChange: () => {},
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
                  onChange: () => {},
                  disabled: true,
                })}
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" className="bg-[#EAB044] cursor-pointer text-white px-6 py-2 rounded-md text-sm hover:bg-[#d49a35]">
                  {editIndex !== null ? 'Save' : '+ Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
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
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Confirm
              </button>
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

  function checklistDropdownField({ label, selectedValues, options, onChange, required = false, isOpen, setIsOpen }: any) {
    const displayValue = selectedValues.length === 0 
      ? 'Select category' 
      : selectedValues.join(', ');

    return (
      <div className="relative">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`cursor-pointer w-full rounded p-2 pr-10 bg-white text-gray-700 flex items-center justify-between transition-colors ${
              isOpen 
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
                      onChange={(e) => onChange(option, e.target.checked)}
                      className="rounded border-gray-300 text-[#EAB044] focus:ring-[#EAB044]"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}