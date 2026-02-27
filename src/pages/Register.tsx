import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockUser } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'];
const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', college: '', branch: '', year: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.length >= 10) s++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) s++;
    if (/\d/.test(pwd)) s++;
    if (/[^a-zA-Z0-9]/.test(pwd)) s++;
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-emerald-500'];
    return { strength: s, label: labels[s - 1] || '', color: colors[s - 1] || '' };
  };

  const passwordStrength = getPasswordStrength(form.password);
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, branch, year, password, confirmPassword, college } = form;

    if (!name || !email || !branch || !year || !password || !college) {
      toast({ title: 'Validation Error', description: 'All fields are required.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Validation Error', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Validation Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newUser = { ...mockUser, name, email, branch, college_name: college, year: parseInt(year) };
    login('mock-token-123', newUser);
    toast({ title: 'Registration Successful', description: `Welcome, ${name}!` });
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join CampusShare to share and discover resources</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} disabled={loading} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@college.edu" value={form.email} onChange={(e) => update('email', e.target.value)} disabled={loading} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College / Institution Name</Label>
              <Input id="college" placeholder="e.g., ABC Engineering College" value={form.college} onChange={(e) => update('college', e.target.value)} disabled={loading} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Branch/Class</Label>
                <Select value={form.branch} onValueChange={(v) => update('branch', v)} disabled={loading}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={form.year} onValueChange={(v) => update('year', v)} disabled={loading}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {years.map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => update('password', e.target.value)} disabled={loading} required minLength={6} />
              {form.password && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${
                      passwordStrength.strength === 1 ? 'w-1/5 bg-red-500' :
                      passwordStrength.strength === 2 ? 'w-2/5 bg-orange-500' :
                      passwordStrength.strength === 3 ? 'w-3/5 bg-yellow-500' :
                      passwordStrength.strength === 4 ? 'w-4/5 bg-green-500' :
                      passwordStrength.strength === 5 ? 'w-full bg-emerald-500' : 'w-0'
                    }`} />
                  </div>
                  <span className={passwordStrength.color}>{passwordStrength.label}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} disabled={loading} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Account
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
