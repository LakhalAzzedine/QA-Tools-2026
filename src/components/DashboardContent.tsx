
import { EndpointsMonitor } from "./sections/EndpointsMonitor";
import { QATools } from "./sections/QATools";
import { BuildPipelines } from "./sections/BuildPipelines";
import { HelpSection } from "./sections/HelpSection";
import { SettingsSection } from "./sections/SettingsSection";

interface DashboardContentProps {
  activeSection: string;
}

export function DashboardContent({ activeSection }: DashboardContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "endpoints":
        return <EndpointsMonitor />;
      case "qa-tools":
        return <QATools />;
      case "pipelines":
        return <BuildPipelines />;
      case "help":
        return <HelpSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <EndpointsMonitor />;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
}
