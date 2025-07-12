import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Type, 
  Link, 
  Wifi, 
  Contact, 
  RotateCcw, 
  QrCode, 
  Download, 
  X, 
  Camera 
} from "lucide-react";

interface QRData {
  text: string;
  url: string;
  wifi: {
    ssid: string;
    password: string;
    security: string;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
    organization: string;
  };
}

export function QRGenerator() {
  const [qrType, setQRType] = useState<"text" | "url" | "wifi" | "contact">("text");
  const [qrData, setQRData] = useState<QRData>({
    text: "",
    url: "",
    wifi: {
      ssid: "",
      password: "",
      security: "WPA",
    },
    contact: {
      name: "",
      phone: "",
      email: "",
      organization: "",
    },
  });
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const { toast } = useToast();

  const handleGenerateQR = async () => {
    let qrContent = "";

    switch (qrType) {
      case "text":
        qrContent = qrData.text;
        break;
      case "url":
        qrContent = qrData.url;
        break;
      case "wifi":
        qrContent = `WIFI:T:${qrData.wifi.security};S:${qrData.wifi.ssid};P:${qrData.wifi.password};;`;
        break;
      case "contact":
        qrContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${qrData.contact.name}\nTEL:${qrData.contact.phone}\nEMAIL:${qrData.contact.email}\nORG:${qrData.contact.organization}\nEND:VCARD`;
        break;
    }

    if (!qrContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter content to generate QR code.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await apiRequest("POST", "/api/generate-qr", {
        text: qrContent,
      });

      if (response.success) {
        setGeneratedQR(response.qrCode);
        toast({
          title: "QR Code generated!",
          description: "Your QR code has been created successfully.",
        });
      } else {
        throw new Error("Failed to generate QR code");
      }
    } catch (error) {
      console.error("QR generation error:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (generatedQR) {
      const link = document.createElement("a");
      link.href = generatedQR;
      link.download = `qr-code-${qrType}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleScanQR = () => {
    setScanMode(true);
    toast({
      title: "QR Scanner",
      description: "Camera-based QR scanning will be available soon.",
    });
    // In a real implementation, you would initialize camera and QR scanning
    setTimeout(() => {
      setScanMode(false);
    }, 3000);
  };

  const handleTextChange = (value: string) => {
    setQRData(prev => ({ ...prev, text: value }));
  };

  const handleUrlChange = (value: string) => {
    setQRData(prev => ({ ...prev, url: value }));
  };

  const handleWifiChange = (field: keyof QRData["wifi"], value: string) => {
    setQRData(prev => ({
      ...prev,
      wifi: { ...prev.wifi, [field]: value }
    }));
  };

  const handleContactChange = (field: keyof QRData["contact"], value: string) => {
    setQRData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary mb-4">
        Generate and scan QR codes for various content types
      </p>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate QR</TabsTrigger>
          <TabsTrigger value="scan">Scan QR</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          {/* QR Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">QR Code Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={qrType === "text" ? "default" : "outline"}
                  onClick={() => setQRType("text")}
                  size="sm"
                >
                  <Type className="w-4 h-4 mr-1" />
                  Text
                </Button>
                <Button
                  variant={qrType === "url" ? "default" : "outline"}
                  onClick={() => setQRType("url")}
                  size="sm"
                >
                  <Link className="w-4 h-4 mr-1" />
                  URL
                </Button>
                <Button
                  variant={qrType === "wifi" ? "default" : "outline"}
                  onClick={() => setQRType("wifi")}
                  size="sm"
                >
                  <Wifi className="w-4 h-4 mr-1" />
                  WiFi
                </Button>
                <Button
                  variant={qrType === "contact" ? "default" : "outline"}
                  onClick={() => setQRType("contact")}
                  size="sm"
                >
                  <Contact className="w-4 h-4 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Content</CardTitle>
            </CardHeader>
            <CardContent>
              {qrType === "text" && (
                <Textarea
                  placeholder="Enter text to encode..."
                  value={qrData.text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  rows={4}
                />
              )}

              {qrType === "url" && (
                <Input
                  placeholder="https://example.com"
                  value={qrData.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
              )}

              {qrType === "wifi" && (
                <div className="space-y-3">
                  <Input
                    placeholder="Network Name (SSID)"
                    value={qrData.wifi.ssid}
                    onChange={(e) => handleWifiChange("ssid", e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={qrData.wifi.password}
                    onChange={(e) => handleWifiChange("password", e.target.value)}
                  />
                  <Select
                    value={qrData.wifi.security}
                    onValueChange={(value) => handleWifiChange("security", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Security Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">No Password</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {qrType === "contact" && (
                <div className="space-y-3">
                  <Input
                    placeholder="Full Name"
                    value={qrData.contact.name}
                    onChange={(e) => handleContactChange("name", e.target.value)}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={qrData.contact.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                  />
                  <Input
                    placeholder="Email Address"
                    value={qrData.contact.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                  />
                  <Input
                    placeholder="Organization"
                    value={qrData.contact.organization}
                    onChange={(e) => handleContactChange("organization", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateQR}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR Code
              </>
            )}
          </Button>

          {/* Generated QR Code */}
          {generatedQR && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Generated QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <img
                      src={generatedQR}
                      alt="Generated QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Button onClick={handleDownloadQR} size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      onClick={() => setGeneratedQR(null)}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">QR Code Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {!scanMode ? (
                  <>
                    <div className="border-2 border-dashed border-border rounded-lg p-8">
                      <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-text-secondary mb-4">
                        Click to start scanning QR codes
                      </p>
                      <Button onClick={handleScanQR}>
                        <Camera className="w-4 h-4 mr-2" />
                        Start Scanner
                      </Button>
                    </div>
                    <div className="text-xs text-text-secondary">
                      <p>• Point your camera at a QR code</p>
                      <p>• Make sure the code is well-lit and in focus</p>
                      <p>• Results will appear automatically</p>
                    </div>
                  </>
                ) : (
                  <div className="border-2 border-dashed border-primary rounded-lg p-8">
                    <Camera className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                    <p className="text-sm text-text-secondary">
                      Camera scanning will be available soon...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
