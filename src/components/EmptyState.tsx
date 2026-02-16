import { FileX } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 text-muted-foreground">
      {icon || <FileX className="h-16 w-16" />}
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
    {description && <p className="text-muted-foreground text-sm max-w-md">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
