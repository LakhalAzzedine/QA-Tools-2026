
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TestTube, Zap, Download, FileText, Send, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolEndpointUrl, buildPromptWithContext } from "@/config/backendConfig";
import { defaultEndpointConfig } from "@/config/backendConfig";

interface TestGeneratorProps {
  jiraData?: any;
  onConfigOpen: () => void;
}

export function TestGenerator({ jiraData, onConfigOpen }: TestGeneratorProps) {
  const [testInput, setTestInput] = useState("");
  const [generatedTests, setGeneratedTests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingJira, setIsCreatingJira] = useState(false);
  const [isCreatingQTest, setIsCreatingQTest] = useState(false);
  const [importedFiles, setImportedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImportedFiles(prev => [...prev, ...files]);
    
    toast({
      title: "Files Added",
      description: `${files.length} file(s) added for processing`,
    });
  };

  const removeFile = (index: number) => {
    setImportedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateTests = async () => {
    if (!testInput.trim() && importedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please enter test requirements or import files to generate test cases.",
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
      const prompt = buildPromptWithContext("test-generator", testInput, jiraData);
      
      console.log(`Generating tests via ${endpointUrl}`);
      console.log("Prompt:", prompt);
      
      // Prepare form data for file upload if files are present
      let requestBody;
      let headers: Record<string, string> = {};
      
      if (importedFiles.length > 0) {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('testRequirements', testInput);
        formData.append('toolId', "test-generator");
        
        importedFiles.forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
        
        if (jiraData) {
          formData.append('jiraData', JSON.stringify(jiraData));
        }
        
        requestBody = formData;
      } else {
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify({
          prompt: prompt,
          testRequirements: testInput,
          toolId: "test-generator"
        });
      }
      
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: headers,
        body: requestBody
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      setGeneratedTests(result.response || result.testCases || "No test cases generated");
      
      toast({
        title: "Test Cases Generated",
        description: "Test cases have been generated successfully",
      });
      
    } catch (error) {
      console.error('Error generating tests:', error);
      toast({
        title: "Error",
        description: "Could not generate test cases. Check SVC cluster connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createJiraTestCase = async () => {
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

      const endpointUrl = getToolEndpointUrl("jira-integration", config);
      
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: "createTestCase",
          testCases: generatedTests,
          jiraData: jiraData,
          toolId: "test-generator"
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      toast({
        title: "Jira Test Case Created",
        description: `Test case created in Jira: ${result.issueKey || 'Success'}`,
      });
      
    } catch (error) {
      console.error('Error creating Jira test case:', error);
      toast({
        title: "Error",
        description: "Could not create test case in Jira. Check configuration.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingJira(false);
    }
  };

  const createQTestCase = async () => {
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

      const endpointUrl = getToolEndpointUrl("qtest-integration", config);
      
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: "createTestCase",
          testCases: generatedTests,
          jiraData: jiraData,
          toolId: "test-generator"
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      toast({
        title: "QTest Case Created",
        description: `Test case created in QTest: ${result.testCaseId || 'Success'}`,
      });
      
    } catch (error) {
      console.error('Error creating QTest case:', error);
      toast({
        title: "Error",
        description: "Could not create test case in QTest. Check configuration.",
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
        testRequirements: testInput,
        generatedTests: generatedTests,
        jiraData: jiraData
      };
      content = JSON.stringify(exportData, null, 2);
      mimeType = 'application/json';
      filename = `test-cases-${Date.now()}.json`;
    } else {
      content = `Test Cases Generated on: ${new Date().toLocaleString()}\n\nTest Requirements:\n${testInput}\n\nGenerated Test Cases:\n${generatedTests}`;
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
              <TestTube className="w-4 h-4 text-white" />
            </div>
            <span>Test Generator</span>
            {jiraData && (
              <Badge variant="secondary">Jira: {jiraData.id}</Badge>
            )}
            {importedFiles.length > 0 && (
              <Badge variant="outline">{importedFiles.length} files</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Generate comprehensive test cases from requirements, user stories, or specifications. Export or create directly in Jira/QTest.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-input">Test Requirements</Label>
              <Textarea
                id="test-input"
                placeholder="Enter your test requirements, user stories, or specifications here..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Import Files (Optional)</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".txt,.md,.json,.xml,.feature,.java,.js,.ts,.pdf,.docx,.xlsx"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Supported: .txt, .md, .json, .xml, .feature, .java, .js, .ts, .pdf, .docx, .xlsx
              </p>
            </div>

            {importedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Imported Files:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {importedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateTests}
                disabled={(!testInput.trim() && importedFiles.length === 0) || isLoading}
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
                    <FileText className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              )}
            </div>

            {generatedTests && (
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={createJiraTestCase}
                  disabled={isCreatingJira}
                  variant="outline"
                  className="flex-1"
                >
                  {isCreatingJira ? (
                    <Send className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isCreatingJira ? "Creating in Jira..." : "Create Test in Jira"}
                </Button>
                
                <Button 
                  onClick={createQTestCase}
                  disabled={isCreatingQTest}
                  variant="outline"
                  className="flex-1"
                >
                  {isCreatingQTest ? (
                    <Send className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isCreatingQTest ? "Creating in QTest..." : "Create Test in QTest"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedTests && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generated Test Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{generatedTests}</pre>
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Test cases generated successfully. Use the buttons above to export or create in Jira/QTest.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
