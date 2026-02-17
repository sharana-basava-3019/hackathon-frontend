import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword, verifyResetToken } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Loader2, Eye, EyeOff, CheckCircle, XCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { toast } = useToast();

  const token = searchParams.get('token');

  // Password strength checker
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-emerald-500'];
    return { strength, label: labels[strength - 1] || '', color: colors[strength - 1] || '' };
  };

  const passwordStrength = getPasswordStrength(password);

  // Verify token on mount
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setVerifying(false);
        setTokenValid(false);
        toast({
          title: 'Invalid Link',
          description: 'No reset token found in URL.',
          variant: 'destructive'
        });
        return;
      }

      try {
        const response = await verifyResetToken(token);
        if (response.success) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          toast({
            title: 'Invalid or Expired Link',
            description: response.error || 'This reset link is no longer valid.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
        toast({
          title: 'Error',
          description: 'Unable to verify reset link.',
          variant: 'destructive'
        });
      } finally {
        setVerifying(false);
      }
    };

    checkToken();
  }, [token, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!password.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a new password.',
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

    if (!token) {
      toast({
        title: 'Error',
        description: 'Invalid reset token.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({ token, newPassword: password });

      if (response.success) {
        setResetSuccess(true);
        toast({
          title: 'Password Reset Successful!',
          description: 'You can now login with your new password.'
        });
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast({
          title: 'Reset Failed',
          description: response.error || 'Unable to reset password.',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: 'Unable to connect to server. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md border-border">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive">
                Password reset links expire after 1 hour for security reasons.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/forgot-password">Request New Reset Link</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Back to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Password Reset Complete!</CardTitle>
            <CardDescription>
              Your password has been successfully reset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-500/50 bg-green-500/10">
              <AlertDescription className="text-green-600 dark:text-green-400">
                You can now login with your new password. Redirecting to login page...
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {password && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.strength === 1 ? 'w-1/5 bg-red-500' :
                        passwordStrength.strength === 2 ? 'w-2/5 bg-orange-500' :
                        passwordStrength.strength === 3 ? 'w-3/5 bg-yellow-500' :
                        passwordStrength.strength === 4 ? 'w-4/5 bg-green-500' :
                        passwordStrength.strength === 5 ? 'w-full bg-emerald-500' : 'w-0'
                      }`}
                    />
                  </div>
                  <span className={passwordStrength.color}>{passwordStrength.label}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-2 text-xs">
                  {password === confirmPassword ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Reset Password
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
