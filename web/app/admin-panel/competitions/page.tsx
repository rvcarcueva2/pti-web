'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Competition = {
  uuid: string;
  title: string;
  date: string;
  description: string;
  location: string;
  deadline: string;
  photo_url?: string;
  players: number;
  teams: number;
  kyorugi: number;
  poomsae: number;
  poomsae_team: number;
};

export default function CompetitionPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState<'add' | 'update' | 'delete'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [existingPosterUrl, setExistingPosterUrl] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number } | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  // Add sample data on component mount
  useEffect(() => {
    const sampleCompetitions: Competition[] = [
      {
        uuid: '1',
        title: 'National Taekwondo Championship 2025',
        date: '2025-09-15',
        description: 'Annual national championship featuring the best taekwondo athletes from across the country. Categories include Kyorugi, Poomsae, and Poomsae Team for all age groups.',
        location: 'Manila Sports Complex, Manila',
        deadline: '2025-08-15',
        photo_url: '/images/competition1.jpg',
        players: 280,
        teams: 18,
        kyorugi: 145,
        poomsae: 100,
        poomsae_team: 35,
      },
      {
        uuid: '2',
        title: 'Regional Kyorugi Tournament',
        date: '2025-08-20',
        description: 'Regional competition focusing on sparring techniques and combat skills. Open to all belt levels.',
        location: 'Cebu City Sports Center, Cebu',
        deadline: '2025-07-20',
        photo_url: '/images/competition2.jpg',
        players: 180,
        teams: 8,
        kyorugi: 180,
        poomsae: 0,
        poomsae_team: 0,
      },
      {
        uuid: '3',
        title: 'Intercollegiate Poomsae Event',
        date: '2025-10-05',
        description: 'University-level poomsae competition showcasing technical forms and artistic expression.',
        location: 'University of the Philippines, Diliman',
        deadline: '2025-09-05',
        photo_url: '/images/competition3.jpg',
        players: 125,
        teams: 16,
        kyorugi: 0,
        poomsae: 95,
        poomsae_team: 30,
      },
      {
        uuid: '4',
        title: 'Youth Development Cup',
        date: '2025-11-12',
        description: 'Competition designed for young athletes aged 8-17. Focus on skill development and sportsmanship.',
        location: 'Makati Sports Club, Makati',
        deadline: '2025-10-12',
        photo_url: '/images/competition4.jpg',
        players: 145,
        teams: 9,
        kyorugi: 70,
        poomsae: 50,
        poomsae_team: 25,
      },
      {
        uuid: '5',
        title: 'Masters International Open',
        date: '2025-12-08',
        description: 'International tournament for senior practitioners (35+). Categories for both recreational and competitive divisions.',
        location: 'World Trade Center, Pasay',
        deadline: '2025-11-08',
        photo_url: '/images/competition5.jpg',
        players: 105,
        teams: 6,
        kyorugi: 45,
        poomsae: 40,
        poomsae_team: 20,
      },
      {
        uuid: '6',
        title: 'Provincial Championships - Luzon',
        date: '2025-08-30',
        description: 'Provincial level championship for Luzon region. Qualifier for national competitions.',
        location: 'Baguio Convention Center, Baguio',
        deadline: '2025-07-30',
        photo_url: '/images/competition6.jpg',
        players: 235,
        teams: 14,
        kyorugi: 120,
        poomsae: 80,
        poomsae_team: 35,
      },
      {
        uuid: '7',
        title: 'Team Poomsae Showcase',
        date: '2025-09-25',
        description: 'Specialized competition focusing on synchronized team poomsae performances.',
        location: 'SM Mall of Asia Arena, Pasay',
        deadline: '2025-08-25',
        photo_url: '/images/competition7.jpg',
        players: 180,
        teams: 30,
        kyorugi: 0,
        poomsae: 60,
        poomsae_team: 120,
      },
      {
        uuid: '8',
        title: 'Beginner Friendly Tournament',
        date: '2025-10-18',
        description: 'Entry-level competition for white to green belt practitioners. Emphasis on learning and participation.',
        location: 'Quezon City Sports Complex, Quezon City',
        deadline: '2025-09-18',
        photo_url: '/images/competition8.jpg',
        players: 90,
        teams: 5,
        kyorugi: 40,
        poomsae: 35,
        poomsae_team: 15,
      },
    ];
    
    setCompetitions(sampleCompetitions);
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredCompetitions = competitions.filter((comp) =>
    Object.values(comp).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  if (sortColumn) {
    filteredCompetitions.sort((a, b) => {
      const valueA = a[sortColumn as keyof Competition];
      const valueB = b[sortColumn as keyof Competition];
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return sortDirection === 'asc'
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    });
  }

  const posterPreview = useMemo(() => {
    if (posterFile) {
      const url = URL.createObjectURL(posterFile);
      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        setPreviewSize({ width: img.width, height: img.height });
      };
      return url;
    }
    if (editIndex !== null && existingPosterUrl) {
      const img = new window.Image();
      img.src = existingPosterUrl;
      img.onload = () => {
        setPreviewSize({ width: img.width, height: img.height });
      };
      return existingPosterUrl;
    }
    return null;
  }, [posterFile, editIndex, existingPosterUrl]);

  const columns = [
    { label: 'Competition', key: 'title', minWidth: 'min-w-[300px]' },
    { label: 'Players', key: 'players', minWidth: 'min-w-[100px]' },
    { label: 'Teams', key: 'teams', minWidth: 'min-w-[100px]' },
    { label: 'Kyorugi', key: 'kyorugi', minWidth: 'min-w-[100px]' },
    { label: 'Poomsae', key: 'poomsae', minWidth: 'min-w-[100px]' },
    { label: 'Poomsae Team', key: 'poomsae_team', minWidth: 'min-w-[120px]' },
  ];

  const handleSort = (column: keyof Competition) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = 'Title is required';
    if (!date) newErrors.date = 'Date is required';
    if (!location) newErrors.location = 'Location is required';
    if (!deadline) newErrors.deadline = 'Deadline is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const newData: Competition = {
      uuid: editIndex !== null ? competitions[editIndex].uuid : crypto.randomUUID(),
      title,
      date,
      description,
      location,
      deadline,
      photo_url: posterPreview || '',
      players: Math.floor(Math.random() * 50),
      teams: Math.floor(Math.random() * 10),
      kyorugi: Math.floor(Math.random() * 30),
      poomsae: Math.floor(Math.random() * 20),
      poomsae_team: Math.floor(Math.random() * 15),
    };

    if (editIndex !== null) {
      const updated = [...competitions];
      updated[editIndex] = newData;
      setCompetitions(updated);
      setSuccessMessage('Competition updated successfully!');
      setSuccessType('update');
    } else {
      setCompetitions([...competitions, newData]);
      setSuccessMessage('Competition added successfully!');
      setSuccessType('add');
    }

    closeModal();
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setDescription('');
    setLocation('');
    setDeadline('');
    setPosterFile(null);
    setExistingPosterUrl(null);
    setPreviewSize(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setErrors({});
    setSuccessMessage('');
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    const comp = competitions[index];
    setEditIndex(index);
    setTitle(comp.title);
    setDate(comp.date);
    setDescription(comp.description);
    setLocation(comp.location);
    setDeadline(comp.deadline);
    setExistingPosterUrl(comp.photo_url || null);
    openModal();
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const updated = [...competitions];
    updated.splice(deleteIndex, 1);
    setCompetitions(updated);
    setDeleteIndex(null);
    setIsDeleteModalOpen(false);
    setSuccessMessage('Competition deleted successfully!');
    setSuccessType('delete');
  };

  const handleRowClick = (uuid: string) => {
    router.push(`/admin-panel/competitions/competition`);
  };

  return (
    <div className="font-geist p-6 ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Competitions</h1>
        <button onClick={openModal} className="cursor-pointer bg-[#EAB044] text-white px-4 py-2 rounded-md text-sm hover:bg-[#d49a35]">
          <span>Add Competition</span>
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 border rounded shadow-lg text-m font-regular transition-all duration-300 ${
          successType === 'add' ? 'bg-green-100 border-green-400 text-green-700' :
          successType === 'update' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
          'bg-red-100 border-red-400 text-red-700'
        }`}>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#EAB044]"
            />
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <Image src="/icons/search.svg" alt="Search Icon" width={16} height={16} />
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-orange-50 border-b border-[rgba(0,0,0,0.2)]">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(col.key as keyof Competition)}
                  className={`p-3 text-left text-gray-700 font-medium cursor-pointer ${col.minWidth}`}
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
              <th className="p-3 text-left w-[150px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetitions.map((comp, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(comp.uuid)}
                className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 cursor-pointer ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="p-3">{comp.title}</td>
                <td className="p-3">{comp.players}</td>
                <td className="p-3">{comp.teams}</td>
                <td className="p-3">{comp.kyorugi}</td>
                <td className="p-3">{comp.poomsae}</td>
                <td className="p-3">{comp.poomsae_team}</td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleEdit(index)} className="cursor-pointer text-[#EAB044] hover:underline flex items-center gap-1">
                      <Image src="/icons/edit.svg" alt="Edit" width={14} height={14} />
                      Edit
                    </button>
                    <button onClick={() => handleDelete(index)} className="cursor-pointer text-red-500 hover:underline flex items-center gap-1">
                      <Image src="/icons/delete.svg" alt="Delete" width={14} height={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-4xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Poster Upload Column */}
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-full borde flex items-center justify-center overflow-auto max-w-full"

                  >
                    {posterPreview ? (
                      <img
                        src={posterPreview}
                        alt="Poster"
                        className="object-contain"
                        style={{ maxWidth: '100%', maxHeight: '24rem' }}
                      />
                    ) : (
                      <p className="text-sm text-gray-500 text-center p-4">No Poster</p>
                    )}
                  </div>
                  <label className="block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Poster image must be 5MB or smaller.');
                            return;
                          }
                          setPosterFile(file);
                        }
                      }}

                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <div className="bg-black text-white w-full py-2 rounded text-center cursor-pointer hover:bg-gray-800 flex items-center justify-center gap-2">
                      <img src="/icons/upload-file.svg" alt="Upload" className="w-4 h-4" />
                      <span className="text-sm font-normal">Upload Poster</span>
                    </div>
                  </label>
                </div>

                {/* Form Fields Column (spans 2 columns) */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                  </div>
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]} // today
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                    {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      min={new Date().toISOString().split('T')[0]} // today
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                    {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline}</p>}
                  </div>

                  {/* Location */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 resize-y min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#EAB044] text-white rounded hover:bg-[#d49a35] cursor-pointer"
                >
                  {isSubmitting ? (editIndex !== null ? 'Updating...' : 'Adding...') : editIndex !== null ? 'Update' : '+ Add'}
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
            <p className="mb-6 text-gray-700">Are you sure you want to <span className="font-bold text-red-600">DELETE</span> this competition? This action cannot be undone.</p>
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
}