
import { Activity, Brain, Hammer, BookOpen, HelpCircle, Settings, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  {
    id: "endpoints",
    label: "Endpoints Monitor",
    icon: Activity,
    badge: "Live"
  },
  {
    id: "qa-tools",
    label: "QA AI Tools",
    icon: Brain,
    badge: null
  },
  {
    id: "pipelines",
    label: "QA Build Pipelines",
    icon: Hammer,
    badge: null
  },
  {
    id: "confluence",
    label: "Confluence",
    icon: BookOpen,
    badge: null,
    external: true
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    badge: null
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    badge: null
  }
];

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const handleItemClick = (item: any) => {
    if (item.external && item.id === "confluence") {
      window.open("https://confluence.atlassian.com", "_blank");
      return;
    }
    setActiveSection(item.id);
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">COS QA</h1>
            <p className="text-xs text-muted-foreground">Quality Assurance Hub</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  item.badge === "Live" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-secondary text-secondary-foreground"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>System Status: Online</span>
        </div>
      </div>
    </div>
  );
}
