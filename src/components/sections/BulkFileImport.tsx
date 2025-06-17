
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
    <Card className="h-full aspect-square">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-gray-500" />
          <span>Import Files</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="file"
            multiple
            accept=".txt,.md,.json,.xml,.feature,.java,.js,.ts,.pdf,.docx,.xlsx"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supported: .txt, .md, .json, .xml, .feature, .java, .js, .ts, .pdf, .docx, .xlsx
          </p>
        </div>

        {importedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Files to Process:</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
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

        <Button 
          onClick={handleProcessFiles}
          disabled={importedFiles.length === 0 || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
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
