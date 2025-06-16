
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { 
  FileCheck, 
  CheckSquare, 
  MousePointer, 
  Code, 
  Accessibility, 
  Gauge, 
  MessageCircle, 
  Bug 
} from "lucide-react";

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
  }
];

export function QATools() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPrompt = async () => {
    if (!input.trim() || !selectedTool) return;
    
    setIsLoading(true);
    try {
      // Simulate API call to /SendMessage
      const response = await fetch('/SendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: selectedTool.id,
          prompt: input
        })
      });
      
      const data = await response.json();
      setResponse(data.response || "Response received from LLM API");
    } catch (error) {
      console.error('Error sending prompt:', error);
      setResponse("Error: Could not connect to LLM API");
    } finally {
      setIsLoading(false);
    }
  };

  const openToolModal = (tool: any) => {
    setSelectedTool(tool);
    setInput("");
    setResponse("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">QA AI Tools</h1>
        <p className="text-muted-foreground">AI-powered tools to enhance your quality assurance workflow</p>
      </div>

      {/* Horizontal Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Tools Toolbar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Dialog key={tool.id}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 h-10 px-3"
                      onClick={() => openToolModal(tool)}
                    >
                      <div className={`w-4 h-4 ${tool.color} rounded flex items-center justify-center`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">{tool.name}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <div className={`w-6 h-6 ${tool.color} rounded flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span>{tool.name}</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Input Prompt:</label>
                        <Textarea
                          placeholder={`Enter your ${tool.name.toLowerCase()} request...`}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <Button 
                        onClick={handleSendPrompt}
                        disabled={!input.trim() || isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Sending..." : "Send to LLM"}
                      </Button>

                      {response && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Response:</label>
                          <div className="p-3 bg-muted rounded-md">
                            <pre className="text-sm whitespace-pre-wrap">{response}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-12 justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Open QA Chatbot
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>QA Chatbot</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Ask any QA-related question..."
                    className="min-h-[100px]"
                  />
                  <Button className="w-full">Send Message</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-12 justify-start">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Generate Test Suite
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Test Suite Generator</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe the feature or requirements for test suite generation..."
                    className="min-h-[100px]"
                  />
                  <Button className="w-full">Generate Test Suite</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
