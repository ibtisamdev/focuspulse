import { SettingsTabs } from '@/components/settings/settings-tabs';

export default function SettingsPage() {
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
      <SettingsTabs />
    </main>
  );
}
