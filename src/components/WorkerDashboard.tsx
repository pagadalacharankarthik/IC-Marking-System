import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Bluetooth,
  Usb
} from 'lucide-react';
import { DUMMY_INSPECTIONS, DUMMY_OEM_DATABASE } from '@/data/dummyData';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export const WorkerDashboard = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [batchNumber, setBatchNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const simulateOCR = async () => {
    if (!selectedFile || !batchNumber) {
      toast({
        title: "Missing Information",
        description: "Please select an image and enter batch number",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random OCR result
    const icTypes = Object.keys(DUMMY_OEM_DATABASE);
    const randomIC = icTypes[Math.floor(Math.random() * icTypes.length)];
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
    
    let status: 'authentic' | 'suspicious' | 'fake';
    if (confidence >= 85) status = 'authentic';
    else if (confidence >= 70) status = 'suspicious';
    else status = 'fake';

    const result = {
      id: Date.now().toString(),
      extractedText: randomIC,
      status,
      confidence,
      batchNumber,
      notes,
      timestamp: new Date()
    };

    setLastResult(result);
    setIsProcessing(false);

    // Show result notification
    const statusColors = {
      authentic: 'bg-success text-success-foreground',
      suspicious: 'bg-warning text-warning-foreground',
      fake: 'bg-destructive text-destructive-foreground'
    };

    toast({
      title: `IC ${status.toUpperCase()}`,
      description: `Confidence: ${confidence}% | IC: ${randomIC}`,
    });

    // Reset form
    setSelectedFile(null);
    setBatchNumber('');
    setNotes('');
  };

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

  const workerInspections = DUMMY_INSPECTIONS.filter(
    inspection => inspection.workerEmail === user?.email
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user?.fullName}</CardTitle>
          <CardDescription>
            Upload IC images for marking verification and quality control
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>IC Image Upload</span>
            </CardTitle>
            <CardDescription>
              Capture or upload IC images for automated marking analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ic-image">IC Image</Label>
              <div className="flex gap-2">
                <Input
                  id="ic-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" disabled>
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-number">Batch Number</Label>
              <Input
                id="batch-number"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g., BATCH-2024-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any observations about the IC condition..."
                rows={3}
              />
            </div>

            <Button 
              onClick={simulateOCR} 
              disabled={isProcessing || !selectedFile || !batchNumber}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Analyze IC Marking'}
            </Button>

            {lastResult && (
              <Alert className="mt-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(lastResult.status)}
                  <AlertDescription>
                    <strong>Result:</strong> {lastResult.extractedText} - {' '}
                    <Badge className={getStatusBadge(lastResult.status)}>
                      {lastResult.status.toUpperCase()}
                    </Badge>
                    {' '}({lastResult.confidence}% confidence)
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Device Connection Section */}
        <Card>
          <CardHeader>
            <CardTitle>Device Connectivity</CardTitle>
            <CardDescription>
              Connect external inspection equipment for enhanced analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center space-x-4">
                <div className="p-4 rounded-lg bg-muted">
                  <Bluetooth className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <Usb className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Bluetooth & USB-C device integration for real-time inspection data
                </p>
              </div>
              <Button disabled variant="outline">
                Connect Device
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inspections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inspections</CardTitle>
          <CardDescription>Your latest IC marking verification results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workerInspections.map((inspection) => (
              <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(inspection.status)}
                  <div>
                    <p className="font-medium text-sm">{inspection.extractedText}</p>
                    <p className="text-xs text-muted-foreground">
                      {inspection.batchNumber} • {inspection.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusBadge(inspection.status)}>
                    {inspection.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {inspection.confidence}% confidence
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};