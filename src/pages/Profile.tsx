import React, { useState } from 'react';
import { User, Camera, Edit, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useProfile } from '../hooks/useProfile';
import { formatCurrency } from '../utils/calculations';

const schema = yup.object({
  full_name: yup.string().required('Full name is required'),
  phone: yup.string(),
  date_of_birth: yup.string(),
  occupation: yup.string(),
  monthly_income: yup.number().min(0, 'Income cannot be negative'),
});

interface ProfileFormData {
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  occupation?: string;
  monthly_income?: number;
}

export const Profile: React.FC = () => {
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: profile ? {
      full_name: profile.full_name,
      phone: profile.phone || '',
      date_of_birth: profile.date_of_birth || '',
      occupation: profile.occupation || '',
      monthly_income: profile.monthly_income || 0,
    } : {},
  });

  React.useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name,
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        occupation: profile.occupation || '',
        monthly_income: profile.monthly_income || 0,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    await uploadAvatar(file);
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Profile Management
          </motion.h1>
          <motion.p 
            className="text-gray-600 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Manage your personal information and preferences
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button 
            onClick={() => setIsEditing(!isEditing)} 
            variant={isEditing ? "outline" : "primary"}
            size="lg" 
            icon={isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card hover className="lg:col-span-1">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="h-5 w-5 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <motion.div
                    className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {profile?.full_name || 'User'}
            </h3>
            <p className="text-gray-600 mb-4">{profile?.email}</p>
            
            {profile?.monthly_income && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-emerald-600 text-sm font-medium">Monthly Income</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(profile.monthly_income)}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Profile Form */}
        <Card hover className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('full_name')}
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.full_name?.message}
                disabled={!isEditing}
              />
              
              <Input
                {...register('phone')}
                label="Phone Number"
                placeholder="Enter your phone number"
                error={errors.phone?.message}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('date_of_birth')}
                type="date"
                label="Date of Birth"
                error={errors.date_of_birth?.message}
                disabled={!isEditing}
              />
              
              <Input
                {...register('occupation')}
                label="Occupation"
                placeholder="Enter your occupation"
                error={errors.occupation?.message}
                disabled={!isEditing}
              />
            </div>

            <Input
              {...register('monthly_income')}
              type="number"
              step="0.01"
              label="Monthly Income (₹)"
              placeholder="Enter your monthly income"
              error={errors.monthly_income?.message}
              disabled={!isEditing}
            />

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  size="lg"
                  icon={<Save className="h-5 w-5" />}
                >
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>

      {/* Account Information */}
      <Card hover>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-600 text-sm font-medium">Account Created</p>
            <p className="text-lg font-semibold text-blue-700">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-green-600 text-sm font-medium">Profile Status</p>
            <p className="text-lg font-semibold text-green-700">Active</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-purple-600 text-sm font-medium">Last Updated</p>
            <p className="text-lg font-semibold text-purple-700">
              {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <p className="text-orange-600 text-sm font-medium">Data Privacy</p>
            <p className="text-lg font-semibold text-orange-700">Secured</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};