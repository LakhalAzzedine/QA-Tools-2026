
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";

interface Endpoint {
  id: string;
  name: string;
  url: string;
  status: "up" | "down" | "warning";
  responseTime: number;
  lastCheck: string;
}

export function EndpointsMonitor() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    {
      id: "1",
      name: "TSDM API",
      url: "https://api.tsdm.example.com",
      status: "up",
      responseTime: 245,
      lastCheck: "2 minutes ago"
    },
    {
      id: "2",
      name: "Navigator API",
      url: "https://api.navigator.example.com",
      status: "up",
      responseTime: 187,
      lastCheck: "1 minute ago"
    },
    {
      id: "3",
      name: "Authentication Service",
      url: "https://auth.example.com",
      status: "warning",
      responseTime: 892,
      lastCheck: "3 minutes ago"
    },
    {
      id: "4",
      name: "Database Connector",
      url: "https://db.example.com",
      status: "down",
      responseTime: 0,
      lastCheck: "5 minutes ago"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "down":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      up: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      down: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Endpoints Monitor</h1>
          <p className="text-muted-foreground">Real-time health monitoring for all endpoints</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {endpoints.map((endpoint) => (
          <Card key={endpoint.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{endpoint.name}</CardTitle>
                {getStatusIcon(endpoint.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground truncate">
                {endpoint.url}
              </div>
              
              <div className="flex items-center justify-between">
                {getStatusBadge(endpoint.status)}
                <span className="text-xs text-muted-foreground">
                  {endpoint.responseTime > 0 ? `${endpoint.responseTime}ms` : "N/A"}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last check: {endpoint.lastCheck}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-muted-foreground">Healthy Endpoints</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-muted-foreground">Warning Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-muted-foreground">Down Endpoints</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
