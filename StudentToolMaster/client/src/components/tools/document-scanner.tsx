import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Camera, Scan, Download, FileText, Image, Upload, X, RefreshCw, Copy, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ScannedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  timestamp: Date;
  extractedText?: string;
}

export function DocumentScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedDocuments, setScannedDocuments] = useState<ScannedDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast({
        title: "Camera Access",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureDocument = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 15;
      });
    }, 300);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const newDocument: ScannedDocument = {
              id: Date.now().toString(),
              name: `scanned-document-${Date.now()}`,
              type: "image/png",
              size: (blob.size / 1024).toFixed(2) + " KB",
              url,
              timestamp: new Date(),
            };

            setScannedDocuments(prev => [...prev, newDocument]);
            clearInterval(progressInterval);
            setScanProgress(100);

            toast({
              title: "Document scanned!",
              description: "Document captured successfully.",
            });

            setTimeout(() => {
              setScanProgress(0);
              setIsScanning(false);
              stopCamera();
            }, 2000);
          }
        }, 'image/png');
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast({
        title: "Scan failed",
        description: "Unable to capture document. Please try again.",
        variant: "destructive",
      });
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processUploadedFile(file);
    }
  };

  const processUploadedFile = async (file: File) => {
    setIsScanning(true);
    setIsProcessing(true);
    setScanProgress(0);

    // Simulate processing
    const progressInterval = setInterval(() => {
      setScanProgress(prev => prev >= 90 ? 100 : prev + 20);
    }, 400);

    try {
      // Send file to backend for OCR processing
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiRequest('/api/scan-document', {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        const newDocument: ScannedDocument = {
          id: Date.now().toString(),
          name: response.filename,
          type: file.type,
          size: (file.size / 1024).toFixed(2) + " KB",
          url: response.url,
          timestamp: new Date(),
          extractedText: response.extractedText,
        };

        setScannedDocuments(prev => [...prev, newDocument]);
        setExtractedText(response.extractedText);
        clearInterval(progressInterval);
        setScanProgress(100);

        toast({
          title: "OCR Processing Complete",
          description: "Text extracted from document successfully.",
        });

        setTimeout(() => {
          setScanProgress(0);
          setIsScanning(false);
          setSelectedFile(null);
        }, 2000);
      }

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Unable to process file. Please try again.",
        variant: "destructive",
      });
      setIsScanning(false);
      setScanProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadDocument = (doc: ScannedDocument) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = `${doc.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: `${doc.name} is being downloaded.`,
    });
  };

  const deleteDocument = (id: string) => {
    setScannedDocuments(prev => {
      const doc = prev.find(d => d.id === id);
      if (doc) {
        URL.revokeObjectURL(doc.url);
      }
      return prev.filter(d => d.id !== id);
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">
        Scan physical documents using your camera or upload images to process
      </p>

      {/* Camera Scanner */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {!isCameraActive ? (
              <div className="text-center">
                <div className="border-2 border-dashed border-border rounded-lg p-8">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Camera Scanner</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Use your camera to scan documents
                  </p>
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 bg-black rounded-lg object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-center">
                        <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <p className="text-sm">Processing...</p>
                      </div>
                    </div>
                  )}
                </div>

                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Scanning...</span>
                      <span className="text-sm text-text-secondary">{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} className="w-full" />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={captureDocument}
                    disabled={isScanning}
                    className="flex-1"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Capture Document
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    disabled={isScanning}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload Document</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-text-secondary mb-4">
                Upload images or PDFs to process
              </p>
              <Button
                onClick={() => document.getElementById('doc-upload')?.click()}
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <input
                id="doc-upload"
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OCR Results */}
      {extractedText && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Extracted Text (OCR)
                </h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    navigator.clipboard.writeText(extractedText);
                    toast({
                      title: "Text Copied",
                      description: "Extracted text copied to clipboard.",
                    });
                  }}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    const blob = new Blob([extractedText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'extracted_text.txt';
                    link.click();
                    URL.revokeObjectURL(url);
                  }}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanned Documents */}
      {scannedDocuments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Scanned Documents</h3>
            <div className="space-y-3">
              {scannedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-surface-variant rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {doc.type.startsWith('image') ? (
                        <Image className="w-5 h-5 text-primary" />
                      ) : (
                        <FileText className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-text-secondary">
                        {doc.size} • {doc.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => downloadDocument(doc)}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteDocument(doc.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-3">Scanner Features</h3>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline">Auto crop</Badge>
            <Badge variant="outline">PDF export</Badge>
            <Badge variant="outline">OCR ready</Badge>
            <Badge variant="outline">Multi-page</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}