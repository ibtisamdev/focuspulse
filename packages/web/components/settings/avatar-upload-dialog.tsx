'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { updateAvatar } from '@/app/actions/settings';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AvatarUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImageUrl?: string;
  userName: string;
}

export function AvatarUploadDialog({
  open,
  onOpenChange,
  currentImageUrl,
  userName,
}: AvatarUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a PNG, JPG, or WebP image';
    }
    if (file.size > MAX_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const result = await updateAvatar(formData);

      if (result.success) {
        toast.success('Avatar updated successfully');
        onOpenChange(false);
        router.refresh();
        // Reset state
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        toast.error(result.error || 'Failed to update avatar');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#18181b] border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-50">
            Change Avatar
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400">
            Upload a new profile picture. PNG, JPG, or WebP. Max 5MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-[#09090b] border border-zinc-800">
              <AvatarImage
                src={previewUrl || currentImageUrl}
                alt={userName}
              />
              <AvatarFallback className="bg-[#09090b] text-xl font-semibold text-zinc-50">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-50">Preview</p>
              <p className="text-xs text-zinc-500">
                {selectedFile ? selectedFile.name : 'Current avatar'}
              </p>
            </div>
            {selectedFile && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* File Upload Zone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-400">
              Upload Image
            </Label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors
                ${
                  dragActive
                    ? 'border-zinc-600 bg-zinc-800/50'
                    : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                }
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                {selectedFile ? (
                  <ImageIcon className="h-8 w-8 text-zinc-400" />
                ) : (
                  <Upload className="h-8 w-8 text-zinc-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-50">
                    {selectedFile ? 'Change file' : 'Click to upload'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    or drag and drop
                  </p>
                </div>
                <p className="text-xs text-zinc-600">
                  PNG, JPG or WebP (max. 5MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
            className="flex-1 bg-[#09090b] text-zinc-50 hover:bg-zinc-900 border-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Avatar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
