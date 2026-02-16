import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, Loader2, FileUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
const resourceTypes = ['notes', 'paper', 'assignment', 'book', 'other'];

const UploadResource = () => {
  const [form, setForm] = useState({ title: '', subject: '', branch: '', semester: '', type: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, subject, branch, semester, type, description } = form;

    if (!title || !subject || !branch || !semester || !type || !file) {
      toast({ title: 'Validation Error', description: 'Please fill all required fields and select a file.', variant: 'destructive' });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('branch', branch);
    formData.append('semester', semester);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('file', file);

    setLoading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 300);

    try {
      await api.uploadResource(formData);
      setProgress(100);
      clearInterval(interval);
      toast({ title: 'Upload Successful', description: 'Your resource has been shared!' });
      navigate('/my-uploads');
    } catch (err: unknown) {
      clearInterval(interval);
      setProgress(0);
      toast({
        title: 'Upload Failed',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-5 w-5 text-primary" /> Upload Resource
            </CardTitle>
            <CardDescription>Share your study materials with the campus community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="e.g., Data Structures Notes Unit 1" value={form.title} onChange={(e) => update('title', e.target.value)} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" placeholder="e.g., Data Structures & Algorithms" value={form.subject} onChange={(e) => update('subject', e.target.value)} disabled={loading} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Branch *</Label>
                  <Select value={form.branch} onValueChange={(v) => update('branch', v)} disabled={loading}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester *</Label>
                  <Select value={form.semester} onValueChange={(v) => update('semester', v)} disabled={loading}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {semesters.map((s) => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={form.type} onValueChange={(v) => update('type', v)} disabled={loading}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Brief description of the resource..." value={form.description} onChange={(e) => update('description', e.target.value)} disabled={loading} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>File *</Label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : 'Click to select a file'}
                  </p>
                  {file && <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
                </div>
                <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>

              {loading && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">{progress}% uploaded</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UploadIcon className="h-4 w-4 mr-2" />}
                {loading ? 'Uploading...' : 'Upload Resource'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UploadResource;
