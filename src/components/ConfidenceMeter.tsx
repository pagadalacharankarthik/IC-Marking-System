import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number;
  status: 'authentic' | 'suspicious' | 'fake';
  className?: string;
}

export const ConfidenceMeter = ({ confidence, status, className }: ConfidenceMeterProps) => {
  const getConfidenceColor = () => {
    if (confidence >= 85) return 'bg-success';
    if (confidence >= 70) return 'bg-warning';
    return 'bg-destructive';
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'authentic': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'fake': return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getConfidenceText = () => {
    if (confidence >= 85) return 'High Confidence';
    if (confidence >= 70) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">OCR Confidence</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {confidence}%
        </Badge>
      </div>
      <Progress 
        value={confidence} 
        className="h-2"
        style={{
          ['--progress-background' as any]: `hsl(var(--${getConfidenceColor().replace('bg-', '')}))`
        }}
      />
      <p className="text-xs text-muted-foreground">{getConfidenceText()}</p>
    </div>
  );
};