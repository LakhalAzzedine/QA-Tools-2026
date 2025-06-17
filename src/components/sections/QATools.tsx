import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { 
  FileCheck, 
  CheckSquare, 
  MousePointer, 
  Code, 
  Accessibility, 
  Gauge, 
  MessageCircle, 
  Bug,
  FileCode,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileImport } from "./FileImport";
import { JiraIntegration } from "./JiraIntegration";

const tools = [
  {
    id: "test-generator",
    name: "Test Generator",
    description: "Generate comprehensive test cases using AI",
    icon: FileCheck,
    color: "bg-blue-500"
  },
  {
    id: "ac-validator",
    name: "AC Validator",
    description: "Validate acceptance criteria completeness",
    icon: CheckSquare,
    color: "bg-green-500"
  },
  {
    id: "xpath-generator",
    name: "XPath Generator",
    description: "Create reliable XPath selectors",
    icon: MousePointer,
    color: "bg-purple-500"
  },
  {
    id: "json-analyzer",
    name: "JSON Analyzer",
    description: "Analyze and validate JSON structures",
    icon: Code,
    color: "bg-orange-500"
  },
  {
    id: "ada-analyzer",
    name: "ADA Analyzer",
    description: "Check accessibility compliance",
    icon: Accessibility,
    color: "bg-indigo-500"
  },
  {
    id: "lighthouse",
    name: "Lighthouse",
    description: "Performance and quality insights",
    icon: Gauge,
    color: "bg-yellow-500"
  },
  {
    id: "chatbot",
    name: "QA Chatbot",
    description: "AI assistant for QA questions",
    icon: MessageCircle,
    color: "bg-pink-500"
  },
  {
    id: "defect-analyzer",
    name: "Defect Analyzer",
    description: "Identify root causes of defects",
    icon: Bug,
    color: "bg-red-500"
  },
  {
    id: "karate-script-writer",
    name: "Karate Script Writer",
    description: "Generate Karate API test scripts",
    icon: FileCode,
    color: "bg-teal-500"
  },
  {
    id: "smartspec-script-writer",
    name: "SmartSpec Script Writer",
    description: "Generate SmartSpec automation scripts",
    icon: FileText,
    color: "bg-cyan-500"
  }
];

export function QATools() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [importedFiles, setImportedFiles] = useState<File[]>([]);
  const [jiraStoryData, setJiraStoryData] = useState<any>(null);
  const { toast } = useToast();

  const handleSendPrompt = async () => {
    if (!input.trim() || !selectedTool) return;
    
    setIsLoading(true);
    try {
      // Enhanced prompt with file context and Jira data
      let enhancedPrompt = input;
      
      if (importedFiles.length > 0) {
        enhancedPrompt += `\n\nImported Files Context: ${importedFiles.map(f => f.name).join(', ')}`;
      }
      
      if (jiraStoryData && selectedTool.id === 'test-generator') {
        enhancedPrompt += `\n\nJira Story Data:\nTitle: ${jiraStoryData.title}\nDescription: ${jiraStoryData.description}\nAcceptance Criteria:\n${jiraStoryData.acceptanceCriteria.join('\n')}`;
      }
      
      // Simulate API call to /SendMessage
      const response = await fetch('/SendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: selectedTool.id,
          prompt: enhancedPrompt,
          files: importedFiles.map(f => ({ name: f.name, size: f.size })),
          jiraStory: jiraStoryData
        })
      });
      
      const data = await response.json();
      const responseText = data.response || "Response received from LLM API";
      
      // Show response in a toast popup
      toast({
        title: `${selectedTool.name} Response`,
        description: responseText,
        duration: 10000,
      });
      
    } catch (error) {
      console.error('Error sending prompt:', error);
      toast({
        title: "Error",
        description: "Could not connect to LLM API",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectTool = (tool: any) => {
    setSelectedTool(tool);
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 9000) {
      setInput(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Horizontal Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">QA AI Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = selectedTool?.id === tool.id;
              return (
                <Button
                  key={tool.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="flex items-center space-x-2 h-10 px-3"
                  onClick={() => selectTool(tool)}
                >
                  <div className={`w-4 h-4 ${tool.color} rounded flex items-center justify-center`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">{tool.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* File Import and Jira Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileImport onFilesImported={setImportedFiles} />
        <JiraIntegration onStoryFetched={setJiraStoryData} />
      </div>

      {/* Selected Tool Interface */}
      {selectedTool && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className={`w-6 h-6 ${selectedTool.color} rounded flex items-center justify-center`}>
                <selectedTool.icon className="w-4 h-4 text-white" />
              </div>
              <span>{selectedTool.name}</span>
              {jiraStoryData && selectedTool.id === 'test-generator' && (
                <Badge variant="secondary">Jira: {jiraStoryData.id}</Badge>
              )}
              {importedFiles.length > 0 && (
                <Badge variant="outline">{importedFiles.length} files</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selectedTool.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Input Prompt:</label>
                  <span className="text-xs text-muted-foreground">
                    {input.length}/9000 characters
                  </span>
                </div>
                <Textarea
                  placeholder={`Enter your ${selectedTool.name.toLowerCase()} request...`}
                  value={input}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                  maxLength={9000}
                />
              </div>

              <Button 
                onClick={handleSendPrompt}
                disabled={!input.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send to LLM"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
