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
import { AlertTriangle, Loader2 } from 'lucide-react';
import { deleteAccount } from '@/app/actions/settings';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const isConfirmed = confirmText === 'DELETE';
  const router = useRouter();

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteAccount();

      if (result.success) {
        toast.success('Account deleted successfully');
        // Redirect to home page after deletion
        router.push('/');
      } else {
        toast.error(result.error || 'Failed to delete account');
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setIsDeleting(false);
    }
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
            disabled={isDeleting}
            className="flex-1 bg-[#09090b] text-zinc-50 hover:bg-zinc-900 border-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className="flex-1 bg-red-900/50 text-red-400 hover:bg-red-900/70 border border-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
