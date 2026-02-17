import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please enter your email address.', 
        variant: 'destructive' 
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please enter a valid email address.', 
        variant: 'destructive' 
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await requestPasswordReset({ email });
      
      if (response.success) {
        setEmailSent(true);
        toast({ 
          title: 'Email Sent!', 
          description: 'Check your inbox for password reset instructions.' 
        });
      } else {
        toast({ 
          title: 'Request Failed', 
          description: response.error || 'Unable to process request.', 
          variant: 'destructive' 
        });
      }
    } catch (error: any) {
      console.error('Password reset request error:', error);
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>
            {emailSent 
              ? "We've sent you reset instructions" 
              : "Enter your email to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <div className="space-y-4">
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-600 dark:text-green-400">
                  Password reset instructions have been sent to <strong>{email}</strong>. 
                  Please check your inbox and follow the link to reset your password.
                </AlertDescription>
              </Alert>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Check your spam folder if you don't see the email within a few minutes.</span>
                </p>
              </div>
              <div className="pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  Try Another Email
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@college.edu" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={loading}
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Enter the email address associated with your account.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
