import { useState } from 'react';
import { mockResources, mockUser } from '@/data/mockData';
import type { Resource } from '@/types';
import AppLayout from '@/components/AppLayout';
import EmptyState from '@/components/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, FolderOpen, Star, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MyUploads = () => {
  const [uploads, setUploads] = useState<Resource[]>(mockResources.filter(r => r.uploadedBy.id === mockUser.id));
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setUploads((prev) => prev.filter((r) => r.id !== id));
    toast({ title: 'Resource deleted' });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Uploads</h1>
            <p className="text-muted-foreground">Manage your shared resources</p>
          </div>
          <Button onClick={() => navigate('/upload')}>Upload New</Button>
        </div>

        {uploads.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-16 w-16" />}
            title="No uploads yet"
            description="Start sharing resources with your campus community."
            action={<Button onClick={() => navigate('/upload')}>Upload Your First Resource</Button>}
          />
        ) : (
          <div className="space-y-3">
            {uploads.map((r) => (
              <Card key={r.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/resources/${r.id}`)}>
                      <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">{r.title}</h3>
                      <p className="text-sm text-muted-foreground">{r.subject}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge variant="secondary" className="text-xs">{r.branch}</Badge>
                        <Badge variant="secondary" className="text-xs">Sem {r.semester}</Badge>
                        <Badge variant="outline" className="text-xs capitalize">{r.type}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" />{r.rating.toFixed(1)}</span>
                        <span className="flex items-center gap-1"><Download className="h-3 w-3" />{r.downloads}</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/resources/${r.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete "{r.title}". This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(r.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyUploads;
