'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


type Competition = {
  uuid: string;
  title: string;
  date: string;
  description: string;
  location: string;
  deadline: string;
  photo_url?: string;
  status: 'Open' | 'Closed';
  players: number;
  teams: number;
  kyorugi: number;
  poomsae: number;
  poomsae_team: number;

};

export default function CompetitionPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState<'add' | 'update' | 'delete'>('add');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    competitionUuid: string;
    newStatus: string;
  } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isOpen, setIsOpen] = useState<string>('');
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number; showAbove: boolean } | null>(null);
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

  // Load competitions from database
  const loadCompetitionData = async () => {
    setLoading(true);

    // Fetch competition details
    const { data: competitionsData, error: competitionsError } = await supabase
      .from('competitions')
      .select('uuid, title, date, description, location, deadline, photo_url, status')
      .order('date', { ascending: true });

    // Fetch competition statistics
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_competition_stats');

    if (competitionsError || statsError) {
      console.error('Error fetching data:', { competitionsError, statsError });
      setCompetitions([]); // optional: show empty state
    } else {
      // Merge competition details with statistics
      const formattedData = competitionsData.map((comp: any) => {
        const stats = statsData.find((stat: any) => stat.competition_id === comp.uuid);
        return {
          uuid: comp.uuid,
          title: comp.title,
          date: comp.date,
          description: comp.description,
          location: comp.location,
          deadline: comp.deadline,
          photo_url: comp.photo_url,
          status: comp.status,
          players: stats?.players_count || 0,
          teams: stats?.teams_count || 0,
          kyorugi: stats?.kyorugi_count || 0,
          poomsae: stats?.poomsae_count || 0,
          poomsae_team: stats?.poomsae_team_count || 0,
        };
      });

      setCompetitions(formattedData);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCompetitionData();
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
    { label: 'Competition', key: 'title', minWidth: 'min-w-[200px]' },
    { label: 'Players', key: 'players', minWidth: 'min-w-[80px]' },
    { label: 'Teams', key: 'teams', minWidth: 'min-w-[80px]' },
    { label: 'Kyorugi', key: 'kyorugi', minWidth: 'min-w-[80px]' },
    { label: 'Poomsae', key: 'poomsae', minWidth: 'min-w-[80px]' },
    { label: 'Poomsae Team', key: 'poomsae_team', minWidth: 'min-w-[100px]' },
    { label: 'Status', key: 'status', minWidth: 'min-w-[100px]' },
  ];

  const handleSort = (column: keyof Competition) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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


    // Upload poster if provided
    let photo_url = existingPosterUrl; // Keep existing URL if no new file
    if (posterFile) {
      const filePath = `${Date.now()}_${posterFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('poster')
        .upload(filePath, posterFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
      } else {
        const { data: publicUrlData } = supabase
          .storage
          .from('poster')
          .getPublicUrl(uploadData.path);
        photo_url = publicUrlData.publicUrl;
      }
    }



    // Payload for insert/update
    const newCompetitionData: any = { title, date, description, location, deadline };
    if (photo_url) newCompetitionData.photo_url = photo_url;

    if (editIndex !== null) {
      // Update existing competition
      const compToEdit = competitions[editIndex];
      const { data, error } = await supabase
        .from('competitions')
        .update(newCompetitionData)
        .eq('uuid', compToEdit.uuid);

      if (!error) {
        await loadCompetitionData();
        setSuccessMessage('Competition updated successfully!');
        setSuccessType('update');
        closeModal();
      } else {
        console.error('Update error:', error);
      }
    } else {
      // Insert new competition
      const { data, error } = await supabase
        .from('competitions')
        .insert([{ ...newCompetitionData }]);

      if (!error) {
        await loadCompetitionData();
        setSuccessMessage('Competition added successfully!');
        setSuccessType('add');
        closeModal();
      } else {
        console.error('Insert error:', error);
      }
    }

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
    setPosterFile(null); // Reset new uploads
    openModal();
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;

    const compToDelete = competitions[deleteIndex];
    const { error } = await supabase
      .from('competitions')
      .delete()
      .eq('uuid', compToDelete.uuid);

    if (!error) {
      await loadCompetitionData();
      setSuccessMessage('Competition deleted successfully!');
      setSuccessType('delete');
      setDeleteIndex(null);
      setIsDeleteModalOpen(false);
    } else {
      console.error('Delete error:', error);
    }
  };

  const handleRowClick = (uuid: string) => {
    router.push(`/admin-panel/competitions/${uuid}`);
  };

  const handleStatusChange = async (competitionUuid: string, newStatus: 'Open' | 'Closed') => {
    const { error } = await supabase
      .from('competitions')
      .update({ status: newStatus })
      .eq('uuid', competitionUuid);

    if (!error) {
      await loadCompetitionData();
      setSuccessMessage('Status updated successfully!');
      setSuccessType('update');
    } else {
      console.error('Status update error:', error);
    }
  };

  const handleToggle = (competitionUuid: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if there's enough space below (150px for dropdown height)
    const spaceBelow = windowHeight - rect.bottom;
    const showAbove = spaceBelow < 150;

    setDropdownPosition({
      x: rect.left - 120, // Position to the left of the button
      y: showAbove ? rect.top - 140 : rect.bottom + 5, // Above or below based on space
      showAbove
    });

    setIsOpen((prev) => (prev === competitionUuid ? '' : competitionUuid));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'text-green-700 bg-green-100';
      case 'closed':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getDropdownStatusColor = (status: string, isSelected: boolean) => {
    if (!isSelected) return 'text-gray-700';

    switch (status.toLowerCase()) {
      case 'open':
        return 'text-green-700 font-bold';
      case 'closed':
        return 'text-red-700 font-bold';
      default:
        return 'text-gray-700 font-bold';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen('');
      setDropdownPosition(null);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="font-geist p-6 ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Competitions</h1>
        <div className="flex gap-2">
          <button onClick={openModal} className="cursor-pointer bg-[#EAB044] text-white px-4 py-2 rounded-md text-sm hover:bg-[#d49a35]">
            <span>Add Competition</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 border rounded shadow-lg text-m font-regular transition-all duration-300 ${successType === 'add' ? 'bg-green-100 border-green-400 text-green-700' :
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
            {loading ? (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={8}>
                  Loading competitions...
                </td>
              </tr>
            ) : competitions.length === 0 ? (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={8}>
                  No competitions found.
                </td>
              </tr>
            ) : (
              filteredCompetitions.map((comp, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(comp.uuid)}
                  className={`border-b border-[rgba(0,0,0,0.2)] hover:bg-orange-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <td className="p-3">{comp.title}</td>
                  <td className="p-3">{comp.players}</td>
                  <td className="p-3">{comp.teams}</td>
                  <td className="p-3">{comp.kyorugi}</td>
                  <td className="p-3">{comp.poomsae}</td>
                  <td className="p-3">{comp.poomsae_team}</td>
                  <td className="p-3 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(comp.status)}`}>
                        {comp.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(comp.uuid, e);
                        }}
                        className="cursor-pointer w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 transition -ml-1"
                      >
                        <FontAwesomeIcon icon={faChevronDown} className="text-gray-600 text-xs" />
                      </button>
                    </div>
                  </td>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status Dropdown */}
      {isOpen && dropdownPosition && (
        <div
          className="fixed z-50 bg-white border border-gray-300 rounded shadow-lg w-36 overflow-hidden"
          style={{
            top: dropdownPosition.y,
            left: dropdownPosition.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {['Open', 'Closed'].map((statusOption) => {
            const currentItem = competitions.find(comp => comp.uuid === isOpen);
            const isSelected = currentItem?.status === statusOption;

            return (
              <div
                key={statusOption}
                onClick={() => {
                  setSelectedStatus(statusOption);
                  setPendingStatusChange({
                    competitionUuid: isOpen,
                    newStatus: statusOption,
                  });
                  setIsStatusModalOpen(true);
                  setIsOpen('');
                  setDropdownPosition(null);
                }}
                className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${getDropdownStatusColor(statusOption, isSelected)}`}
              >
                {statusOption}
              </div>
            );
          })}
        </div>
      )}

      {/* Status Confirmation Modal */}
      {isStatusModalOpen && pendingStatusChange && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg border border-gray-200 relative">
            <p className="mb-6 text-gray-800 leading-relaxed">
              Are you sure you want to change the status to
              <span className="font-bold uppercase text-black"> {pendingStatusChange.newStatus}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setPendingStatusChange(null);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (pendingStatusChange) {
                    handleStatusChange(pendingStatusChange.competitionUuid, pendingStatusChange.newStatus as 'Open' | 'Closed');
                    setIsStatusModalOpen(false);
                    setPendingStatusChange(null);
                  }
                }}
                className="px-4 py-2 rounded bg-[#EAB044] text-white hover:bg-[#d49a35] transition cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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