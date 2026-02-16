import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types';
import AppLayout from '@/components/AppLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserIcon, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

const Profile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', branch: '', semester: '' });
  const { updateUser } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getProfile();
      setProfile(res);
      setForm({ name: res.name, email: res.email, branch: res.branch, semester: res.semester.toString() });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        name: form.name,
        branch: form.branch,
        semester: parseInt(form.semester),
      });
      setProfile(updated);
      updateUser(updated);
      toast({ title: 'Profile updated!' });
    } catch (err: unknown) {
      toast({ title: 'Update failed', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppLayout><LoadingSpinner message="Loading profile..." /></AppLayout>;
  if (error) return <AppLayout><ErrorMessage message={error} onRetry={fetchProfile} /></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="border-border">
          <CardContent className="flex items-center gap-5 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
              {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{profile?.name}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              <p className="text-sm text-muted-foreground">{profile?.branch} • Semester {profile?.semester}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-bold text-primary">{profile?.contributionPoints ?? 0}</p>
              <p className="text-xs text-muted-foreground">Contribution Points</p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" /> Edit Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} disabled={saving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={form.email} disabled className="opacity-60" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select value={form.branch} onValueChange={(v) => setForm((p) => ({ ...p, branch: v }))} disabled={saving}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={form.semester} onValueChange={(v) => setForm((p) => ({ ...p, semester: v }))} disabled={saving}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{semesters.map((s) => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
