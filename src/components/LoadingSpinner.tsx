import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner = ({ message = 'Loading...', className = '' }: LoadingSpinnerProps) => (
  <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
    <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
    <p className="text-muted-foreground text-sm">{message}</p>
  </div>
);

export default LoadingSpinner;
