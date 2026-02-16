import { mockLeaderboard } from '@/data/mockData';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

const rankIcons: Record<number, React.ReactNode> = {
  1: <Trophy className="h-6 w-6 text-primary" />,
  2: <Medal className="h-6 w-6 text-muted-foreground" />,
  3: <Award className="h-6 w-6 text-accent-foreground" />,
};

const Leaderboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">Top contributors in the campus community</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {mockLeaderboard.map((entry) => (
                <div key={entry.user.id} className={`flex items-center gap-4 px-6 py-4 ${entry.rank <= 3 ? 'bg-primary/5' : ''}`}>
                  <div className="flex h-10 w-10 items-center justify-center shrink-0">
                    {rankIcons[entry.rank] || <span className="text-lg font-bold text-muted-foreground">#{entry.rank}</span>}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                    {entry.user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{entry.user.name}</p>
                    <p className="text-sm text-muted-foreground">{entry.user.branch} • Sem {entry.user.semester}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-primary">{entry.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
