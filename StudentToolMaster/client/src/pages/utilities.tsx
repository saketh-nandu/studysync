import { useState } from "react";
import { DocumentConverter } from "@/components/tools/document-converter";
import { QRGenerator } from "@/components/tools/qr-generator";
import { DocumentScanner } from "@/components/tools/document-scanner";
import { DigitalIDCard } from "@/components/tools/digital-id-card";
import { AIChatbot } from "@/components/tools/ai-chatbot";
import { FileManager } from "@/components/tools/file-manager";
import { CalendarSync } from "@/components/tools/calendar-sync";
import { EmailTemplates } from "@/components/tools/email-templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Wrench, 
  Sparkles, 
  RefreshCw, 
  QrCode, 
  CreditCard, 
  Bot, 
  Rss, 
  ClipboardList,
  Plus,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Music,
  Mail,
  Database,
  Folder,
  GraduationCap,
  Scan
} from "lucide-react";

export default function Utilities() {
  const { data: newsFeeds = [] } = useQuery({
    queryKey: ["/api/news-feed"],
  });

  const [attendanceData, setAttendanceData] = useState<{subject: string; percentage: number; color: string}[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  const addSubject = () => {
    if (newSubject.trim()) {
      setAttendanceData(prev => [...prev, {
        subject: newSubject.trim(),
        percentage: 100,
        color: "text-success"
      }]);
      setNewSubject('');
      setIsAddingSubject(false);
    }
  };

  const markAttendance = (subject: string, present: boolean) => {
    setAttendanceData(prev => prev.map(item => {
      if (item.subject === subject) {
        const newPercentage = present ? Math.min(100, item.percentage + 2) : Math.max(0, item.percentage - 5);
        return {
          ...item,
          percentage: newPercentage,
          color: newPercentage >= 90 ? 'text-success' : newPercentage >= 75 ? 'text-warning' : 'text-error'
        };
      }
      return item;
    }));
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Utilities & Tools</h1>
          <p className="text-text-secondary mt-1">Essential tools for student life management</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-orange-50">
            <Wrench className="w-3 h-3 mr-1" />
            Utilities
          </Badge>
          <Badge variant="outline" className="bg-indigo-50">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Document Converter */}
        <Card className="card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-blue-600" />
              </div>
              <span>File Converter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentConverter />
          </CardContent>
        </Card>

        {/* QR Generator & Scanner */}
        <Card className="card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600/10 rounded-lg flex items-center justify-center">
                <QrCode className="w-4 h-4 text-indigo-600" />
              </div>
              <span>QR Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QRGenerator />
          </CardContent>
        </Card>

        {/* Digital ID Card */}
        <Card className="card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-600/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-yellow-600" />
              </div>
              <span>Digital ID Card</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DigitalIDCard />
          </CardContent>
        </Card>

        {/* Document Scanner - Full Width */}
        <Card className="card-hover animate-scale-in md:col-span-2 lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600/10 rounded-lg flex items-center justify-center">
                <Scan className="w-4 h-4 text-red-600" />
              </div>
              <span>Document Scanner & OCR</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentScanner />
          </CardContent>
        </Card>

        {/* Attendance Tracking */}
        <Card className="card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600/10 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-green-600" />
              </div>
              <span>Attendance Tracker</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Track attendance for your subjects</p>
            
            {attendanceData.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Subjects Added</h3>
                <p className="text-text-secondary mb-4">Add your subjects to start tracking attendance</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attendanceData.map((item, index) => (
                  <div key={index} className="bg-surface-variant p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.subject}</span>
                      <span className={`text-sm font-bold ${item.color}`}>
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.percentage >= 90 ? 'bg-green-500' :
                          item.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => markAttendance(item.subject, true)}
                      >
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => markAttendance(item.subject, false)}
                      >
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isAddingSubject ? (
              <div className="flex space-x-2 mt-4">
                <Input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Enter subject name"
                  onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                />
                <Button size="sm" onClick={addSubject}>
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsAddingSubject(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddingSubject(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Subject
              </Button>
            )}
          </CardContent>
        </Card>

        {/* College News Feed */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Rss className="w-4 h-4 text-primary" />
              </div>
              <span>College News Feed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Campus news and updates</p>
            <div className="space-y-4">
              {newsFeeds.length > 0 ? (
                newsFeeds.map((news: any) => (
                  <div key={news.id} className="bg-surface-variant p-4 rounded-lg">
                    {news.imageUrl && (
                      <img 
                        src={news.imageUrl} 
                        alt={news.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-medium mb-2">{news.title}</h3>
                    <p className="text-sm text-text-secondary mb-2">{news.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">
                        {format(new Date(news.createdAt), 'MMM d, yyyy')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="ml-1">{news.likes}</span>
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <img 
                    src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=150" 
                    alt="University campus"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <p className="text-text-secondary">No news updates available</p>
                  <Button size="sm" className="mt-2">Add News</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Chatbot */}
        <Card className="card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600/10 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-600" />
              </div>
              <span>AI Study Assistant</span>
              <Badge variant="outline" className="ml-auto text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIChatbot />
          </CardContent>
        </Card>

        {/* File Manager */}
        <Card className="card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600/10 rounded-lg flex items-center justify-center">
                <Folder className="w-4 h-4 text-emerald-600" />
              </div>
              <span>File Manager</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileManager />
          </CardContent>
        </Card>
      </div>

      {/* Additional Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Calendar Sync */}
        <Card className="card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <span>Calendar Sync</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarSync />
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card className="card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-600/10 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-pink-600" />
              </div>
              <span>Email Templates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmailTemplates />
          </CardContent>
        </Card>

        {/* Study Playlist */}
        <Card className="card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600/10 rounded-lg flex items-center justify-center">
                <Music className="w-4 h-4 text-teal-600" />
              </div>
              <span>Study Music</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">Focus-enhancing music playlists</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-16 flex-col space-y-1">
                  <Music className="w-5 h-5" />
                  <span className="text-xs">Lo-fi Hip Hop</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-1">
                  <Music className="w-5 h-5" />
                  <span className="text-xs">Classical</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-1">
                  <Music className="w-5 h-5" />
                  <span className="text-xs">Ambient</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-1">
                  <Music className="w-5 h-5" />
                  <span className="text-xs">Nature Sounds</span>
                </Button>
              </div>
              <div className="text-center">
                <Button size="sm" className="w-full">
                  <Music className="w-4 h-4 mr-2" />
                  Open Music Player
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
