import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Target, Shield, Star, Trophy, Medal } from 'lucide-react';

interface BadgeSystemProps {
  userStats: {
    totalScans: number;
    authenticCount: number;
    fakeCount: number;
    suspiciousCount: number;
  };
  className?: string;
}

interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  requirement: number;
  currentProgress: number;
  achieved: boolean;
}

export const BadgeSystem = ({ userStats, className }: BadgeSystemProps) => {
  const badges: BadgeConfig[] = [
    {
      id: 'inspector_novice',
      name: 'Novice Inspector',
      description: 'Complete 10 scans',
      icon: Target,
      color: 'text-blue-500',
      requirement: 10,
      currentProgress: userStats.totalScans,
      achieved: userStats.totalScans >= 10
    },
    {
      id: 'inspector_expert',
      name: 'Expert Inspector',
      description: 'Complete 100 scans',
      icon: Award,
      color: 'text-purple-500',
      requirement: 100,
      currentProgress: userStats.totalScans,
      achieved: userStats.totalScans >= 100
    },
    {
      id: 'quality_guardian',
      name: 'Quality Guardian',
      description: 'Verify 50 authentic ICs',
      icon: Shield,
      color: 'text-green-500',
      requirement: 50,
      currentProgress: userStats.authenticCount,
      achieved: userStats.authenticCount >= 50
    },
    {
      id: 'fake_hunter',
      name: 'Fake Hunter',
      description: 'Detect 5 fake ICs',
      icon: Star,
      color: 'text-red-500',
      requirement: 5,
      currentProgress: userStats.fakeCount,
      achieved: userStats.fakeCount >= 5
    },
    {
      id: 'eagle_eye',
      name: 'Eagle Eye',
      description: 'Flag 10 suspicious ICs',
      icon: Trophy,
      color: 'text-yellow-500',
      requirement: 10,
      currentProgress: userStats.suspiciousCount,
      achieved: userStats.suspiciousCount >= 10
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Achieve 90%+ accuracy rate',
      icon: Medal,
      color: 'text-gold-500',
      requirement: 90,
      currentProgress: userStats.totalScans > 0 ? Math.round((userStats.authenticCount / userStats.totalScans) * 100) : 0,
      achieved: userStats.totalScans > 0 && (userStats.authenticCount / userStats.totalScans) >= 0.9
    }
  ];

  const achievedBadges = badges.filter(badge => badge.achieved);
  const inProgressBadges = badges.filter(badge => !badge.achieved);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-primary" />
          <span>Achievement Badges</span>
        </CardTitle>
        <CardDescription>
          Unlock badges by completing inspections and maintaining quality standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Achieved Badges */}
          {achievedBadges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Earned Badges ({achievedBadges.length})</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {achievedBadges.map((badge) => {
                  const IconComponent = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 text-center"
                    >
                      <div className="mb-2">
                        <IconComponent className={`h-8 w-8 mx-auto ${badge.color}`} />
                      </div>
                      <div className="text-xs font-medium">{badge.name}</div>
                      <Badge variant="default" className="mt-1 text-xs">
                        Achieved!
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* In Progress Badges */}
          {inProgressBadges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>In Progress ({inProgressBadges.length})</span>
              </h3>
              <div className="space-y-3">
                {inProgressBadges.map((badge) => {
                  const IconComponent = badge.icon;
                  const progressPercentage = Math.min((badge.currentProgress / badge.requirement) * 100, 100);
                  
                  return (
                    <div
                      key={badge.id}
                      className="p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <IconComponent className={`h-6 w-6 ${badge.color} opacity-60`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{badge.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {badge.currentProgress}/{badge.requirement}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {badge.description}
                          </p>
                          <Progress value={progressPercentage} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="pt-3 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">{achievedBadges.length}</div>
                <div className="text-xs text-muted-foreground">Badges Earned</div>
              </div>
              <div>
                <div className="text-lg font-bold text-muted-foreground">{badges.length}</div>
                <div className="text-xs text-muted-foreground">Total Badges</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};