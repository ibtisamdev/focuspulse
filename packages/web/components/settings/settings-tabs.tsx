'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from './profile-tab';
import { SecurityTab } from './security-tab';
import { PreferencesTab } from './preferences-tab';
import { DangerZoneTab } from './danger-zone-tab';

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="!bg-zinc-900 border border-zinc-800">
        <TabsTrigger
          value="profile"
          className="data-[state=active]:!bg-zinc-700 data-[state=active]:!text-white data-[state=active]:!border-zinc-600 !text-zinc-500 data-[state=inactive]:!bg-transparent"
        >
          Profile
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className="data-[state=active]:!bg-zinc-700 data-[state=active]:!text-white data-[state=active]:!border-zinc-600 !text-zinc-500 data-[state=inactive]:!bg-transparent"
        >
          Security
        </TabsTrigger>
        <TabsTrigger
          value="preferences"
          className="data-[state=active]:!bg-zinc-700 data-[state=active]:!text-white data-[state=active]:!border-zinc-600 !text-zinc-500 data-[state=inactive]:!bg-transparent"
        >
          Preferences
        </TabsTrigger>
        <TabsTrigger
          value="danger-zone"
          className="data-[state=active]:!bg-zinc-700 data-[state=active]:!text-white data-[state=active]:!border-zinc-600 !text-zinc-500 data-[state=inactive]:!bg-transparent"
        >
          Danger Zone
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <ProfileTab />
      </TabsContent>

      <TabsContent value="security" className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <SecurityTab />
      </TabsContent>

      <TabsContent value="preferences" className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <PreferencesTab />
      </TabsContent>

      <TabsContent value="danger-zone" className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <DangerZoneTab />
      </TabsContent>
    </Tabs>
  );
}
