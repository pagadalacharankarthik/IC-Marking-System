import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Check } from 'lucide-react';

interface QRCodeGeneratorProps {
  inspection: {
    id: string;
    extractedText: string;
    status: 'authentic' | 'suspicious' | 'fake';
    batchNumber: string;
    confidence: number;
    timestamp: Date;
  };
  className?: string;
}

export const QRCodeGenerator = ({ inspection, className }: QRCodeGeneratorProps) => {
  const [isGenerated, setIsGenerated] = useState(false);

  const generateQRCode = () => {
    setIsGenerated(true);
  };

  const downloadQRCode = () => {
    // Create a simple text file with QR data
    const qrData = {
      id: inspection.id,
      ic: inspection.extractedText,
      status: inspection.status,
      batch: inspection.batchNumber,
      confidence: inspection.confidence,
      verified: inspection.timestamp.toISOString(),
      verificationUrl: `https://ic-verification.system/verify/${inspection.id}`
    };

    const content = `IC VERIFICATION QR CODE DATA
    
ID: ${qrData.id}
IC Part: ${qrData.ic}
Status: ${qrData.status.toUpperCase()}
Batch: ${qrData.batch}
Confidence: ${qrData.confidence}%
Verified: ${qrData.verified}

Verification URL: ${qrData.verificationUrl}

This QR code certifies that the integrated circuit has been inspected 
by the IC Marking Inspection System and meets quality standards.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_${inspection.extractedText}_${inspection.batchNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authentic': return 'border-success';
      case 'suspicious': return 'border-warning';
      case 'fake': return 'border-destructive';
      default: return 'border-muted';
    }
  };

  const isVerifiable = inspection.status === 'authentic' && inspection.confidence >= 80;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5 text-primary" />
          <span>QR Code Tagging</span>
        </CardTitle>
        <CardDescription>
          Generate QR codes for verified ICs to enable traceability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* IC Information */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{inspection.extractedText}</span>
              <Badge variant={inspection.status === 'authentic' ? 'default' : 'destructive'}>
                {inspection.status.toUpperCase()}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Batch: {inspection.batchNumber}</div>
              <div>Confidence: {inspection.confidence}%</div>
              <div>Verified: {inspection.timestamp.toLocaleDateString()}</div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="text-center">
            {!isGenerated ? (
              <div className="p-8 border-2 border-dashed border-muted rounded-lg">
                <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  {isVerifiable 
                    ? 'Generate QR code for this verified IC'
                    : 'QR codes only available for authentic ICs with 80%+ confidence'
                  }
                </p>
                <Button 
                  onClick={generateQRCode}
                  disabled={!isVerifiable}
                  variant={isVerifiable ? 'default' : 'outline'}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Simulated QR Code */}
                <div className={`w-40 h-40 mx-auto border-2 ${getStatusColor(inspection.status)} rounded-lg bg-white flex flex-col items-center justify-center`}>
                  <div className="grid grid-cols-8 gap-0.5 w-32 h-32">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-full h-full ${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Verified IC</span>
                </div>

                {/* QR Code Info */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>ID: {inspection.id}</div>
                  <div>Verification URL: ic-verification.system/verify/{inspection.id}</div>
                </div>

                {/* Download Button */}
                <Button variant="outline" onClick={downloadQRCode} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Data
                </Button>
              </div>
            )}
          </div>

          {/* QR Code Benefits */}
          <div className="pt-3 border-t text-xs text-muted-foreground">
            <div className="space-y-1">
              <div>✓ Instant verification status</div>
              <div>✓ ERP system integration ready</div>
              <div>✓ Supply chain traceability</div>
              <div>✓ Counterfeit prevention</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};