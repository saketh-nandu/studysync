import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, FolderOpen, FileText, X, Download, RefreshCw } from "lucide-react";

interface FileData {
  file: File;
  name: string;
  size: string;
  type: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function DocumentConverter() {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const supportedFormats = [
    { value: "pdf", label: "PDF", description: "Portable Document Format" },
    { value: "docx", label: "DOCX", description: "Microsoft Word Document" },
    { value: "txt", label: "TXT", description: "Plain Text" },
    { value: "rtf", label: "RTF", description: "Rich Text Format" },
    { value: "html", label: "HTML", description: "Web Page" },
    { value: "xlsx", label: "XLSX", description: "Microsoft Excel Spreadsheet" },
    { value: "csv", label: "CSV", description: "Comma Separated Values" },
    { value: "pptx", label: "PPTX", description: "Microsoft PowerPoint" },
    { value: "jpg", label: "JPG", description: "JPEG Image" },
    { value: "png", label: "PNG", description: "PNG Image" },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile({
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile({
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleConvert = async () => {
    if (!selectedFile || !outputFormat) {
      toast({
        title: "Error",
        description: "Please select a file and output format.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile.file);
      formData.append("outputFormat", outputFormat);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/convert-document", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const result = await response.json();

      // Create download link
      const blob = new Blob([result.content || "Sample converted content"], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `converted-${selectedFile.name.split('.')[0]}.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Conversion completed!",
        description: `File converted and downloaded successfully.`,
      });

      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setOutputFormat("");
        setProgress(0);
        setIsConverting(false);
      }, 2000);

    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your file. Please try again.",
        variant: "destructive",
      });
      setIsConverting(false);
      setProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setOutputFormat("");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary mb-4">
        Convert between PDF, Word, Excel, PowerPoint, and image formats
      </p>

      {/* File Upload Area */}
      <Card>
        <CardContent className="pt-6">
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-surface-variant transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Drop files here or click to upload</h3>
              <p className="text-sm text-text-secondary mb-4">
                Supports: PDF, DOCX, XLSX, PPTX, TXT, RTF, HTML, CSV, JPG, PNG
              </p>
              <Button variant="outline">
                <FolderOpen className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.xlsx,.pptx,.txt,.rtf,.html,.csv,.jpg,.jpeg,.png"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-text-secondary">{selectedFile.size}</p>
                  </div>
                </div>
                <Button
                  onClick={handleRemoveFile}
                  size="sm"
                  variant="ghost"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Output Format Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Convert to:</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{format.label}</span>
                          <span className="text-xs text-text-secondary ml-2">
                            {format.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conversion Progress */}
              {isConverting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Converting...</span>
                    <span className="text-sm text-text-secondary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                disabled={!outputFormat || isConverting}
                className="w-full"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Convert File
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supported Formats */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-3">Supported Formats</h3>
          <div className="flex flex-wrap gap-2">
            {supportedFormats.map((format) => (
              <Badge key={format.value} variant="outline">
                {format.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
