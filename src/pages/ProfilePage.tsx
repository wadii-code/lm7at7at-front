import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: { name: string; oldPassword?: string; newPassword?: string } = { name };

    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        toast.error('New passwords do not match.');
        setIsSubmitting(false);
        return;
      }
      if (!oldPassword) {
        toast.error('Please enter your current password to set a new one.');
        setIsSubmitting(false);
        return;
      }
      payload.oldPassword = oldPassword;
      payload.newPassword = newPassword;
    }

    try {
      await updateUser(payload);
      toast.success('Profile updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred during profile update.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Authentication Required</CardTitle>
              <CardDescription>This page is for logged-in users only.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-600">Please log in to view and manage your profile details.</p>
              <Button asChild className="w-full text-lg py-6">
                <Link to="/login">Go to Login Page</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto max-w-2xl py-12 px-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">My Profile</CardTitle>
          <CardDescription>Update your personal details and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="font-medium">Email</label>
              <Input id="email" type="email" value={user.email} disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="font-medium">Name</label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            
            <hr className="my-6" />

            <h3 className="text-lg font-semibold">Change Password</h3>
            <div className="space-y-2">
              <label htmlFor="oldPassword">Current Password</label>
              <Input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword">New Password</label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}