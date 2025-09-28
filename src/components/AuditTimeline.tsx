import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, Clock, User, Package } from 'lucide-react';
import { ICInspection } from '@/types/auth';

interface AuditTimelineProps {
  inspections: ICInspection[];
  className?: string;
}

export const AuditTimeline = ({ inspections, className }: AuditTimelineProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authentic': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'fake': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      authentic: 'bg-success text-success-foreground',
      suspicious: 'bg-warning text-warning-foreground',
      fake: 'bg-destructive text-destructive-foreground'
    };
    return variants[status as keyof typeof variants] || 'bg-muted text-muted-foreground';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Audit Timeline</span>
        </CardTitle>
        <CardDescription>
          Chronological view of inspection activities and supervisor reviews
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inspections.map((inspection, index) => (
            <div key={inspection.id} className="relative">
              {/* Timeline line */}
              {index < inspections.length - 1 && (
                <div className="absolute left-6 top-8 w-0.5 h-16 bg-border" />
              )}
              
              <div className="flex space-x-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 border-border flex items-center justify-center">
                  {getStatusIcon(inspection.status)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{inspection.extractedText}</span>
                      <Badge className={getStatusBadge(inspection.status)}>
                        {inspection.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(inspection.timestamp)} at {formatTime(inspection.timestamp)}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{inspection.workerName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="h-3 w-3" />
                        <span>{inspection.batchNumber}</span>
                      </div>
                      <div>
                        <span>{inspection.confidence}% confidence</span>
                      </div>
                    </div>
                    
                    {inspection.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        "{inspection.notes}"
                      </p>
                    )}
                    
                    {inspection.supervisorReview && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Supervisor Review</span>
                          <Badge variant={inspection.supervisorReview.action === 'approved' ? 'default' : 'destructive'}>
                            {inspection.supervisorReview.action}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          By {inspection.supervisorReview.reviewedBy} at{' '}
                          {formatTime(inspection.supervisorReview.reviewedAt)}
                        </p>
                        {inspection.supervisorReview.comments && (
                          <p className="text-muted-foreground italic mt-1">
                            "{inspection.supervisorReview.comments}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};