
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { defaultEndpointConfig } from "@/config/backendConfig";

interface JiraIntegrationProps {
  onStoryFetched: (storyData: any) => void;
}

export function JiraIntegration({ onStoryFetched }: JiraIntegrationProps) {
  const [jiraStoryId, setJiraStoryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedStory, setFetchedStory] = useState<any>(null);
  const { toast } = useToast();

  const handleFetchStory = async () => {
    if (!jiraStoryId.trim()) return;
    
    setIsLoading(true);
    try {
      // Get saved configuration
      const savedConfig = localStorage.getItem("qaToolsEndpointConfig");
      let config = defaultEndpointConfig;
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        config = { ...defaultEndpointConfig, ...parsedConfig };
      }

      console.log(`Fetching Jira story: ${jiraStoryId} from ${config.baseUrl}${config.jiraIntegrationEndpoint}`);
      
      const response = await fetch(`${config.baseUrl}${config.jiraIntegrationEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId: jiraStoryId.trim()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const storyData = await response.json();
      
      setFetchedStory(storyData);
      onStoryFetched(storyData);
      
      toast({
        title: "Story Fetched",
        description: `Successfully fetched story ${jiraStoryId}`,
      });
      
    } catch (error) {
      console.error('Error fetching Jira story:', error);
      toast({
        title: "Error",
        description: "Could not fetch Jira story. Check SVC cluster configuration and connectivity.",
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
          <ExternalLink className="w-5 h-5" />
          <span>Jira Integration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jira-story-id">Jira Story ID</Label>
          <div className="flex space-x-2">
            <Input
              id="jira-story-id"
              placeholder="e.g., PROJ-123"
              value={jiraStoryId}
              onChange={(e) => setJiraStoryId(e.target.value)}
            />
            <Button 
              onClick={handleFetchStory}
              disabled={!jiraStoryId.trim() || isLoading}
            >
              {isLoading ? <Download className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isLoading ? "Fetching..." : "Fetch"}
            </Button>
          </div>
        </div>

        {fetchedStory && (
          <div className="space-y-3 p-3 bg-muted rounded">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{fetchedStory.title || fetchedStory.summary}</h4>
              <Badge>{fetchedStory.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{fetchedStory.description}</p>
            
            {fetchedStory.acceptanceCriteria && fetchedStory.acceptanceCriteria.length > 0 && (
              <div>
                <h5 className="text-sm font-medium mb-2">Acceptance Criteria:</h5>
                <ul className="space-y-1">
                  {fetchedStory.acceptanceCriteria.map((ac: string, index: number) => (
                    <li key={index} className="text-sm pl-2 border-l-2 border-blue-500">
                      {ac}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {fetchedStory.assignee && (
              <p className="text-sm">
                <span className="font-medium">Assignee:</span> {fetchedStory.assignee}
              </p>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Connects to your SVC cluster's Jira integration endpoint to fetch real story data.</p>
        </div>
      </CardContent>
    </Card>
  );
}
