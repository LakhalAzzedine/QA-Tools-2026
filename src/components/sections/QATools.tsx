
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    name: "Test Case Generator",
    description: "Generate comprehensive test cases using AI",
    icon: FileCheck,
    category: "Generation",
    color: "bg-blue-500"
  },
  {
    id: "ac-validator",
    name: "AC Validator",
    description: "Validate acceptance criteria completeness",
    icon: CheckSquare,
    category: "Validation",
    color: "bg-green-500"
  },
  {
    id: "xpath-generator",
    name: "XPath Generator",
    description: "Create reliable XPath selectors",
    icon: MousePointer,
    category: "Automation",
    color: "bg-purple-500"
  },
  {
    id: "json-analyzer",
    name: "JSON Analyzer",
    description: "Analyze and validate JSON structures",
    icon: Code,
    category: "Analysis",
    color: "bg-orange-500"
  },
  {
    id: "ada-analyzer",
    name: "ADA Analyzer",
    description: "Check accessibility compliance",
    icon: Accessibility,
    category: "Accessibility",
    color: "bg-indigo-500"
  },
  {
    id: "lighthouse",
    name: "Lighthouse Report",
    description: "Performance and quality insights",
    icon: Gauge,
    category: "Performance",
    color: "bg-yellow-500"
  },
  {
    id: "chatbot",
    name: "QA Chatbot",
    description: "AI assistant for QA questions",
    icon: MessageCircle,
    category: "Assistant",
    color: "bg-pink-500"
  },
  {
    id: "defect-analyzer",
    name: "Defect Root Cause",
    description: "Identify root causes of defects",
    icon: Bug,
    category: "Analysis",
    color: "bg-red-500"
  }
];

export function QATools() {
  const handleToolClick = (tool: any) => {
    console.log(`Launching tool: ${tool.name}`);
    // Here you would typically trigger the AI prompt for this specific tool
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">QA AI Tools</h1>
        <p className="text-muted-foreground">AI-powered tools to enhance your quality assurance workflow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{tool.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {tool.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleToolClick(tool)}
                >
                  Launch Tool
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 justify-start">
              <MessageCircle className="w-4 h-4 mr-2" />
              Open QA Chatbot
            </Button>
            <Button variant="outline" className="h-12 justify-start">
              <FileCheck className="w-4 h-4 mr-2" />
              Generate Test Suite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
