import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';

interface BatchData {
  batchNumber: string;
  totalICs: number;
  authenticCount: number;
  suspiciousCount: number;
  fakeCount: number;
  healthScore: number;
  trend: 'up' | 'down' | 'stable';
  lastInspection: Date;
}

interface BatchHealthScoreProps {
  className?: string;
}

export const BatchHealthScore = ({ className }: BatchHealthScoreProps) => {
  // Generate dummy batch data
  const batches: BatchData[] = [
    {
      batchNumber: 'BATCH-2024-001',
      totalICs: 25,
      authenticCount: 23,
      suspiciousCount: 2,
      fakeCount: 0,
      healthScore: 92,
      trend: 'up',
      lastInspection: new Date('2024-01-20T14:30:00')
    },
    {
      batchNumber: 'BATCH-2024-002',
      totalICs: 18,
      authenticCount: 12,
      suspiciousCount: 4,
      fakeCount: 2,
      healthScore: 67,
      trend: 'down',
      lastInspection: new Date('2024-01-20T12:15:00')
    },
    {
      batchNumber: 'BATCH-2024-003',
      totalICs: 30,
      authenticCount: 26,
      suspiciousCount: 3,
      fakeCount: 1,
      healthScore: 87,
      trend: 'stable',
      lastInspection: new Date('2024-01-20T10:45:00')
    },
    {
      batchNumber: 'BATCH-2024-004',
      totalICs: 22,
      authenticCount: 20,
      suspiciousCount: 2,
      fakeCount: 0,
      healthScore: 91,
      trend: 'up',
      lastInspection: new Date('2024-01-20T09:20:00')
    },
    {
      batchNumber: 'BATCH-2024-005',
      totalICs: 15,
      authenticCount: 8,
      suspiciousCount: 5,
      fakeCount: 2,
      healthScore: 53,
      trend: 'down',
      lastInspection: new Date('2024-01-19T16:30:00')
    }
  ];

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 85) return 'bg-success';
    if (score >= 70) return 'bg-warning';
    return 'bg-destructive';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <div className="h-4 w-4" />; // Stable - no icon
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const overallHealthScore = Math.round(
    batches.reduce((sum, batch) => sum + batch.healthScore, 0) / batches.length
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-primary" />
          <span>Batch Quality Index</span>
        </CardTitle>
        <CardDescription>
          Quality health scores for each batch based on authentic vs flagged ratio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
            <div className="mb-2">
              <span className="text-3xl font-bold text-primary">{overallHealthScore}</span>
              <span className="text-sm text-muted-foreground ml-1">/ 100</span>
            </div>
            <div className="text-sm font-medium">Overall Batch Health</div>
            <div className="text-xs text-muted-foreground">
              {getHealthScoreLabel(overallHealthScore)} Quality Rating
            </div>
          </div>

          {/* Individual Batches */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Individual Batch Scores</h3>
            {batches.map((batch) => (
              <div key={batch.batchNumber} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{batch.batchNumber}</span>
                    {batch.healthScore < 70 && (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(batch.trend)}
                    <Badge 
                      variant="outline" 
                      className={`${getHealthScoreColor(batch.healthScore)} border-current`}
                    >
                      {batch.healthScore}%
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress 
                    value={batch.healthScore} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex space-x-4">
                      <span>✅ {batch.authenticCount}</span>
                      <span>⚠️ {batch.suspiciousCount}</span>
                      <span>❌ {batch.fakeCount}</span>
                    </div>
                    <span>{formatTime(batch.lastInspection)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="w-3 h-3 bg-success rounded mx-auto mb-1" />
                <div>Excellent (85+)</div>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-warning rounded mx-auto mb-1" />
                <div>Good (70-84)</div>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-destructive rounded mx-auto mb-1" />
                <div>Needs Review (&lt;70)</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};