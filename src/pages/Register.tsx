import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { registerUser } from '@/services/authService';
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
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    branch: '', 
    year: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, branch, year, password, confirmPassword } = form;

    // Validation
    if (!name || !email || !branch || !year || !password) {
      toast({ 
        title: 'Validation Error', 
        description: 'All fields are required.', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (password.length < 6) {
      toast({ 
        title: 'Validation Error', 
        description: 'Password must be at least 6 characters.', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({ 
        title: 'Validation Error', 
        description: 'Passwords do not match.', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name,
        email,
        password,
        college_id: 1, // Default college - you can add a college selector later
        class_name: branch, // Map branch to class_name
        year: parseInt(year), // Map year to year
      });

      if (response.success && response.data) {
        // Auto-login after successful registration
        login(response.data.token, response.data.user);
        toast({ 
          title: 'Registration Successful', 
          description: `Welcome, ${response.data.user.name}!` 
        });
        navigate('/dashboard');
      } else {
        // Handle API error response
        let errorMessage = response.error || 'Registration failed';
        
        // Check for validation errors
        if (response.errors && response.errors.length > 0) {
          errorMessage = response.errors.map(err => err.msg).join(', ');
        }
        
        toast({ 
          title: 'Registration Failed', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({ 
        title: 'Error', 
        description: 'Unable to connect to server. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
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
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={form.name} 
                onChange={(e) => update('name', e.target.value)} 
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@college.edu" 
                value={form.email} 
                onChange={(e) => update('email', e.target.value)} 
                disabled={loading}
                required
              />
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
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={(e) => update('password', e.target.value)} 
                disabled={loading}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                value={form.confirmPassword} 
                onChange={(e) => update('confirmPassword', e.target.value)} 
                disabled={loading}
                required
              />
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
