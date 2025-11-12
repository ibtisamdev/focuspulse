'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import type { ProfileData } from '@/lib/types/settings';

export function ProfileTab() {
  const [formData, setFormData] = useState<ProfileData>({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    avatarUrl: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Server Action
    console.log('Saving profile:', formData);
  };

  const handleCancel = () => {
    // Reset form to initial values
    setFormData({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      avatarUrl: undefined,
    });
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
          <AvatarImage src={formData.avatarUrl} alt={formData.fullName} />
          <AvatarFallback className="bg-[#09090b] text-2xl font-semibold text-zinc-50">
            JD
          </AvatarFallback>
        </Avatar>
        <div>
          <Button
            type="button"
            variant="outline"
            className="text-sm border-zinc-800 bg-transparent hover:bg-zinc-800/50 text-zinc-50"
          >
            Change Avatar
          </Button>
          <p className="text-xs text-zinc-500 mt-2">
            JPG, GIF or PNG. Max size of 2MB.
          </p>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium text-zinc-400">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="Enter your full name"
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
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
          className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:border-transparent"
        />
        <p className="text-xs text-zinc-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 inline" />
          Verified - Email verification required for changes
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          className="text-sm text-zinc-400 hover:text-zinc-300 hover:bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="text-sm bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
