
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, TestTube, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { defaultEndpointConfig, type EndpointConfig } from "@/config/backendConfig";

interface EndpointConfigProps {
  onConfigUpdate?: (config: EndpointConfig) => void;
}

export function EndpointConfig({ onConfigUpdate }: EndpointConfigProps) {
  const [config, setConfig] = useState<EndpointConfig>(defaultEndpointConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "failed">("unknown");
  const { toast } = useToast();

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem("qaToolsEndpointConfig");
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig({ ...defaultEndpointConfig, ...parsedConfig });
      } catch (error) {
        console.error("Failed to parse saved config:", error);
      }
    }
  }, []);

  const handleConfigChange = (field: keyof EndpointConfig, value: string) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
  };

  const handleSaveConfig = () => {
    try {
      localStorage.setItem("qaToolsEndpointConfig", JSON.stringify(config));
      onConfigUpdate?.(config);
      toast({
        title: "Configuration Saved",
        description: "Endpoint configuration has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed", 
        description: "Failed to save configuration.",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      // Test the connection to the backend
      const response = await fetch(`${config.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setConnectionStatus("connected");
        toast({
          title: "Connection Successful",
          description: "Successfully connected to the backend service.",
        });
      } else {
        setConnectionStatus("failed");
        toast({
          title: "Connection Failed",
          description: `Backend responded with status: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus("failed");
      toast({
        title: "Connection Error",
        description: "Failed to connect to backend service. Check the base URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Backend Endpoint Configuration</span>
          {connectionStatus !== "unknown" && (
            <Badge variant={connectionStatus === "connected" ? "default" : "destructive"}>
              {connectionStatus === "connected" ? "Connected" : "Failed"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="base-url">Base URL</Label>
            <Input
              id="base-url"
              placeholder="http://localhost:3001"
              value={config.baseUrl}
              onChange={(e) => handleConfigChange("baseUrl", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Main backend service URL
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="process-files">Process Files Endpoint</Label>
            <Input
              id="process-files"
              placeholder="/ProcessFiles"
              value={config.processFilesEndpoint}
              onChange={(e) => handleConfigChange("processFilesEndpoint", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="send-message">Send Message Endpoint</Label>
            <Input
              id="send-message"
              placeholder="/SendMessage"
              value={config.sendMessageEndpoint}
              onChange={(e) => handleConfigChange("sendMessageEndpoint", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jira-integration">Jira Integration Endpoint</Label>
            <Input
              id="jira-integration"
              placeholder="/FetchJiraStory"
              value={config.jiraIntegrationEndpoint}
              onChange={(e) => handleConfigChange("jiraIntegrationEndpoint", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url-processing">URL Processing Endpoint</Label>
            <Input
              id="url-processing"
              placeholder="/ProcessUrl"
              value={config.urlProcessingEndpoint}
              onChange={(e) => handleConfigChange("urlProcessingEndpoint", e.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button onClick={handleSaveConfig} className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <TestTube className="w-4 h-4" />
            <span>{isLoading ? "Testing..." : "Test Connection"}</span>
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-800 mb-2">Backend Integration Guide</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Set your backend base URL (e.g., https://your-api.com)</li>
                <li>• Ensure your backend implements the required endpoints</li>
                <li>• Each tool will send prompts automatically to these endpoints</li>
                <li>• File uploads go to ProcessFiles, prompts to SendMessage</li>
                <li>• Test the connection to verify your backend is accessible</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
