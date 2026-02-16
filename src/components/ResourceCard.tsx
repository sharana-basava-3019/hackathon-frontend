import { FileText, Download, Bookmark, Star, BookOpen, FileQuestion, ClipboardList, BookMarked } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Resource } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  notes: <BookOpen className="h-5 w-5" />,
  paper: <ClipboardList className="h-5 w-5" />,
  book: <BookMarked className="h-5 w-5" />,
  assignment: <FileText className="h-5 w-5" />,
  other: <FileQuestion className="h-5 w-5" />,
};

interface ResourceCardProps {
  resource: Resource;
  onDownload?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onRate?: (id: string, rating: number) => void;
}

const ResourceCard = ({ resource, onDownload, onBookmark }: ResourceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-md border-border bg-card" onClick={() => navigate(`/resources/${resource.id}`)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {typeIcons[resource.type] || typeIcons.other}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">{resource.subject}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{resource.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <Badge variant="secondary" className="text-xs">{resource.branch}</Badge>
          <Badge variant="secondary" className="text-xs">Sem {resource.semester}</Badge>
          <Badge variant="outline" className="text-xs capitalize">{resource.type}</Badge>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {resource.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {resource.downloads}
            </span>
          </div>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onBookmark?.(resource.id)}
            >
              <Bookmark className={`h-4 w-4 ${resource.bookmarked ? 'fill-primary text-primary' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDownload?.(resource.id)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
