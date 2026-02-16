import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockDashboardData } from '@/data/mockData';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
import EmptyState from '@/components/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Upload, TrendingUp, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [data] = useState(mockDashboardData);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownload = (id: string) => {
    toast({ title: 'Download started', description: `Downloading resource ${id}` });
  };

  const handleBookmark = (id: string) => {
    toast({ title: 'Bookmark updated', description: `Resource ${id} bookmarked` });
  };

  const recentActivity = data.recentUploads.slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-muted-foreground">Here's your academic activity overview.</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contribution Points</p>
                <p className="text-2xl font-bold text-foreground">{data.contributionPoints}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Uploads</p>
                <p className="text-2xl font-bold text-foreground">{data.recentUploads.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => navigate('/upload')}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quick Action</p>
                <p className="text-lg font-semibold text-primary">Upload Resource</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Uploads */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Recent Uploads
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/my-uploads')}>View All</Button>
          </CardHeader>
          <CardContent>
            {data.recentUploads.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {data.recentUploads.slice(0, 4).map((r) => (
                  <ResourceCard key={r.id} resource={r} onDownload={handleDownload} onBookmark={handleBookmark} />
                ))}
              </div>
            ) : (
              <EmptyState title="No uploads yet" description="Share your first resource with the campus!" action={<Button onClick={() => navigate('/upload')}>Upload Now</Button>} />
            )}
          </CardContent>
        </Card>

        {/* Recent Activity & Trending */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <EmptyState
                    title="No recent activity"
                    description="Your uploads, downloads and interactions will appear here."
                  />
                ) : (
                  <ul className="space-y-3 text-sm">
                    {recentActivity.map((item) => (
                      <li key={item.id} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">Uploaded {item.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Trending Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.trendingResources.length ? (
                <div className="grid gap-4 md:grid-cols-1">
                  {data.trendingResources.slice(0, 4).map((r) => (
                    <ResourceCard key={r.id} resource={r} onDownload={handleDownload} onBookmark={handleBookmark} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No trending resources" description="Resources will appear here as they gain popularity." />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
