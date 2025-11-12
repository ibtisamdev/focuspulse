'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { updateProfile } from '@/app/actions/settings';
import { toast } from 'sonner';

interface ProfileTabProps {
  initialData: {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl?: string;
  };
}

export function ProfileTab({ initialData }: ProfileTabProps) {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile({
        firstName,
        lastName,
      });

      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to initial values
    setFirstName(initialData.firstName);
    setLastName(initialData.lastName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">
          Profile Information
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          Update your personal information and profile details
        </p>
      </div>

      {/* Profile Picture */}
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20 bg-[#09090b] border border-zinc-800">
          <AvatarImage src={initialData.imageUrl} alt={initialData.fullName} />
          <AvatarFallback className="bg-[#09090b] text-2xl font-semibold text-zinc-50">
            {firstName.charAt(0).toUpperCase()}{lastName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Button
            type="button"
            variant="outline"
            className="text-sm border-zinc-800 bg-transparent hover:bg-zinc-800/50 text-zinc-50"
            disabled
          >
            Change Avatar
          </Button>
          <p className="text-xs text-zinc-500 mt-2">
            Managed by your authentication provider
          </p>
        </div>
      </div>

      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-sm font-medium text-zinc-400">
          First Name
        </Label>
        <Input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:border-transparent"
        />
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-sm font-medium text-zinc-400">
          Last Name
        </Label>
        <Input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
          className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:border-transparent"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-zinc-400">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={initialData.email}
          disabled
          className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600 opacity-50 cursor-not-allowed"
        />
        <p className="text-xs text-zinc-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 inline" />
          Verified - Managed by your authentication provider
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          disabled={isLoading}
          className="text-sm text-zinc-400 hover:text-zinc-300 hover:bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="text-sm bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
