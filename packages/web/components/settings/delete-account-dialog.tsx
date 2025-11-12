'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText === 'DELETE';

  const handleDelete = async () => {
    if (!isConfirmed) return;

    // TODO: Connect to Server Action
    console.log('Deleting account...');

    // Close dialog
    onOpenChange(false);
    setConfirmText('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    setConfirmText('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#18181b] border-zinc-800 max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-zinc-50 mb-2">
                Delete Account
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-zinc-400">
                Are you absolutely sure? This action cannot be undone. All of your data will be permanently deleted.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmText" className="text-sm font-medium text-zinc-400">
              Type <span className="text-zinc-50 font-semibold">DELETE</span> to confirm
            </Label>
            <Input
              id="confirmText"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-red-900/50"
            />
          </div>
        </div>

        <AlertDialogFooter className="gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1 bg-[#09090b] text-zinc-50 hover:bg-zinc-900 border-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmed}
            className="flex-1 bg-red-900/50 text-red-400 hover:bg-red-900/70 border border-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
