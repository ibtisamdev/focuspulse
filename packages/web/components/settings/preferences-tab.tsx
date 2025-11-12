'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PreferencesData } from '@/lib/types/settings';

export function PreferencesTab() {
  const [formData, setFormData] = useState<PreferencesData>({
    weeklyGoal: 12,
    defaultSessionDuration: 90,
    theme: 'dark',
    timezone: 'UTC-5',
    notifications: {
      email: true,
      sessionReminders: true,
      streakAlerts: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Server Action
    console.log('Saving preferences:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">
          Preferences
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          Customize your FocusPulse experience
        </p>
      </div>

      {/* Weekly Goal */}
      <div className="space-y-2">
        <Label htmlFor="weeklyGoal" className="text-sm font-medium text-zinc-400">
          Weekly Focus Goal (hours)
        </Label>
        <Input
          id="weeklyGoal"
          type="number"
          min="1"
          max="168"
          value={formData.weeklyGoal}
          onChange={(e) => setFormData({ ...formData, weeklyGoal: parseInt(e.target.value) })}
          placeholder="12"
          className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-zinc-700"
        />
        <p className="text-xs text-zinc-500">
          Set your target deep work hours per week
        </p>
      </div>

      {/* Default Session Duration */}
      <div className="space-y-2">
        <Label htmlFor="sessionDuration" className="text-sm font-medium text-zinc-400">
          Default Session Duration (minutes)
        </Label>
        <Select
          value={formData.defaultSessionDuration.toString()}
          onValueChange={(value) => setFormData({ ...formData, defaultSessionDuration: parseInt(value) })}
        >
          <SelectTrigger className="bg-[#09090b] border-zinc-800 text-zinc-50 focus:ring-2 focus:ring-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#18181b] border-zinc-800">
            <SelectItem value="25" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              25 minutes
            </SelectItem>
            <SelectItem value="45" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              45 minutes
            </SelectItem>
            <SelectItem value="60" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              60 minutes
            </SelectItem>
            <SelectItem value="90" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              90 minutes
            </SelectItem>
            <SelectItem value="120" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              120 minutes
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-zinc-500">
          Default duration for new focus sessions
        </p>
      </div>

      {/* Theme Preference */}
      <div className="space-y-2">
        <Label htmlFor="theme" className="text-sm font-medium text-zinc-400">
          Theme
        </Label>
        <Select
          value={formData.theme}
          onValueChange={(value: 'dark' | 'light' | 'system') => setFormData({ ...formData, theme: value })}
        >
          <SelectTrigger className="bg-[#09090b] border-zinc-800 text-zinc-50 focus:ring-2 focus:ring-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#18181b] border-zinc-800">
            <SelectItem value="dark" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              Dark
            </SelectItem>
            <SelectItem value="light" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              Light
            </SelectItem>
            <SelectItem value="system" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              System
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-zinc-500">
          Choose your preferred color theme
        </p>
      </div>

      {/* Time Zone */}
      <div className="space-y-2">
        <Label htmlFor="timezone" className="text-sm font-medium text-zinc-400">
          Time Zone
        </Label>
        <Select
          value={formData.timezone}
          onValueChange={(value) => setFormData({ ...formData, timezone: value })}
        >
          <SelectTrigger className="bg-[#09090b] border-zinc-800 text-zinc-50 focus:ring-2 focus:ring-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#18181b] border-zinc-800">
            <SelectItem value="UTC-8" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              Pacific Time (PT)
            </SelectItem>
            <SelectItem value="UTC-7" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              Mountain Time (MT)
            </SelectItem>
            <SelectItem value="UTC-6" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              Central Time (CT)
            </SelectItem>
            <SelectItem value="UTC-5" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              Eastern Time (ET)
            </SelectItem>
            <SelectItem value="UTC+0" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              GMT
            </SelectItem>
            <SelectItem value="UTC+1" className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
              Central European Time
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-zinc-500">
          Your current time zone setting
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-md p-4">
        <p className="text-sm font-medium text-zinc-50 mb-4">
          Notification Preferences
        </p>
        <div className="space-y-3">
          {/* Email Notifications */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-zinc-50">Email Notifications</p>
              <p className="text-xs text-zinc-500">Receive weekly summary emails</p>
            </div>
            <Checkbox
              checked={formData.notifications.email}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, email: checked === true },
                })
              }
              className="border-zinc-700 bg-[#18181b] data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900"
            />
          </label>

          {/* Session Reminders */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-zinc-50">Session Reminders</p>
              <p className="text-xs text-zinc-500">Get notified before planned sessions</p>
            </div>
            <Checkbox
              checked={formData.notifications.sessionReminders}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, sessionReminders: checked === true },
                })
              }
              className="border-zinc-700 bg-[#18181b] data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900"
            />
          </label>

          {/* Streak Alerts */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-zinc-50">Streak Alerts</p>
              <p className="text-xs text-zinc-500">Reminder when your streak is at risk</p>
            </div>
            <Checkbox
              checked={formData.notifications.streakAlerts}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, streakAlerts: checked === true },
                })
              }
              className="border-zinc-700 bg-[#18181b] data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900"
            />
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-zinc-400 hover:text-zinc-300 hover:bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="text-sm bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium"
        >
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
