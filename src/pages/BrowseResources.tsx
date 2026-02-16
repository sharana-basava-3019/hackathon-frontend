import { useState, useMemo } from 'react';
import { mockResources } from '@/data/mockData';
import type { Resource } from '@/types';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
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
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const [semester, setSemester] = useState('All');
  const [type, setType] = useState('All');
  const [sort, setSort] = useState('latest');
  const { toast } = useToast();

  const filtered = useMemo(() => {
    let result = [...mockResources];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    if (branch !== 'All') result = result.filter(r => r.branch === branch);
    if (semester !== 'All') result = result.filter(r => r.semester === parseInt(semester));
    if (type !== 'All') result = result.filter(r => r.type === type);
    if (sort === 'downloads') result.sort((a, b) => b.downloads - a.downloads);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [search, branch, semester, type, sort]);

  const handleDownload = (id: string) => {
    toast({ title: 'Download started', description: `Downloading resource ${id}` });
  };

  const handleBookmark = (id: string) => {
    toast({ title: 'Bookmark updated', description: `Resource ${id} bookmarked` });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Browse Resources</h1>
          <p className="text-muted-foreground">Discover study materials shared by the community</p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resources..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Branch" /></SelectTrigger>
              <SelectContent>{branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Semester" /></SelectTrigger>
              <SelectContent>{semesters.map((s) => <SelectItem key={s} value={s}>{s === 'All' ? 'All Sems' : `Sem ${s}`}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>{types.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>{sortOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No resources found" description="Try adjusting your filters or search query." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <ResourceCard key={r.id} resource={r} onDownload={handleDownload} onBookmark={handleBookmark} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BrowseResources;
