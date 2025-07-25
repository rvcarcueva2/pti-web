'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Updated Competition type
type Competition = {
  id: number;
  title: string;
  date: string;
  description: string;
  location: string;
  deadline: string;
  players: number;
  teams: number;
  kyorugi: number;
  poomsae: number;
};

export default function CompetitionPage() {
  const router = useRouter();

  // State from players page
  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: 1,
      title: 'National Championship',
      date: '2025-08-15',
      description: 'The biggest national event of the year.',
      location: 'Manila',
      deadline: '2025-07-15',
      players: 120,
      teams: 30,
      kyorugi: 75,
      poomsae: 45,
    },
    {
      id: 2,
      title: 'Regional Open',
      date: '2025-09-20',
      description: 'An open tournament for all regions.',
      location: 'Cebu',
      deadline: '2025-08-20',
      players: 85,
      teams: 22,
      kyorugi: 50,
      poomsae: 35,
    },
    {
      id: 3,
      title: 'Summer Invitational',
      date: '2025-05-10',
      description: 'An invitational event to kick off the summer.',
      location: 'Davao',
      deadline: '2025-04-10',
      players: 60,
      teams: 15,
      kyorugi: 40,
      poomsae: 20,
    },
  ]);

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');

  // Columns updated to use 'title'
  const columns = [
    { label: 'Competition', key: 'title', minWidth: 'min-w-[300px]' },
    { label: 'Players', key: 'players', minWidth: 'min-w-[100px]' },
    { label: 'Teams', key: 'teams', minWidth: 'min-w-[100px]' },
    { label: 'Kyorugi', key: 'kyorugi', minWidth: 'min-w-[100px]' },
    { label: 'Poomsae', key: 'poomsae', minWidth: 'min-w-[100px]' },
  ];

  const handleSort = (column: keyof Competition) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setDescription('');
    setLocation('');
    setDeadline('');
  };

  const openModal = () => {
    setIsModalOpen(true);
    setErrors({});
    setSuccessMessage('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
    setSuccessMessage('');
    setEditIndex(null);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    const originalIndex = competitions.findIndex(c => c.id === filteredCompetitions[index].id);
    const comp = competitions[originalIndex];
    if (comp) {
      setTitle(comp.title);
      setDate(comp.date);
      setDescription(comp.description);
      setLocation(comp.location);
      setDeadline(comp.deadline);
    }
    openModal();
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

    const newCompetitionData = {
      title,
      date,
      description,
      location,
      deadline,
    };

    if (editIndex !== null) {
      // Update existing competition
      const updatedCompetitions = [...competitions];
      const originalIndex = competitions.findIndex(c => c.id === filteredCompetitions[editIndex].id);
      const existingComp = updatedCompetitions[originalIndex];
      updatedCompetitions[originalIndex] = { ...existingComp, ...newCompetitionData };
      setCompetitions(updatedCompetitions);
      setSuccessMessage('Competition updated successfully!');
    } else {
      // Add new competition
      const newId = competitions.length > 0 ? Math.max(...competitions.map(c => c.id)) + 1 : 1;
      setCompetitions([...competitions, {
        id: newId,
        ...newCompetitionData,
        players: 0, // Default values for new competitions
        teams: 0,
        kyorugi: 0,
        poomsae: 0,
      }]);
      setSuccessMessage('Competition added successfully!');
    }

    setIsSubmitting(false);
    closeModal();
  };

  const handleDelete = (index: number) => {
    const originalIndex = competitions.findIndex(c => c.id === filteredCompetitions[index].id);
    setDeleteIndex(originalIndex);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedCompetitions = competitions.filter((_, i) => i !== deleteIndex);
      setCompetitions(updatedCompetitions);
      setDeleteIndex(null);
      setIsDeleteModalOpen(false);
      setSuccessMessage('Competition deleted successfully!');
    }
  };

  let filteredCompetitions = competitions.filter((comp) =>
    Object.values(comp)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
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

  return (
    <div className="font-geist p-6 ml-64">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Competitions</h1>
        <div className="flex gap-2">
          <button className="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm flex items-center gap-2">
            <Image src="/icons/excel.svg" alt="Excel Icon" width={16} height={16} />
            <span>Export Excel</span>
          </button>
          <button onClick={openModal} className="cursor-pointer bg-[#EAB044] text-white px-4 py-2 rounded-md text-sm hover:bg-[#d49a35]">
            <span>Add Competition</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 px-4 py-2 text-green-700 bg-green-100 border border-green-300 rounded-md">
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

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-[rgba(0,0,0,0.2)]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`p-3 text-left text-gray-700 font-medium cursor-pointer ${column.minWidth}`}
                  onClick={() => handleSort(column.key as keyof Competition)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    <Image
                      src="/icons/down-arrow.svg"
                      alt="Sort"
                      width={10}
                      height={10}
                      className={`transition-transform ${sortColumn === column.key && sortDirection === 'desc' ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </th>
              ))}

            </tr>
          </thead>
          <tbody>
            {filteredCompetitions.map((comp, index) => (
              <tr key={comp.id} className="border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50">
                <td className="p-3 min-w-[300px]">{comp.title}</td>
                <td className="p-3">{comp.players}</td>
                <td className="p-3">{comp.teams}</td>
                <td className="p-3">{comp.kyorugi}</td>
                <td className="p-3">{comp.poomsae}</td>
                <td className="p-3 text-left">
                  <div className="flex items-center gap-5 -ml-8">
                    <button
                      onClick={() => handleEdit(index)}
                      className="cursor-pointer flex items-center gap-1 hover:underline text-sm text-[#EAB044]"
                    >
                      <Image src="/icons/edit.svg" alt="Edit" width={14} height={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
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
      </div>

      {/* Pagination  */}
      <div className="grid grid-cols-3 items-center mt-4 text-sm text-gray-600">
        <p>Showing 1 to {filteredCompetitions.length} of {competitions.length} results</p>
        <div className="flex justify-center items-center gap-2">
          <select className="border border-[rgba(0,0,0,0.2)] rounded-md px-3 py-1 text-sm text-center pr-6 cursor-pointer">
            <option value="10">10</option>
          </select>
          <span>per page</span>
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
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-2xl">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                  {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                  {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline}</p>}
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 resize-y min-h-[80px]"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>

              <div className="flex justify-end gap-2">
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
                  {isSubmitting ? 'Adding...' : '+ Add'}
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
