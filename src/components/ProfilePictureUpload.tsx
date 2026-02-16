import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploadProps {
  currentPicture?: string | null;
  userName: string;
  onUpload?: (file: File) => Promise<void>;
  disabled?: boolean;
}

const ProfilePictureUpload = ({ 
  currentPicture, 
  userName, 
  onUpload,
  disabled = false 
}: ProfilePictureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file (JPG, PNG, etc.)',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image must be smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload if handler provided
    if (onUpload) {
      setUploading(true);
      try {
        await onUpload(file);
        toast({
          title: 'Success',
          description: 'Profile picture updated'
        });
      } catch (error) {
        toast({
          title: 'Upload Failed',
          description: 'Failed to upload profile picture',
          variant: 'destructive'
        });
        setPreviewUrl(currentPicture || null);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={previewUrl || undefined} alt={userName} />
          <AvatarFallback className="text-4xl bg-primary/10 text-primary">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-md"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{userName}</p>
        <p className="text-xs text-muted-foreground">
          {uploading ? 'Uploading...' : 'Click camera icon to change picture'}
        </p>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
