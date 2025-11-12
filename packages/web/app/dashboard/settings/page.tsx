import { SettingsTabs } from '@/components/settings/settings-tabs';
import { getCurrentUser } from '@/app/actions/user';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  // Fetch current user data
  const result = await getCurrentUser();

  if (!result.success || !result.user) {
    redirect('/sign-in');
  }

  const userData = {
    fullName: `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim() || 'User',
    firstName: result.user.firstName || '',
    lastName: result.user.lastName || '',
    email: result.user.email,
    imageUrl: result.user.imageUrl || undefined,
    weeklyGoal: result.user.weeklyGoalHours,
    defaultSessionDuration: result.user.defaultSessionDuration,
    theme: result.user.theme as 'dark' | 'light' | 'system',
    timezone: result.user.timezone,
    emailNotifications: result.user.emailNotifications,
    sessionReminders: result.user.sessionReminders,
    streakAlerts: result.user.streakAlerts,
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-zinc-50 mb-2">
          Settings
        </h1>
        <p className="text-sm text-zinc-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs Component */}
      <SettingsTabs initialData={userData} />
    </main>
  );
}
