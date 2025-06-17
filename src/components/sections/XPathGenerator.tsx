
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MousePointer, Copy, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolEndpointUrl, buildPromptWithContext } from "@/config/backendConfig";
import { defaultEndpointConfig } from "@/config/backendConfig";

interface XPathGeneratorProps {
  jiraData?: any;
  urlData?: any;
  onConfigOpen: () => void;
}

export function XPathGenerator({ jiraData, urlData, onConfigOpen }: XPathGeneratorProps) {
  const [htmlInput, setHtmlInput] = useState("");
  const [generatedXPaths, setGeneratedXPaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateXPath = async () => {
    if (!htmlInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter HTML content to generate XPath selectors.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Get saved configuration
      const savedConfig = localStorage.getItem("qaToolsEndpointConfig");
      let config = defaultEndpointConfig;
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        config = { ...defaultEndpointConfig, ...parsedConfig };
      }

      const endpointUrl = getToolEndpointUrl("xpath-generator", config);
      const prompt = buildPromptWithContext("xpath-generator", htmlInput, jiraData, urlData);
      
      console.log(`Generating XPath via ${endpointUrl}`);
      console.log("Prompt:", prompt);
      
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          htmlContent: htmlInput,
          toolId: "xpath-generator"
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Assuming the API returns an array of XPath selectors
      if (result.xpaths && Array.isArray(result.xpaths)) {
        setGeneratedXPaths(result.xpaths);
      } else if (result.response) {
        // If response is text, try to extract XPath patterns
        const xpathPattern = /\/\/[^\s\n]+|\.[^\s\n]+/g;
        const extractedXPaths = result.response.match(xpathPattern) || [];
        setGeneratedXPaths(extractedXPaths);
      } else {
        setGeneratedXPaths([]);
      }
      
      toast({
        title: "XPath Generated",
        description: `Generated ${generatedXPaths.length} XPath selectors`,
      });
      
    } catch (error) {
      console.error('Error generating XPath:', error);
      toast({
        title: "Error",
        description: "Could not generate XPath selectors. Check SVC cluster connection and endpoint configuration.",
        variant: "destructive",
      });
      
      // Show config button in error
      toast({
        title: "Configuration",
        description: "Click to configure endpoint settings",
        action: (
          <Button size="sm" onClick={onConfigOpen}>
            Configure
          </Button>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (xpath: string) => {
    navigator.clipboard.writeText(xpath);
    toast({
      title: "Copied",
      description: "XPath selector copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
              <MousePointer className="w-4 h-4 text-white" />
            </div>
            <span>XPath Generator</span>
            {jiraData && (
              <Badge variant="secondary">Jira: {jiraData.id}</Badge>
            )}
            {urlData && (
              <Badge variant="secondary">URL: {urlData.title}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Generate reliable XPath selectors from HTML elements. Paste your HTML code below to get multiple XPath options.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="html-input">HTML Element(s)</Label>
              <Textarea
                id="html-input"
                placeholder="Paste your HTML element(s) here..."
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            
            <Button 
              onClick={handleGenerateXPath}
              disabled={!htmlInput.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Zap className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Generating XPath..." : "Generate XPath Selectors"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedXPaths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generated XPath Selectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedXPaths.map((xpath, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <code className="text-sm font-mono flex-1 mr-2">{xpath}</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(xpath)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Generated {generatedXPaths.length} XPath selector(s). Click copy button to copy individual selectors.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
