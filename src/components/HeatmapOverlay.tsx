import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Eye, EyeOff } from 'lucide-react';

interface HeatmapOverlayProps {
  status: 'authentic' | 'suspicious' | 'fake';
  confidence: number;
  className?: string;
}

export const HeatmapOverlay = ({ status, confidence, className }: HeatmapOverlayProps) => {
  const [showHeatmap, setShowHeatmap] = useState(true);

  const getHeatmapIntensity = () => {
    if (status === 'fake') return 'high';
    if (status === 'suspicious') return 'medium';
    return 'low';
  };

  const getDefectAreas = () => {
    const intensity = getHeatmapIntensity();
    
    if (intensity === 'high') {
      return [
        { x: 25, y: 30, size: 'large', severity: 'high' },
        { x: 60, y: 45, size: 'medium', severity: 'high' },
        { x: 40, y: 60, size: 'small', severity: 'medium' }
      ];
    } else if (intensity === 'medium') {
      return [
        { x: 45, y: 40, size: 'medium', severity: 'medium' },
        { x: 65, y: 55, size: 'small', severity: 'low' }
      ];
    } else {
      return [
        { x: 50, y: 45, size: 'small', severity: 'low' }
      ];
    }
  };

  const defectAreas = getDefectAreas();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/70';
      case 'medium': return 'bg-yellow-500/70';
      case 'low': return 'bg-green-500/70';
      default: return 'bg-blue-500/70';
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'large': return 'w-8 h-8';
      case 'medium': return 'w-6 h-6';
      case 'small': return 'w-4 h-4';
      default: return 'w-4 h-4';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">AI Defect Analysis</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            {showHeatmap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          Advanced AI inspection showing potential defect areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Display */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-40 flex items-center justify-center relative">
              <span className="text-gray-500 text-sm">IC Marking Area</span>
              
              {/* Defect Overlays */}
              {showHeatmap && defectAreas.map((area, index) => (
                <div
                  key={index}
                  className={`absolute rounded-full ${getSeverityColor(area.severity)} ${getSizeClass(area.size)} animate-pulse`}
                  style={{
                    left: `${area.x}%`,
                    top: `${area.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
              
              {/* Scanning grid overlay */}
              {showHeatmap && (
                <div className="absolute inset-0 opacity-30">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-blue-300/50" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Defect Detection</span>
              <Badge variant={status === 'authentic' ? 'default' : 'destructive'}>
                {defectAreas.length} area{defectAreas.length !== 1 ? 's' : ''} flagged
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1" />
                <div className="font-medium">High Risk</div>
                <div className="text-muted-foreground">
                  {defectAreas.filter(a => a.severity === 'high').length}
                </div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1" />
                <div className="font-medium">Medium Risk</div>
                <div className="text-muted-foreground">
                  {defectAreas.filter(a => a.severity === 'medium').length}
                </div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1" />
                <div className="font-medium">Low Risk</div>
                <div className="text-muted-foreground">
                  {defectAreas.filter(a => a.severity === 'low').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};