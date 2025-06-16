
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Rocket, Clock, CheckCircle, XCircle } from "lucide-react";

export function BuildPipelines() {
  const [selectedApp, setSelectedApp] = useState("tsdm");
  const [isBuilding, setIsBuilding] = useState({ qa: false, prod: false });

  const handleBuildTrigger = async (type: "qa" | "prod") => {
    setIsBuilding(prev => ({ ...prev, [type]: true }));
    console.log(`Triggering ${type.toUpperCase()} build for ${selectedApp.toUpperCase()}`);
    
    // Simulate build process
    setTimeout(() => {
      setIsBuilding(prev => ({ ...prev, [type]: false }));
    }, 3000);
  };

  const recentBuilds = [
    {
      id: "1",
      app: "TSDM",
      type: "QA",
      status: "success",
      time: "2 minutes ago",
      duration: "3m 24s"
    },
    {
      id: "2",
      app: "Navigator",
      type: "PROD",
      status: "success",
      time: "15 minutes ago",
      duration: "5m 12s"
    },
    {
      id: "3",
      app: "TSDM",
      type: "PROD",
      status: "failed",
      time: "1 hour ago",
      duration: "2m 45s"
    },
    {
      id: "4",
      app: "Navigator",
      type: "QA",
      status: "running",
      time: "Just now",
      duration: "1m 30s"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      running: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">QA Build Pipelines</h1>
        <p className="text-muted-foreground">Trigger and monitor build deployments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="w-5 h-5" />
              <span>Build Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Application
              </label>
              <Select value={selectedApp} onValueChange={setSelectedApp}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tsdm">TSDM</SelectItem>
                  <SelectItem value="navigator">Navigator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={() => handleBuildTrigger("qa")}
                disabled={isBuilding.qa}
                className="h-12 flex items-center justify-center space-x-2"
              >
                {isBuilding.qa ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{isBuilding.qa ? "Building..." : "Trigger QA Build"}</span>
              </Button>

              <Button
                onClick={() => handleBuildTrigger("prod")}
                disabled={isBuilding.prod}
                variant="destructive"
                className="h-12 flex items-center justify-center space-x-2"
              >
                {isBuilding.prod ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Rocket className="w-4 h-4" />
                )}
                <span>{isBuilding.prod ? "Deploying..." : "Trigger PROD Build"}</span>
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Selected: <span className="font-medium">{selectedApp.toUpperCase()}</span> application
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Builds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBuilds.map((build) => (
                <div key={build.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(build.status)}
                    <div>
                      <div className="font-medium text-sm">
                        {build.app} - {build.type}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {build.time} • {build.duration}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(build.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-sm text-muted-foreground">Successful Builds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-muted-foreground">Failed Builds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4m 32s</div>
              <div className="text-sm text-muted-foreground">Avg Build Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
