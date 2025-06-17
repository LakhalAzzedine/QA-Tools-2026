
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Zap, FileExport } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolEndpointUrl, buildPromptWithContext } from "@/config/backendConfig";
import { defaultEndpointConfig } from "@/config/backendConfig";

interface TestGeneratorProps {
  jiraData?: any;
  onConfigOpen: () => void;
}

export function TestGenerator({ jiraData, onConfigOpen }: TestGeneratorProps) {
  const [requirementsInput, setRequirementsInput] = useState("");
  const [generatedTests, setGeneratedTests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingJira, setIsCreatingJira] = useState(false);
  const [isCreatingQTest, setIsCreatingQTest] = useState(false);
  const { toast } = useToast();

  const handleGenerateTests = async () => {
    if (!requirementsInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter requirements to generate test cases.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const savedConfig = localStorage.getItem("qaToolsEndpointConfig");
      let config = defaultEndpointConfig;
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        config = { ...defaultEndpointConfig, ...parsedConfig };
      }

      const endpointUrl = getToolEndpointUrl("test-generator", config);
      const prompt = buildPromptWithContext("test-generator", requirementsInput, jiraData);
      
      console.log(`Generating tests via ${endpointUrl}`);
      console.log("Prompt:", prompt);
      
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          requirements: requirementsInput,
          toolId: "test-generator"
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setGeneratedTests(result.response || result.testCases || "No test cases generated");
      
      toast({
        title: "Tests Generated",
        description: "Test cases generated successfully",
      });
      
    } catch (error) {
      console.error('Error generating tests:', error);
      toast({
        title: "Error",
        description: "Could not generate test cases. Check SVC cluster connection and endpoint configuration.",
        variant: "destructive",
      });
      
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

  const handleCreateInJira = async () => {
    if (!generatedTests) {
      toast({
        title: "Error",
        description: "Please generate test cases first.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingJira(true);
    try {
      const savedConfig = localStorage.getItem("qaToolsEndpointConfig");
      let config = defaultEndpointConfig;
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        config = { ...defaultEndpointConfig, ...parsedConfig };
      }

      const response = await fetch(`${config.baseUrl}/api/jira/create-test-cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testCases: generatedTests,
          jiraData: jiraData,
          requirements: requirementsInput
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      toast({
        title: "Success",
        description: `Test cases created in Jira: ${result.ticketIds?.join(', ') || 'Created successfully'}`,
      });
      
    } catch (error) {
      console.error('Error creating Jira test cases:', error);
      toast({
        title: "Error",
        description: "Could not create test cases in Jira. Check SVC cluster connection.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingJira(false);
    }
  };

  const handleCreateInQTest = async () => {
    if (!generatedTests) {
      toast({
        title: "Error",
        description: "Please generate test cases first.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingQTest(true);
    try {
      const savedConfig = localStorage.getItem("qaToolsEndpointConfig");
      let config = defaultEndpointConfig;
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        config = { ...defaultEndpointConfig, ...parsedConfig };
      }

      const response = await fetch(`${config.baseUrl}/api/qtest/create-test-cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testCases: generatedTests,
          jiraData: jiraData,
          requirements: requirementsInput
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      toast({
        title: "Success",
        description: `Test cases created in QTest: ${result.testCaseIds?.join(', ') || 'Created successfully'}`,
      });
      
    } catch (error) {
      console.error('Error creating QTest test cases:', error);
      toast({
        title: "Error",
        description: "Could not create test cases in QTest. Check SVC cluster connection.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingQTest(false);
    }
  };

  const exportTests = (format: 'txt' | 'json') => {
    if (!generatedTests) {
      toast({
        title: "Error",
        description: "Please generate test cases first.",
        variant: "destructive",
      });
      return;
    }

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'json') {
      const exportData = {
        timestamp: new Date().toISOString(),
        requirements: requirementsInput,
        testCases: generatedTests,
        jiraData: jiraData
      };
      content = JSON.stringify(exportData, null, 2);
      mimeType = 'application/json';
      filename = `test-cases-${Date.now()}.json`;
    } else {
      content = `Test Cases Generated on: ${new Date().toLocaleString()}\n\nRequirements:\n${requirementsInput}\n\nGenerated Test Cases:\n${generatedTests}`;
      mimeType = 'text/plain';
      filename = `test-cases-${Date.now()}.txt`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Test cases exported as ${format.toUpperCase()} file`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span>Test Generator</span>
            {jiraData && (
              <Badge variant="secondary">Jira: {jiraData.id}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Generate comprehensive test cases from requirements. Create test cases directly in Jira or QTest.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requirements-input">Requirements / User Story</Label>
              <Textarea
                id="requirements-input"
                placeholder="Enter your requirements, user story, or feature description here..."
                value={requirementsInput}
                onChange={(e) => setRequirementsInput(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateTests}
                disabled={!requirementsInput.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Generating Tests..." : "Generate Test Cases"}
              </Button>
              
              {generatedTests && (
                <div className="flex gap-2">
                  <Button onClick={() => exportTests('txt')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export TXT
                  </Button>
                  <Button onClick={() => exportTests('json')} variant="outline">
                    <FileExport className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {generatedTests && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generated Test Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <pre className="text-sm whitespace-pre-wrap">{generatedTests}</pre>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateInJira}
                  disabled={isCreatingJira}
                  variant="outline"
                  className="flex-1"
                >
                  {isCreatingJira ? (
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  {isCreatingJira ? "Creating in Jira..." : "Create in Jira"}
                </Button>
                
                <Button 
                  onClick={handleCreateInQTest}
                  disabled={isCreatingQTest}
                  variant="outline"
                  className="flex-1"
                >
                  {isCreatingQTest ? (
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  {isCreatingQTest ? "Creating in QTest..." : "Create in QTest"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
