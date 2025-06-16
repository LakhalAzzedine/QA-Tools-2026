
import { EndpointsMonitor } from "./sections/EndpointsMonitor";
import { QATools } from "./sections/QATools";
import { BuildPipelines } from "./sections/BuildPipelines";

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
