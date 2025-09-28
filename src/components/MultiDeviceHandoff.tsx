import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Smartphone, Monitor, Users, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  user: string;
  status: 'online' | 'offline';
  lastActivity: Date;
}

interface LiveUpdate {
  id: string;
  type: 'scan' | 'review' | 'approval';
  message: string;
  timestamp: Date;
  device: string;
  user: string;
}

export const MultiDeviceHandoff = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);

  // Simulate connected devices
  useEffect(() => {
    const dummyDevices: ConnectedDevice[] = [
      {
        id: '1',
        name: 'iPhone 12',
        type: 'mobile',
        user: 'John Smith (Worker)',
        status: 'online',
        lastActivity: new Date()
      },
      {
        id: '2',
        name: 'iPad Pro',
        type: 'tablet',
        user: 'Sarah Johnson (Supervisor)',
        status: 'online',
        lastActivity: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Desktop PC',
        type: 'desktop',
        user: 'Admin Dashboard',
        status: 'online',
        lastActivity: new Date(Date.now() - 2 * 60 * 1000)
      }
    ];
    setDevices(dummyDevices);
  }, []);

  // Simulate live updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const updateTypes = ['scan', 'review', 'approval'] as const;
      const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      const messages = {
        scan: 'New IC scan completed',
        review: 'Flagged IC under review',
        approval: 'IC inspection approved'
      };

      const newUpdate: LiveUpdate = {
        id: Date.now().toString(),
        type: randomType,
        message: messages[randomType],
        timestamp: new Date(),
        device: devices[Math.floor(Math.random() * devices.length)]?.name || 'Unknown',
        user: devices[Math.floor(Math.random() * devices.length)]?.user || 'Unknown'
      };

      setLiveUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);

      // Show toast notification
      toast({
        title: "Live Update",
        description: `${newUpdate.message} from ${newUpdate.user}`,
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [isConnected, devices]);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      toast({
        title: "Multi-Device Mode Enabled",
        description: "Real-time collaboration is now active",
      });
    } else {
      toast({
        title: "Multi-Device Mode Disabled",
        description: "Real-time collaboration has been paused",
      });
      setLiveUpdates([]);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Smartphone className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'scan': return '📱';
      case 'review': return '👁️';
      case 'approval': return '✅';
      default: return '📊';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Multi-Device Handoff</CardTitle>
          </div>
          <Button
            variant={isConnected ? "default" : "outline"}
            size="sm"
            onClick={toggleConnection}
          >
            {isConnected ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
            {isConnected ? 'Connected' : 'Connect'}
          </Button>
        </div>
        <CardDescription>
          {isConnected 
            ? 'Real-time collaboration between devices is active'
            : 'Enable real-time collaboration between mobile and desktop devices'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Connected Devices */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>Connected Devices ({devices.filter(d => d.status === 'online').length})</span>
            </h3>
            <div className="space-y-2">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(device.type)}
                    <div>
                      <div className="text-sm font-medium">{device.name}</div>
                      <div className="text-xs text-muted-foreground">{device.user}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                      {device.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTime(device.lastActivity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          {isConnected && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Live Activity Feed</span>
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {liveUpdates.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Waiting for live updates...
                  </div>
                ) : (
                  liveUpdates.map((update) => (
                    <div key={update.id} className="flex items-start space-x-3 p-2 bg-muted/30 rounded text-sm">
                      <span className="text-lg">{getUpdateIcon(update.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{update.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {update.user} • {update.device} • {formatTime(update.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="pt-3 border-t">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-medium">Real-time Features:</div>
                <div className="text-muted-foreground">• Live scan results</div>
                <div className="text-muted-foreground">• Instant notifications</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Collaboration:</div>
                <div className="text-muted-foreground">• Cross-device handoff</div>
                <div className="text-muted-foreground">• Shared workspaces</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};