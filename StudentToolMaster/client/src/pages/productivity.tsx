import { StudyTimer } from "@/components/tools/study-timer";
import { TodoList } from "@/components/tools/todo-list";
import { NoteEditor } from "@/components/tools/note-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Timer, 
  CheckSquare, 
  EyeOff, 
  StickyNote, 
  FileText, 
  Scan,
  Sparkles,
  ShieldOff,
  Camera,
  Type
} from "lucide-react";

export default function Productivity() {
  const [focusMode, setFocusMode] = useState(false);
  const [wordCountText, setWordCountText] = useState("");
  const { toast } = useToast();

  const wordCount = wordCountText.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = wordCountText.length;

  const handleDocumentScan = () => {
    toast({
      title: "Document Scanner",
      description: "Feature will be available soon with OCR capabilities",
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Productivity Tools</h1>
          <p className="text-text-secondary mt-1">Boost your study efficiency with powerful tools</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-text-secondary font-medium">Focus Mode</span>
          <Switch 
            checked={focusMode}
            onCheckedChange={setFocusMode}
          />
          {focusMode && (
            <Badge variant="default" className="bg-green-600">
              <EyeOff className="w-3 h-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Study Timer */}
        <Card className="md:col-span-2 lg:col-span-1 card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Timer className="w-4 h-4 text-primary" />
              </div>
              <span>Pomodoro Timer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StudyTimer />
          </CardContent>
        </Card>

        {/* To-Do List */}
        <Card className="md:col-span-2 lg:col-span-1 card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600/10 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-green-600" />
              </div>
              <span>Task Manager</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TodoList />
          </CardContent>
        </Card>

        {/* Focus Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                <ShieldOff className="w-4 h-4 text-red-500" />
              </div>
              <span>Focus Mode</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Block distractions and stay focused</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Social Media</span>
                <Switch 
                  checked={focusMode}
                  onCheckedChange={setFocusMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Games</span>
                <Switch 
                  checked={false}
                  onCheckedChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">News Sites</span>
                <Switch 
                  checked={focusMode}
                  onCheckedChange={setFocusMode}
                />
              </div>
            </div>
            {focusMode && (
              <div className="mt-4 p-3 bg-primary bg-opacity-10 rounded-lg">
                <p className="text-sm text-primary">Focus mode is active! Stay concentrated.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Note Taking */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <StickyNote className="w-4 h-4 text-yellow-600" />
              </div>
              <span>Notes Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NoteEditor />
          </CardContent>
        </Card>

        {/* Word Counter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-blue-500" />
              </div>
              <span>Word Counter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              className="min-h-20 resize-none" 
              placeholder="Paste your text here..."
              value={wordCountText}
              onChange={(e) => setWordCountText(e.target.value)}
            />
            <div className="mt-3 text-sm text-text-secondary">
              <span>Words: {wordCount} • Characters: {charCount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Document Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Scan className="w-4 h-4 text-purple-500" />
              </div>
              <span>Document Scanner</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Scan documents with OCR</p>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-text-secondary mb-3">Tap to scan document</p>
              <Button onClick={handleDocumentScan} size="sm">
                Start Scanning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
