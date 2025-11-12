'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import type { SecurityData, PasswordRequirements } from '@/lib/types/settings';

export function SecurityTab() {
  const [formData, setFormData] = useState<SecurityData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password validation
  const [requirements, setRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
  });

  // Validate password on change
  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, newPassword: password });

    setRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // TODO: Connect to Server Action
    console.log('Updating password');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">
          Security Settings
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          Manage your password and security preferences
        </p>
      </div>

      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-sm font-medium text-zinc-400">
          Current Password
        </Label>
        <Input
          id="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          placeholder="Enter current password"
          className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-700"
        />
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-sm font-medium text-zinc-400">
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={(e) => handlePasswordChange(e.target.value)}
          placeholder="Enter new password"
          className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-700"
        />
        <p className="text-xs text-zinc-500">
          Must be at least 8 characters long
        </p>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-400">
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="Confirm new password"
          className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-700"
        />
      </div>

      {/* Password Requirements */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-md p-4">
        <p className="text-xs font-medium text-zinc-400 mb-3">
          Password Requirements:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-xs text-zinc-500">
            <Check className={`h-3 w-3 ${requirements.minLength ? 'text-green-500' : 'text-zinc-600'}`} />
            At least 8 characters
          </li>
          <li className="flex items-center gap-2 text-xs text-zinc-500">
            <Check className={`h-3 w-3 ${requirements.hasUppercase ? 'text-green-500' : 'text-zinc-600'}`} />
            At least one uppercase letter
          </li>
          <li className="flex items-center gap-2 text-xs text-zinc-500">
            <Check className={`h-3 w-3 ${requirements.hasNumber ? 'text-green-500' : 'text-zinc-600'}`} />
            At least one number
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
          className="text-sm text-zinc-400 hover:text-zinc-300 hover:bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="text-sm bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium"
        >
          Update Password
        </Button>
      </div>
    </form>
  );
}
