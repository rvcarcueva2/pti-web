'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '../../lib/supabaseClient';

const Profile: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form states
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        mobile: ''
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Error states
    const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});
    const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    useEffect(() => {
        // Check authentication and get user data
        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Error getting session:', error);
                    router.push('/auth/sign-in?redirectTo=/profile');
                    return;
                }

                if (!session?.user) {
                    router.push('/auth/sign-in?redirectTo=/profile');
                    return;
                }

                // Verify the session is still valid by making a test query
                const { error: testError } = await supabase.auth.getUser();
                if (testError) {
                    console.error('Session invalid:', testError);
                    await supabase.auth.signOut();
                    router.push('/auth/sign-in?redirectTo=/profile');
                    return;
                }

                setUser(session.user);
                
                // Initialize profile form with existing data from both auth metadata and database
                try {
                    // Fetch user profile from database
                    const { data: userProfile, error: fetchError } = await supabase
                        .from('users')
                        .select('first_name, last_name, mobile')
                        .eq('id', session.user.id)
                        .single();

                    if (fetchError) {
                        console.warn('Failed to fetch user profile from database:', fetchError);
                        // Fallback to auth metadata
                        setProfileForm({
                            firstName: session.user.user_metadata?.first_name || '',
                            lastName: session.user.user_metadata?.last_name || '',
                            mobile: session.user.user_metadata?.mobile || session.user.phone || ''
                        });
                    } else {
                        // Use database data as primary source
                        setProfileForm({
                            firstName: userProfile.first_name || session.user.user_metadata?.first_name || '',
                            lastName: userProfile.last_name || session.user.user_metadata?.last_name || '',
                            mobile: userProfile.mobile || session.user.user_metadata?.mobile || session.user.phone || ''
                        });
                    }
                } catch (dbError) {
                    console.warn('Database fetch error:', dbError);
                    // Fallback to auth metadata
                    setProfileForm({
                        firstName: session.user.user_metadata?.first_name || '',
                        lastName: session.user.user_metadata?.last_name || '',
                        mobile: session.user.user_metadata?.mobile || session.user.phone || ''
                    });
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                await supabase.auth.signOut();
                router.push('/auth/sign-in?redirectTo=/profile');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT' || !session?.user) {
                    router.push('/auth/sign-in?redirectTo=/profile');
                } else if (session?.user) {
                    // Verify the new session is valid
                    try {
                        const { error: testError } = await supabase.auth.getUser();
                        if (testError) {
                            console.error('New session invalid:', testError);
                            await supabase.auth.signOut();
                            router.push('/auth/sign-in?redirectTo=/profile');
                            return;
                        }
                        
                        setUser(session.user);
                    
                        // Initialize profile form with existing data from database
                        const fetchUserProfile = async () => {
                            try {
                                const { data: userProfile, error: fetchError } = await supabase
                                    .from('users')
                                    .select('first_name, last_name, mobile')
                                    .eq('id', session.user.id)
                                    .single();

                                if (fetchError) {
                                    console.warn('Failed to fetch user profile from database:', fetchError);
                                    // Fallback to auth metadata
                                    setProfileForm({
                                        firstName: session.user.user_metadata?.first_name || '',
                                        lastName: session.user.user_metadata?.last_name || '',
                                        mobile: session.user.user_metadata?.mobile || session.user.phone || ''
                                    });
                                } else {
                                    // Use database data as primary source
                                    setProfileForm({
                                        firstName: userProfile.first_name || session.user.user_metadata?.first_name || '',
                                        lastName: userProfile.last_name || session.user.user_metadata?.last_name || '',
                                        mobile: userProfile.mobile || session.user.user_metadata?.mobile || session.user.phone || ''
                                    });
                                }
                            } catch (dbError) {
                                console.warn('Database fetch error:', dbError);
                                // Fallback to auth metadata
                                setProfileForm({
                                    firstName: session.user.user_metadata?.first_name || '',
                                    lastName: session.user.user_metadata?.last_name || '',
                                    mobile: session.user.user_metadata?.mobile || session.user.phone || ''
                                });
                            }
                        };
                        
                        fetchUserProfile();
                    } catch (authError) {
                        console.error('Error verifying session:', authError);
                        await supabase.auth.signOut();
                        router.push('/auth/sign-in?redirectTo=/profile');
                    }
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [router]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
        // Clear errors when user starts typing
        if (profileErrors[name]) {
            setProfileErrors(prev => ({ ...prev, [name]: '' }));
        }
        setSuccessMessage('');
    };

    const handleEditToggle = () => {
        if (isEditingProfile) {
            // Cancel editing, reset form
            setProfileForm({
                firstName: user?.user_metadata?.first_name || '',
                lastName: user?.user_metadata?.last_name || '',
                mobile: user?.user_metadata?.mobile || user?.phone || ''
            });
            setProfileErrors({});
        }
        setIsEditingProfile(!isEditingProfile);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProfileLoading(true);
        setProfileErrors({});
        setSuccessMessage('');

        // Validation
        const newErrors: { [key: string]: string } = {};

        if (!profileForm.firstName.trim()) {
            newErrors.firstName = 'First name is required.';
        }

        if (!profileForm.lastName.trim()) {
            newErrors.lastName = 'Last name is required.';
        }

        if (!profileForm.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required.';
        } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(profileForm.mobile.trim())) {
            newErrors.mobile = 'Please enter a valid mobile number.';
        }

        setProfileErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                // Update user metadata
                const { error: authError } = await supabase.auth.updateUser({
                    data: {
                        first_name: profileForm.firstName.trim(),
                        last_name: profileForm.lastName.trim(),
                        mobile: profileForm.mobile.trim()
                    }
                });

                if (authError) {
                    setProfileErrors({ general: authError.message || 'Failed to update profile. Please try again.' });
                } else {
                    // Also update the users table in the database
                    const { error: dbError } = await supabase
                        .from('users')
                        .update({
                            first_name: profileForm.firstName.trim(),
                            last_name: profileForm.lastName.trim(),
                            mobile: profileForm.mobile.trim()
                        })
                        .eq('id', user.id);

                    if (dbError) {
                        console.error('Database update error:', dbError);
                        setProfileErrors({ general: 'Profile updated in auth but failed to update database. Please try again.' });
                    } else {
                        setSuccessMessage('Profile updated successfully!');
                        // Update local user state
                        setUser((prev: any) => ({
                            ...prev,
                            user_metadata: {
                                ...prev?.user_metadata,
                                first_name: profileForm.firstName.trim(),
                                last_name: profileForm.lastName.trim(),
                                mobile: profileForm.mobile.trim()
                            }
                        }));
                        setIsEditingProfile(false);
                    }
                }
            } catch (error) {
                console.error('Profile update error:', error);
                setProfileErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        }

        setIsProfileLoading(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        // Clear errors when user starts typing
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({ ...prev, [name]: '' }));
        }
        setSuccessMessage('');
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordLoading(true);
        setPasswordErrors({});
        setSuccessMessage('');

        // Validation
        const newErrors: { [key: string]: string } = {};

        if (!passwordForm.currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required.';
        }

        if (!passwordForm.newPassword.trim()) {
            newErrors.newPassword = 'New password is required.';
        } else if (passwordForm.newPassword.length < 6) {
            newErrors.newPassword = 'New password must be at least 6 characters long.';
        }

        if (!passwordForm.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Password confirmation is required.';
        } else if (passwordForm.newPassword.trim() !== passwordForm.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        if (passwordForm.currentPassword.trim() === passwordForm.newPassword.trim()) {
            newErrors.newPassword = 'New password must be different from your current password.';
        }

        setPasswordErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                // Verify current password
                const { error: verifyError } = await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: passwordForm.currentPassword
                });

                if (verifyError) {
                    setPasswordErrors({ currentPassword: 'Current password is incorrect.' });
                    setIsPasswordLoading(false);
                    return;
                }

                // Update password
                const { error } = await supabase.auth.updateUser({
                    password: passwordForm.newPassword.trim()
                });

                if (error) {
                    setPasswordErrors({ general: error.message || 'Failed to update password. Please try again.' });
                } else {
                    setSuccessMessage('Password updated successfully!');
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }
            } catch (error) {
                console.error('Password update error:', error);
                setPasswordErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        }

        setIsPasswordLoading(false);
    };

    if (isLoading) {
        return (
            <div className="font-geist min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center" style={{ minHeight: '70vh' }}>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#EAB044] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-geist">
            <div className="max-w-2xl mx-auto px-4">

                
                
                {/* Success Message for Profile Updates */}
                {successMessage && successMessage.includes('Profile') && (
                    <div className="mt-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Additional Profile Info */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FED018]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-[#FED018]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
                                <p className="text-sm text-gray-600">Your account details</p>
                            </div>
                        </div>
                        <button
                            onClick={handleEditToggle}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-[#FED018] transition-colors cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                            {isEditingProfile ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {/* Profile Error Display */}
                    {profileErrors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {profileErrors.general}
                        </div>
                    )}

                    {isEditingProfile ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Enter your first name"
                                        value={profileForm.firstName}
                                        onChange={handleProfileChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${
                                            profileErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-[#FED018] focus:border-[#FED018] outline-none transition-colors`}
                                    />
                                    {profileErrors.firstName && (
                                        <p className="text-sm text-red-500 mt-1">{profileErrors.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Enter your last name"
                                        value={profileForm.lastName}
                                        onChange={handleProfileChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${
                                            profileErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-[#FED018] focus:border-[#FED018] outline-none transition-colors`}
                                    />
                                    {profileErrors.lastName && (
                                        <p className="text-sm text-red-500 mt-1">{profileErrors.lastName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <p className="text-gray-900 bg-gray-200 px-4 py-2.5 rounded-lg">{user?.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobile <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        placeholder="Enter your mobile number"
                                        value={profileForm.mobile}
                                        onChange={handleProfileChange}
                                        className={`w-full px-4 py-2.5 rounded-lg border ${
                                            profileErrors.mobile ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-[#FED018] focus:border-[#FED018] outline-none transition-colors`}
                                    />
                                    {profileErrors.mobile && (
                                        <p className="text-sm text-red-500 mt-1">{profileErrors.mobile}</p>
                                    )}
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isProfileLoading}
                                className="w-full bg-[#FED018] text-black font-semibold py-3 rounded-lg hover:bg-[#FED018]/90 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isProfileLoading ? 'Updating Profile...' : 'Update Profile'}
                            </button>
                        </form>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <p className="text-gray-900 bg-gray-200 px-4 py-2.5 rounded-lg">
                                    {user?.user_metadata?.first_name || 'Not provided'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <p className="text-gray-900 bg-gray-200 px-4 py-2.5 rounded-lg">
                                    {user?.user_metadata?.last_name || 'Not provided'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <p className="text-gray-900 bg-gray-200 px-4 py-2.5 rounded-lg">{user?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                                <p className="text-gray-900 bg-gray-200 px-4 py-2.5 rounded-lg">
                                    {user?.user_metadata?.mobile || user?.phone || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Success Message for Password Updates */}
                {successMessage && successMessage.includes('Password') && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Update Password Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 mt-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#FED018]/10 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-[#FED018]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Update Password</h3>
                                <p className="text-sm text-gray-600">Change your password</p>
                            </div>
                        </div>

                        {/* Password Error Display */}
                        {passwordErrors.general && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {passwordErrors.general}
                            </div>
                        )}

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            {/* Current Password */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    name="currentPassword"
                                    placeholder="Enter your current password"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-2.5 pr-12 rounded-lg border ${
                                        passwordErrors.currentPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-[#FED018] focus:border-[#FED018] outline-none transition-colors`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-[34px] text-gray-500 h-5 w-5 flex items-center justify-center"
                                >
                                    {showCurrentPassword ? (
                                        <Image
                                            src="/icons/hide-password.svg"
                                            alt="Hide password"
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <Image
                                            src="/icons/show-password.svg"
                                            alt="Show password"
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                    )}
                                </button>
                                {passwordErrors.currentPassword && (
                                    <p className="text-sm text-red-500 mt-1">{passwordErrors.currentPassword}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    placeholder="Enter your new password"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-2.5 pr-12 rounded-lg border ${
                                        passwordErrors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-[#FED018] focus:border-[#FED018] outline-none transition-colors`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-[34px] text-gray-500 h-5 w-5 flex items-center justify-center"
                                >
                                    {showNewPassword ? (
                                        <Image
                                            src="/icons/hide-password.svg"
                                            alt="Hide password"
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <Image
                                            src="/icons/show-password.svg"
                                            alt="Show password"
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                    )}
                                </button>
                                {passwordErrors.newPassword && (
                                    <p className="text-sm text-red-500 mt-1">{passwordErrors.newPassword}</p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Confirm your new password"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-2.5 pr-12 rounded-lg border ${
                                        passwordErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-[#FED018] focus:border-[#FED018] outline-none transition-colors`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-[34px] text-gray-500 h-5 w-5 flex items-center justify-center"
                                >
                                    {showConfirmPassword ? (
                                        <Image
                                            src="/icons/hide-password.svg"
                                            alt="Hide password"
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <Image
                                            src="/icons/show-password.svg"
                                            alt="Show password"
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                    )}
                                </button>
                                {passwordErrors.confirmPassword && (
                                    <p className="text-sm text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isPasswordLoading}
                                className="w-full bg-[#FED018] text-black font-semibold py-3 rounded-lg hover:bg-[#FED018]/90 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isPasswordLoading ? 'Updating Password...' : 'Update Password'}
                            </button>
                        </form>
                    </div>

               
            </div>
        </div>
    );
};

export default Profile;
