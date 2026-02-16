import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import type { Resource, ResourceFilters } from '@/types';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const branches = ['All', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'];
const semesters = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];
const types = ['All', 'notes', 'paper', 'assignment', 'book', 'other'];
const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'rating', label: 'Highest Rated' },
];

const BrowseResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ResourceFilters>({ sort: 'latest' });
  const { toast } = useToast();

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: ResourceFilters = { ...filters };
      if (search.trim()) params.search = search.trim();
      const res = await api.getResources(params);
      setResources(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  useEffect(() => {
    const timer = setTimeout(fetchResources, 300);
    return () => clearTimeout(timer);
  }, [fetchResources]);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === 'All' ? undefined : value }));
  };

  const handleDownload = async (id: string) => {
    try {
      const blob = await api.downloadResource(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resource';
      a.click();
      URL.revokeObjectURL(url);
    } catch { toast({ title: 'Download failed', variant: 'destructive' }); }
  };

  const handleBookmark = async (id: string) => {
    try {
      await api.toggleBookmark(id);
      toast({ title: 'Bookmark updated' });
    } catch { toast({ title: 'Failed to bookmark', variant: 'destructive' }); }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Browse Resources</h1>
          <p className="text-muted-foreground">Discover study materials shared by the community</p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <Select value={filters.branch || 'All'} onValueChange={(v) => updateFilter('branch', v)}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Branch" /></SelectTrigger>
              <SelectContent>{branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.semester || 'All'} onValueChange={(v) => updateFilter('semester', v)}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Semester" /></SelectTrigger>
              <SelectContent>{semesters.map((s) => <SelectItem key={s} value={s}>{s === 'All' ? 'All Sems' : `Sem ${s}`}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.type || 'All'} onValueChange={(v) => updateFilter('type', v)}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>{types.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.sort || 'latest'} onValueChange={(v) => updateFilter('sort', v)}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>{sortOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner message="Searching resources..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchResources} />
        ) : resources.length === 0 ? (
          <EmptyState title="No resources found" description="Try adjusting your filters or search query." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} onDownload={handleDownload} onBookmark={handleBookmark} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BrowseResources;
