
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkFileImportProps {
  onFilesProcessed: (files: File[]) => void;
  toolId: string;
  toolName: string;
}

export function BulkFileImport({ onFilesProcessed, toolId, toolName }: BulkFileImportProps) {
  const [importedFiles, setImportedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleProcessFiles = async () => {
    if (importedFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Send files to backend for automatic processing
      const formData = new FormData();
      importedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      formData.append('toolId', toolId);
      
      const response = await fetch('/ProcessFiles', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      toast({
        title: `${toolName} Processing Complete`,
        description: data.message || "Files processed successfully",
        duration: 10000,
      });
      
      onFilesProcessed(importedFiles);
      
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Processing Error",
        description: "Could not process files. Check backend connection.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="h-80 w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Upload className="w-4 h-4 text-gray-500" />
          <span>Import Files</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Input
            type="file"
            multiple
            accept=".txt,.md,.json,.xml,.feature,.java,.js,.ts,.pdf,.docx,.xlsx"
            onChange={handleFileUpload}
            className="cursor-pointer text-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supported: .txt, .md, .json, .xml, .feature, .java, .js, .ts, .pdf, .docx, .xlsx
          </p>
        </div>

        {importedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Files to Process:</h4>
            <div className="max-h-24 overflow-y-auto space-y-1">
              {importedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-1 bg-muted rounded text-xs">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span className="truncate max-w-24">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-4 w-4 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={handleProcessFiles}
          disabled={importedFiles.length === 0 || isProcessing}
          className="w-full text-xs h-8"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <Send className="w-3 h-3 mr-1" />
              Process with {toolName}
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>Files will be automatically processed using pre-configured prompts from the backend.</p>
        </div>
      </CardContent>
    </Card>
  );
}
