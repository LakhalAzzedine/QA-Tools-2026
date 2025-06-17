
import { useState } from "react";
import { ToolsToolbar } from "./ToolsToolbar";
import { ToolContent } from "./ToolContent";
import { EndpointConfig } from "./EndpointConfig";
import { Tool } from "@/config/toolsConfig";

export function QATools() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [importedFiles, setImportedFiles] = useState<File[]>([]);
  const [jiraStoryData, setJiraStoryData] = useState<any>(null);
  const [urlData, setUrlData] = useState<any>(null);
  const [showEndpointConfig, setShowEndpointConfig] = useState(false);

  const selectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setShowEndpointConfig(false);
  };

  return (
    <div className="space-y-6">
      {/* Horizontal Toolbar */}
      <ToolsToolbar selectedTool={selectedTool} onToolSelect={selectTool} />

      {/* Endpoint Configuration */}
      {showEndpointConfig && (
        <EndpointConfig onConfigUpdate={() => setShowEndpointConfig(false)} />
      )}

      {/* Tool Content */}
      {selectedTool && selectedTool.hasSpecialLayout && (
        <ToolContent
          selectedTool={selectedTool}
          importedFiles={importedFiles}
          jiraStoryData={jiraStoryData}
          urlData={urlData}
          onJiraStoryFetched={setJiraStoryData}
          onUrlProcessed={setUrlData}
          onFilesProcessed={setImportedFiles}
          onConfigOpen={() => setShowEndpointConfig(true)}
        />
      )}
    </div>
  );
}
