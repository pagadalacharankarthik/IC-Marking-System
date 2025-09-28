import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Download, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Calendar
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DUMMY_INSPECTIONS, getDashboardStats, getChartData } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';
import { generateCSV, generatePDF, generateExcel } from '@/utils/exportUtils';
import { AuditTimeline } from '@/components/AuditTimeline';
import { BatchHealthScore } from '@/components/BatchHealthScore';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');

  const stats = getDashboardStats();
  const chartData = getChartData();

  const users = [
    { id: '1', name: 'John Smith', email: 'worker1@company.com', role: 'worker', department: 'Quality Control', lastActive: '2 hours ago', scansToday: 12 },
    { id: '2', name: 'Sarah Johnson', email: 'supervisor1@company.com', role: 'supervisor', department: 'Quality Assurance', lastActive: '30 minutes ago', scansToday: 0 },
    { id: '3', name: 'Michael Chen', email: 'admin1@company.com', role: 'admin', department: 'IT Administration', lastActive: '1 hour ago', scansToday: 0 }
  ];

  const handleExport = (format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `ic_inspection_report_${timestamp}`;
    
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    });

    // Actual export with real file download
    setTimeout(() => {
      switch (format) {
        case 'csv':
          generateCSV(DUMMY_INSPECTIONS, `${filename}.csv`);
          break;
        case 'pdf':
          generatePDF(DUMMY_INSPECTIONS, `${filename}.txt`);
          break;
        case 'excel':
          generateExcel(DUMMY_INSPECTIONS, `${filename}.xls`);
          break;
      }
      
      toast({
        title: "Export Complete",
        description: `Report downloaded as ${format.toUpperCase()} file`,
      });
    }, 1500);
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'supervisor': return 'bg-orange-100 text-orange-800';
      case 'worker': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {change}% from last week
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Scans"
          value={stats.totalScans}
          icon={BarChart3}
          color="text-primary"
          change={12}
        />
        <StatCard
          title="Authentic ICs"
          value={stats.authenticCount}
          icon={CheckCircle2}
          color="text-success"
          change={8}
        />
        <StatCard
          title="Flagged ICs"
          value={stats.suspiciousCount + stats.fakeCount}
          icon={AlertTriangle}
          color="text-warning"
          change={-3}
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingReview}
          icon={XCircle}
          color="text-destructive"
          change={-15}
        />
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid grid-cols-5 w-fit">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="logs">Inspection Logs</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="timeline">Audit Timeline</TabsTrigger>
          </TabsList>
          <DarkModeToggle />
        </div>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <BatchHealthScore />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>IC Status Distribution</span>
                </CardTitle>
                <CardDescription>Breakdown of inspection results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={chartData.pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                      >
                        {chartData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Scanning Activity</span>
                </CardTitle>
                <CardDescription>Daily inspection volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="scans" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Daily Scans"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>Manage system users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Add User</Button>
              </div>

              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.department}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {user.scansToday} scans today
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Active {user.lastActive}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inspection Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Logs</CardTitle>
              <CardDescription>Complete audit trail of all IC inspections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DUMMY_INSPECTIONS.map((inspection) => (
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
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Reports</span>
              </CardTitle>
              <CardDescription>Generate compliance and analytics reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Compliance Reports</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleExport('pdf')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Quality Control Report (PDF)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleExport('csv')}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Inspection Data (CSV)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleExport('excel')}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Full Analytics (Excel)
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Report Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Date Range</label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <Calendar className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7days">Last 7 Days</SelectItem>
                          <SelectItem value="30days">Last 30 Days</SelectItem>
                          <SelectItem value="90days">Last 90 Days</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Include Data</label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="workers" defaultChecked />
                          <label htmlFor="workers" className="text-sm">Worker Activity</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="inspections" defaultChecked />
                          <label htmlFor="inspections" className="text-sm">Inspection Results</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="analytics" defaultChecked />
                          <label htmlFor="analytics" className="text-sm">Analytics Charts</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <AuditTimeline inspections={DUMMY_INSPECTIONS} />
        </TabsContent>
      </Tabs>
    </div>
  );
};