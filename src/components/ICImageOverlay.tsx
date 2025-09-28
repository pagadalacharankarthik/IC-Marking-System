import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface ICImageOverlayProps {
  imageUrl: string;
  extractedText: string;
  confidence: number;
  className?: string;
}

export const ICImageOverlay = ({ imageUrl, extractedText, confidence, className }: ICImageOverlayProps) => {
  const [showOverlay, setShowOverlay] = useState(true);

  // Simulate character positions and confidence for each character
  const characters = extractedText.split('').map((char, index) => ({
    char,
    x: 20 + (index * 15), // Simulated x position
    y: 50, // Simulated y position
    confidence: Math.max(40, confidence + Math.random() * 20 - 10) // Vary confidence per character
  }));

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">IC Marking Analysis</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOverlay(!showOverlay)}
            >
              {showOverlay ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showOverlay ? 'Hide' : 'Show'} Overlay
            </Button>
          </div>
          
          <div className="relative bg-muted rounded-lg overflow-hidden">
            {/* Placeholder IC image */}
            <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
              <span className="text-gray-600 text-sm">IC Image Preview</span>
            </div>
            
            {/* OCR Overlay */}
            {showOverlay && (
              <div className="absolute inset-0">
                {/* Highlight area */}
                <div 
                  className="absolute border-2 border-primary bg-primary/10 rounded" 
                  style={{
                    left: '15%',
                    top: '40%',
                    width: '70%',
                    height: '20%'
                  }}
                />
                
                {/* Character overlays */}
                {characters.map((char, index) => (
                  <div
                    key={index}
                    className={`absolute text-xs font-mono px-1 rounded ${
                      char.confidence < 60 
                        ? 'bg-destructive text-destructive-foreground' 
                        : char.confidence < 80
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-success text-success-foreground'
                    }`}
                    style={{
                      left: `${char.x}%`,
                      top: `${char.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {char.char}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Extracted: <span className="font-mono">{extractedText}</span></p>
            <p>Green: High confidence, Yellow: Medium, Red: Low confidence</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};