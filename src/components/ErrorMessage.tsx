import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <AlertCircle className="h-12 w-12 text-destructive mb-3" />
    <p className="text-foreground font-medium mb-1">Something went wrong</p>
    <p className="text-muted-foreground text-sm mb-4">{message}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);

export default ErrorMessage;
