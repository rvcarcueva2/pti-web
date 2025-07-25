'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '../../../lib/supabaseClient';

// Updated Competition type
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
};

export default function CompetitionPage() {
  const router = useRouter();

  // Competitions loaded from Supabase
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Modal and form state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingPosterUrl, setExistingPosterUrl] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number } | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');


  // Fetch competitions from Supabase
  const fetchCompetitions = async () => {
    const { data, error } = await supabase.from('competitions').select('*');
    if (error) {
      console.error('Error fetching competitions:', error);
    } else {
      setCompetitions(data as Competition[]);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filter competitions by search term
  const filteredCompetitions = competitions.filter((comp) =>
    Object.values(comp)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Sort filtered competitions
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

  // Poster preview (new or existing)
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
    setExistingPosterUrl(null);
    setPosterFile(null);
    setPreviewSize(null);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    const originalIndex = competitions.findIndex(c => c.uuid === filteredCompetitions[index].uuid);
    const comp = competitions[originalIndex];
    if (comp) {
      setTitle(comp.title);
      setDate(comp.date);
      setDescription(comp.description);
      setLocation(comp.location);
      setDeadline(comp.deadline);
      setExistingPosterUrl(comp.photo_url || null); // <-- add this line
      setPosterFile(null); // <-- important to reset new uploads
    }
    openModal();
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

    // upload poster if provided
    let photo_url = '';
    if (posterFile) {
      const filePath = `${Date.now()}_${posterFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('poster')
        .upload(filePath, posterFile);
      if (uploadError) console.error('Upload error:', uploadError);
      else {
        const { data: publicUrlData } = supabase
          .storage
          .from('poster')
          .getPublicUrl(uploadData.path);
        photo_url = publicUrlData.publicUrl;
      }
    }

    // payload for insert/update, allow optional photo_url
    const newCompetitionData: any = { title, date, description, location, deadline };
    if (photo_url) newCompetitionData.photo_url = photo_url;

    if (editIndex !== null) {
      const compToEdit = filteredCompetitions[editIndex];
      const { data, error } = await supabase
        .from('competitions')
        .update(newCompetitionData)
        .eq('uuid', compToEdit.uuid);
      if (!error) {
        await fetchCompetitions();
        setIsSubmitting(false);
        closeModal();
        setSuccessMessage('Competition updated successfully!');
        return;
      }
    } else {
      const { data, error } = await supabase
        .from('competitions')
        .insert([{ ...newCompetitionData }]);
      if (!error) {
        await fetchCompetitions();
        setIsSubmitting(false);
        closeModal();
        setSuccessMessage('Competition added successfully!');
        return;
      }
    }


    setIsSubmitting(false);
    // Refresh list
    await fetchCompetitions();
    closeModal();
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    const compToDelete = filteredCompetitions[deleteIndex];
    const { error } = await supabase.from('competitions').delete().eq('uuid', compToDelete.uuid);
    if (!error) {
      setIsDeleteModalOpen(false);
      setDeleteIndex(null);
      setSuccessMessage('Competition deleted successfully!');
      fetchCompetitions();
    } else {
      console.error('Delete error:', error);
    }
  };



  // (Duplicate fetch removed)
  return (
    <div className="font-geist p-6 ml-64">
      {/* Load competitions on mount */}
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

      {/* Floating Success Message */}
      {successMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-green-100 border border-green-400 text-green-700 rounded shadow-lg text-m font-regular transition-all duration-300">
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
              <tr key={comp.uuid} className="border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50">
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
