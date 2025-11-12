'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Download, Loader2 } from 'lucide-react';
import { DeleteAccountDialog } from './delete-account-dialog';
import { exportUserData } from '@/app/actions/settings';
import { toast } from 'sonner';

export function DangerZoneTab() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);

    try {
      const result = await exportUserData();

      if (result.success && result.data) {
        // Create a JSON blob and trigger download
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `focuspulse-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Data exported successfully');
      } else {
        toast.error(result.error || 'Failed to export data');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">
          Danger Zone
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          Irreversible and destructive actions
        </p>
      </div>

      {/* Delete Account Section */}
      <div className="border border-red-900/50 bg-red-950/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-400 mb-2">
              Delete Account
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <ul className="space-y-2 text-xs text-zinc-500 mb-4">
              <li className="flex items-center gap-2">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                All your session data will be permanently deleted
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Your streak progress will be lost forever
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                This action cannot be undone
              </li>
            </ul>
            <Button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="bg-red-900/50 text-red-400 hover:bg-red-900/70 border border-red-900/50 font-medium"
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </div>

      {/* Export Data Section */}
      <div className="border border-zinc-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <Download className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-zinc-50 mb-2">
              Export Your Data
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Download a copy of your FocusPulse data before deleting your account.
            </p>
            <Button
              type="button"
              onClick={handleExportData}
              disabled={isExporting}
              variant="outline"
              className="bg-[#09090b] text-zinc-50 hover:bg-zinc-900 border-zinc-800 font-medium"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                'Export Data'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
}
