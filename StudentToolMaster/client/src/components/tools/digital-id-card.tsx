import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Upload, 
  Camera, 
  Edit, 
  Download, 
  QrCode, 
  User, 
  GraduationCap, 
  Calendar, 
  Hash,
  Shield,
  Check
} from "lucide-react";

interface StudentInfo {
  name: string;
  studentId: string;
  program: string;
  year: string;
  email: string;
  phone: string;
  emergencyContact: string;
  profileImage: string;
  validUntil: string;
}

export function DigitalIDCard() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: "Demo Student",
    studentId: "2024001234",
    program: "Computer Science",
    year: "2025",
    email: "demo.student@university.edu",
    phone: "(555) 123-4567",
    emergencyContact: "(555) 987-6543",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
    validUntil: "Dec 2025"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(studentInfo);
  const [isVerified, setIsVerified] = useState(true);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditForm(prev => ({ ...prev, profileImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setStudentInfo(editForm);
    setIsEditing(false);
    toast({
      title: "ID Card Updated",
      description: "Your digital ID card has been successfully updated.",
    });
  };

  const handleDownload = () => {
    // Create a canvas to generate the ID card as an image
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Background
      ctx.fillStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      ctx.fillRect(0, 0, 400, 250);

      // Text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(studentInfo.name, 20, 50);
      ctx.font = '14px Arial';
      ctx.fillText(studentInfo.program, 20, 75);
      ctx.fillText(`Class of ${studentInfo.year}`, 20, 95);
      ctx.fillText(`ID: ${studentInfo.studentId}`, 20, 130);
      ctx.fillText(`Valid Until: ${studentInfo.validUntil}`, 20, 155);

      // Download
      const link = document.createElement('a');
      link.download = `student-id-${studentInfo.studentId}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Download Started",
        description: "Your digital ID card is being downloaded.",
      });
    }
  };

  const generateQRCode = () => {
    const qrData = {
      studentId: studentInfo.studentId,
      name: studentInfo.name,
      program: studentInfo.program,
      validUntil: studentInfo.validUntil
    };

    toast({
      title: "QR Code Generated",
      description: "QR code contains your verification data.",
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">
        Your digital student ID card with verification features
      </p>

      {/* Digital ID Card */}
      <Card className="relative overflow-hidden">
        <div className="gradient-primary text-white p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
          
          {/* Verification Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" />
              {isVerified ? 'Verified' : 'Pending'}
            </Badge>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-20 h-20 ring-2 ring-white/20">
                <AvatarImage src={studentInfo.profileImage} alt={studentInfo.name} />
                <AvatarFallback className="text-lg">
                  {studentInfo.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{studentInfo.name}</h2>
                <p className="text-lg opacity-90">{studentInfo.program}</p>
                <p className="text-sm opacity-75">Class of {studentInfo.year}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="opacity-75 mb-1">Student ID</p>
                <p className="font-medium flex items-center">
                  <Hash className="w-4 h-4 mr-1" />
                  {studentInfo.studentId}
                </p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Valid Until</p>
                <p className="font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {studentInfo.validUntil}
                </p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Program</p>
                <p className="font-medium flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  {studentInfo.program}
                </p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Status</p>
                <p className="font-medium flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Contact Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-text-secondary">Email</Label>
              <p className="text-sm">{studentInfo.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-text-secondary">Phone</Label>
              <p className="text-sm">{studentInfo.phone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-text-secondary">Emergency Contact</Label>
              <p className="text-sm">{studentInfo.emergencyContact}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Info
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit ID Card Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Input
                  id="program"
                  value={editForm.program}
                  onChange={(e) => setEditForm(prev => ({ ...prev, program: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Graduation Year</Label>
                <Input
                  id="year"
                  value={editForm.year}
                  onChange={(e) => setEditForm(prev => ({ ...prev, year: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Profile Photo</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={handleDownload} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        <Button onClick={generateQRCode} variant="outline">
          <QrCode className="w-4 h-4 mr-2" />
          Generate QR
        </Button>
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline">Digital Signature</Badge>
            <Badge variant="outline">Tamper Detection</Badge>
            <Badge variant="outline">QR Verification</Badge>
            <Badge variant="outline">Biometric Ready</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}