import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import type { Resource, Comment } from '@/types';
import AppLayout from '@/components/AppLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Download, Star, Bookmark, Calendar, User, FileText, Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResourceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const [res, cmts] = await Promise.all([api.getResource(id), api.getComments(id)]);
      setResource(res);
      setComments(cmts);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load resource');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleRate = async (rating: number) => {
    if (!id) return;
    setUserRating(rating);
    try {
      await api.rateResource(id, rating);
      toast({ title: `Rated ${rating} stars` });
    } catch { toast({ title: 'Rating failed', variant: 'destructive' }); }
  };

  const handleDownload = async () => {
    if (!id) return;
    try {
      const blob = await api.downloadResource(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource?.fileName || 'resource';
      a.click();
      URL.revokeObjectURL(url);
    } catch { toast({ title: 'Download failed', variant: 'destructive' }); }
  };

  const handleBookmark = async () => {
    if (!id) return;
    try {
      await api.toggleBookmark(id);
      toast({ title: 'Bookmark updated' });
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  const handleComment = async () => {
    if (!id || !newComment.trim()) return;
    setCommentLoading(true);
    try {
      const comment = await api.addComment(id, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment('');
      toast({ title: 'Comment added' });
    } catch (err: unknown) {
      toast({ title: 'Failed to add comment', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <AppLayout><LoadingSpinner message="Loading resource..." /></AppLayout>;
  if (error) return <AppLayout><ErrorMessage message={error} onRetry={fetchData} /></AppLayout>;
  if (!resource) return <AppLayout><ErrorMessage message="Resource not found" /></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Resource Info */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{resource.subject}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleBookmark}>
                  <Bookmark className={`h-4 w-4 ${resource.bookmarked ? 'fill-primary text-primary' : ''}`} />
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">{resource.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{resource.branch}</Badge>
              <Badge variant="secondary">Semester {resource.semester}</Badge>
              <Badge variant="outline" className="capitalize">{resource.type}</Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{resource.uploadedBy?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>{resource.downloads} downloads</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{resource.rating.toFixed(1)} ({resource.ratingCount})</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Rate this resource</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRate(star)} className="p-1 transition-colors">
                    <Star className={`h-6 w-6 ${star <= userRating ? 'fill-primary text-primary' : 'text-border'}`} />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={commentLoading}
                rows={2}
                className="flex-1"
              />
              <Button onClick={handleComment} disabled={commentLoading || !newComment.trim()} size="icon" className="self-end">
                {commentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            {comments.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No comments yet. Be the first!</p>
            ) : (
              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {c.user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-medium text-foreground">{c.user?.name || 'User'}</span>
                      <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-foreground pl-8">{c.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ResourceDetails;
