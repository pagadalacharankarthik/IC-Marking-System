import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  Check,
  X
} from 'lucide-react';
import { DUMMY_INSPECTIONS, getDashboardStats } from '@/data/dummyData';
import { ICInspection } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { MultiDeviceHandoff } from '@/components/MultiDeviceHandoff';

export const SupervisorDashboard = () => {
  const [selectedInspection, setSelectedInspection] = useState<ICInspection | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = getDashboardStats();

  const filteredInspections = DUMMY_INSPECTIONS.filter(inspection => {
    const matchesSearch = 
      inspection.extractedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || inspection.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const pendingReviews = DUMMY_INSPECTIONS.filter(
    inspection => inspection.status === 'suspicious' && !inspection.supervisorReview
  );

  const handleReview = (action: 'approved' | 'rejected') => {
    if (!selectedInspection) return;

    toast({
      title: `Inspection ${action}`,
      description: `IC ${selectedInspection.extractedText} has been ${action}`,
    });

    setSelectedInspection(null);
    setReviewComments('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authentic': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'fake': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return null;
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

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with Dark Mode Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Supervisor Dashboard</h1>
        <DarkModeToggle />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Reviews"
          value={stats.pendingReview}
          icon={AlertTriangle}
          color="text-warning"
        />
        <StatCard
          title="Total Scans"
          value={stats.totalScans}
          icon={Eye}
          color="text-primary"
        />
        <StatCard
          title="Authentic"
          value={stats.authenticCount}
          icon={CheckCircle2}
          color="text-success"
        />
        <StatCard
          title="Flagged"
          value={stats.fakeCount + stats.suspiciousCount}
          icon={XCircle}
          color="text-destructive"
        />
      </div>

      {/* Pending Reviews Section */}
      {pendingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Pending Reviews ({pendingReviews.length})</span>
            </CardTitle>
            <CardDescription>
              Suspicious ICs requiring supervisor approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReviews.map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg bg-warning/5">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(inspection.status)}
                    <div>
                      <p className="font-medium">{inspection.extractedText}</p>
                      <p className="text-sm text-muted-foreground">
                        {inspection.workerName} • {inspection.batchNumber}
                      </p>
                      <ConfidenceMeter 
                        confidence={inspection.confidence} 
                        status={inspection.status}
                        className="mt-2"
                      />
                      {inspection.notes && (
                        <p className="text-sm text-muted-foreground italic">"{inspection.notes}"</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedInspection(inspection)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Inspections */}
      <Card>
        <CardHeader>
          <CardTitle>All Inspections</CardTitle>
          <CardDescription>Complete history of IC marking verifications</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by IC, worker, or batch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="authentic">Authentic</SelectItem>
                <SelectItem value="suspicious">Suspicious</SelectItem>
                <SelectItem value="fake">Fake</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inspections List */}
          <div className="space-y-3">
            {filteredInspections.map((inspection) => (
              <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(inspection.status)}
                  <div>
                    <p className="font-medium">{inspection.extractedText}</p>
                    <p className="text-sm text-muted-foreground">
                      {inspection.workerName} • {inspection.batchNumber} • {inspection.timestamp.toLocaleString()}
                    </p>
                    {inspection.supervisorReview && (
                      <p className="text-xs text-muted-foreground">
                        Reviewed by {inspection.supervisorReview.reviewedBy} • {inspection.supervisorReview.action}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge className={getStatusBadge(inspection.status)}>
                    {inspection.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {inspection.confidence}% confidence
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Multi-Device Collaboration */}
      <MultiDeviceHandoff />

      {/* Review Dialog */}
      <Dialog open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review IC Inspection</DialogTitle>
            <DialogDescription>
              Review and approve or reject this inspection result
            </DialogDescription>
          </DialogHeader>
          
          {selectedInspection && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedInspection.status)}
                  <span className="font-medium">{selectedInspection.extractedText}</span>
                  <Badge className={getStatusBadge(selectedInspection.status)}>
                    {selectedInspection.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Confidence: {selectedInspection.confidence}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Worker: {selectedInspection.workerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Batch: {selectedInspection.batchNumber}
                </p>
                {selectedInspection.notes && (
                  <div>
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "{selectedInspection.notes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review Comments</label>
                <Textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Add your review comments..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => handleReview('approved')}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReview('rejected')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};