'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '../../../lib/supabaseClient';

interface TeamData {
  id?: string;
  team_name: string;
  social: string;
  coach_name: string;
  team_logo: string | null;
  coach_photo: string | null;
}

export default function MyTeamPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasTeamData, setHasTeamData] = useState(false);

  // Form data
  const [teamForm, setTeamForm] = useState<TeamData>({
    team_name: '',
    social: '',
    coach_name: '',
    team_logo: null,
    coach_photo: null,
  });

  // File states
  const [teamLogoFile, setTeamLogoFile] = useState<File | null>(null);
  const [coachPhotoFile, setCoachPhotoFile] = useState<File | null>(null);
  const [teamLogoPreview, setTeamLogoPreview] = useState<string | null>(null);
  const [coachPhotoPreview, setCoachPhotoPreview] = useState<string | null>(null);

  // Error and success states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const checkAuthAndLoadTeam = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          router.push('/auth/sign-in?redirectTo=/user-dashboard/my-team');
          return;
        }

        if (!session?.user) {
          router.push('/auth/sign-in?redirectTo=/user-dashboard/my-team');
          return;
        }

        setUser(session.user);
        await loadTeamData(session.user.id);

      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/auth/sign-in?redirectTo=/user-dashboard/my-team');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadTeam();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          router.push('/auth/sign-in?redirectTo=/user-dashboard/my-team');
        } else if (session?.user) {
          setUser(session.user);
          await loadTeamData(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const loadTeamData = async (userId: string) => {
    try {
      // Always refresh session before API call
      let { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshed.session) {
          setIsEditing(true);
          return;
        }
        session = refreshed.session;
      }

      const response = await fetch('/api/teams', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.team) {
        setTeamForm(data.team);
        setHasTeamData(true);
        setIsEditing(false);
        
        // Set image previews if they exist
        if (data.team.team_logo) {
          setTeamLogoPreview(data.team.team_logo);
        }
        if (data.team.coach_photo) {
          setCoachPhotoPreview(data.team.coach_photo);
        }
      } else {
        // No team data exists, start in editing mode
        setHasTeamData(false);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamForm(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSuccessMessage('');
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'team_logo' | 'coach_photo'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (type === 'team_logo') {
        setTeamLogoFile(file);
        setTeamLogoPreview(URL.createObjectURL(file));
      } else {
        setCoachPhotoFile(file);
        setCoachPhotoPreview(URL.createObjectURL(file));
      }
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      // Always refresh session before API call
      let { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshed.session) {
          throw new Error('Not authenticated');
        }
        session = refreshed.session;
      }

      console.log(`Uploading file to ${folder}:`, file.name);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'teams');
      formData.append('folder', folder);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/upload/file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Upload response status:', response.status);
      const data = await response.json();
      console.log('Upload response data:', data);

      if (response.ok && data.success) {
        console.log('File uploaded successfully:', data.url);
        return data.url;
      } else {
        throw new Error(data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('File upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!teamForm.team_name.trim()) {
      newErrors.team_name = 'Team name is required.';
    }

    if (!teamForm.coach_name.trim()) {
      newErrors.coach_name = 'Coach name is required.';
    }

    if (teamForm.social && !teamForm.social.trim().match(/^https?:\/\/.+/)) {
      if (!teamForm.social.trim().startsWith('www.') && !teamForm.social.trim().includes('.')) {
        newErrors.social = 'Please enter a valid URL or website address.';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        let teamLogoUrl = teamForm.team_logo;
        let coachPhotoUrl = teamForm.coach_photo;

        // Upload files if new ones were selected
        if (teamLogoFile) {
          teamLogoUrl = await uploadFile(teamLogoFile, 'logos');
          if (!teamLogoUrl) {
            setErrors({ general: 'Failed to upload team logo. Please try again.' });
            setIsSubmitting(false);
            return;
          }
        }

        if (coachPhotoFile) {
          coachPhotoUrl = await uploadFile(coachPhotoFile, 'photos');
          if (!coachPhotoUrl) {
            setErrors({ general: 'Failed to upload coach photo. Please try again.' });
            setIsSubmitting(false);
            return;
          }
        }

        // Always refresh session before API call
        let { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshed.session) {
            setErrors({ general: 'Authentication expired. Please sign in again.' });
            setIsSubmitting(false);
            return;
          }
          session = refreshed.session;
        }

        console.log('Submitting team data...', {
          team_name: teamForm.team_name.trim(),
          social: teamForm.social.trim() || null,
          coach_name: teamForm.coach_name.trim(),
          team_logo: teamLogoUrl,
          coach_photo: coachPhotoUrl,
        });

        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch('/api/teams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            team_name: teamForm.team_name.trim(),
            social: teamForm.social.trim() || null,
            coach_name: teamForm.coach_name.trim(),
            team_logo: teamLogoUrl,
            coach_photo: coachPhotoUrl,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok && data.success) {
          setSuccessMessage(data.message);
          setTeamForm(data.team);
          setHasTeamData(true);
          setIsEditing(false);
          
          // Clear file states
          setTeamLogoFile(null);
          setCoachPhotoFile(null);
          
          // Update previews with saved URLs
          if (data.team.team_logo) {
            setTeamLogoPreview(data.team.team_logo);
          }
          if (data.team.coach_photo) {
            setCoachPhotoPreview(data.team.coach_photo);
          }
          
        } else {
          console.error('API Error:', data);
          setErrors({ general: data.error || 'Failed to save team data. Please try again.' });
        }
      } catch (error) {
        console.error('Submit error:', error);
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }

    console.log('Setting isSubmitting to false');
    setIsSubmitting(false);
  };

  const toggleEdit = () => {
    if (isEditing && hasTeamData) {
      // Cancel editing - reload team data
      loadTeamData(user.id);
    }
    setIsEditing(!isEditing);
    setErrors({});
    setSuccessMessage('');
  };

  if (isLoading) {
    return (
      <div className="ml-64 font-geist p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#EAB044] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 font-geist p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Team</h1>
          {hasTeamData && (
            <button
              onClick={toggleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-[#EAB044] text-white rounded hover:bg-[#d49a35] transition-colors"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={isEditing ? faTimes : faEdit} className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit Team'}
            </button>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <div className="bg-white p-8 rounded-lg border border-[rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-semibold mb-6 border-b pb-2 border-[rgba(0,0,0,0.2)]">
            Team Information
          </h2>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Team Name *</label>
                    <input
                      type="text"
                      name="team_name"
                      placeholder="Enter team name"
                      value={teamForm.team_name}
                      onChange={handleInputChange}
                      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EAB044] ${
                        errors.team_name ? 'border-red-500' : 'border-[rgba(0,0,0,0.2)]'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.team_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.team_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Social Media / Website</label>
                    <input
                      type="text"
                      name="social"
                      placeholder="https://www.facebook.com/teamname or www.teamname.com"
                      value={teamForm.social}
                      onChange={handleInputChange}
                      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EAB044] ${
                        errors.social ? 'border-red-500' : 'border-[rgba(0,0,0,0.2)]'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.social && (
                      <p className="text-red-500 text-sm mt-1">{errors.social}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Coach Name *</label>
                    <input
                      type="text"
                      name="coach_name"
                      placeholder="Enter coach name"
                      value={teamForm.coach_name}
                      onChange={handleInputChange}
                      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EAB044] ${
                        errors.coach_name ? 'border-red-500' : 'border-[rgba(0,0,0,0.2)]'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.coach_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.coach_name}</p>
                    )}
                  </div>
                </div>

                {/* Uploads + Save Button */}
                <div className="w-[304px] flex flex-col justify-between items-center">
                  <div className="flex gap-4">
                    {/* Team Logo */}
                    <div className="flex flex-col items-center gap-2 w-36">
                      <div className="w-36 h-36 bg-gray-100 border border-[rgba(0,0,0,0.2)] rounded flex items-center justify-center text-sm text-gray-600 text-center overflow-hidden">
                        {teamLogoPreview ? (
                          <img src={teamLogoPreview} alt="Team Logo" className="w-full h-full object-cover" />
                        ) : (
                          <p>Team Logo</p>
                        )}
                      </div>
                      <label className="block w-36">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'team_logo')}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                        <div className="bg-black text-white w-full py-2 rounded text-center cursor-pointer hover:bg-gray-800 flex items-center justify-center gap-2">
                          <img src="/icons/upload-file.svg" alt="Upload" className="w-4 h-4" />
                          <span className="text-sm font-normal">Upload Logo</span>
                        </div>
                      </label>
                    </div>

                    {/* Coach Photo */}
                    <div className="flex flex-col items-center gap-2 w-36">
                      <div className="w-36 h-36 bg-gray-100 border border-[rgba(0,0,0,0.2)] rounded flex items-center justify-center text-sm text-gray-600 text-center overflow-hidden">
                        {coachPhotoPreview ? (
                          <img src={coachPhotoPreview} alt="Coach Photo" className="w-full h-full object-cover" />
                        ) : (
                          <p>Coach Photo</p>
                        )}
                      </div>
                      <label className="block w-36">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'coach_photo')}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                        <div className="bg-black text-white w-full py-2 rounded text-center cursor-pointer hover:bg-gray-800 flex items-center justify-center gap-2">
                          <img src="/icons/upload-file.svg" alt="Upload" className="w-4 h-4" />
                          <span className="text-sm font-normal">Upload Photo</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <button
                    type="submit"
                    className="mt-6 w-[304px] bg-[#EAB044] text-white py-2 rounded text-sm hover:bg-[#d49a35] font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                        {hasTeamData ? 'Update Team' : 'Save Team'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            // Display Mode
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Display Fields */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Team Name</label>
                  <div className="w-full border border-[rgba(0,0,0,0.2)] rounded px-3 py-2 bg-gray-50 text-gray-800">
                    {teamForm.team_name || 'No team name set'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Social Media / Website</label>
                  <div className="w-full border border-[rgba(0,0,0,0.2)] rounded px-3 py-2 bg-gray-50 text-gray-800">
                    {teamForm.social ? (
                      <a
                        href={teamForm.social.startsWith('http') ? teamForm.social : `https://${teamForm.social}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#EAB044] hover:underline"
                      >
                        {teamForm.social}
                      </a>
                    ) : (
                      'No social media set'
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Coach Name</label>
                  <div className="w-full border border-[rgba(0,0,0,0.2)] rounded px-3 py-2 bg-gray-50 text-gray-800">
                    {teamForm.coach_name || 'No coach name set'}
                  </div>
                </div>
              </div>

              {/* Image Display */}
              <div className="w-[304px] flex flex-col items-center">
                <div className="flex gap-4">
                  {/* Team Logo Display */}
                  <div className="flex flex-col items-center gap-2 w-36">
                    <div className="w-36 h-36 bg-gray-100 border border-[rgba(0,0,0,0.2)] rounded flex items-center justify-center text-sm text-gray-600 text-center overflow-hidden">
                      {teamForm.team_logo ? (
                        <img src={teamForm.team_logo} alt="Team Logo" className="w-full h-full object-cover" />
                      ) : (
                        <p>No team logo</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-center">Team Logo</p>
                  </div>

                  {/* Coach Photo Display */}
                  <div className="flex flex-col items-center gap-2 w-36">
                    <div className="w-36 h-36 bg-gray-100 border border-[rgba(0,0,0,0.2)] rounded flex items-center justify-center text-sm text-gray-600 text-center overflow-hidden">
                      {teamForm.coach_photo ? (
                        <img src={teamForm.coach_photo} alt="Coach Photo" className="w-full h-full object-cover" />
                      ) : (
                        <p>No coach photo</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-center">Coach Photo</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
