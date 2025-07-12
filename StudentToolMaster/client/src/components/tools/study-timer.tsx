import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTimer } from "@/hooks/use-timer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw, Briefcase, Coffee, Clock } from "lucide-react";

export function StudyTimer() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"pomodoro" | "short" | "long">("pomodoro");
  const [subject, setSubject] = useState("");
  
  const durations = {
    pomodoro: 25 * 60, // 25 minutes
    short: 5 * 60,     // 5 minutes
    long: 15 * 60      // 15 minutes
  };

  const { 
    timeLeft, 
    isRunning, 
    start, 
    pause, 
    reset, 
    isCompleted 
  } = useTimer(durations[mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    try {
      await apiRequest("POST", "/api/study-sessions", {
        duration: durations[mode] / 60,
        subject: subject || "General Study",
        type: mode,
      });
      
      toast({
        title: "Session Completed!",
        description: `Great job! You studied for ${durations[mode] / 60} minutes.`,
      });
    } catch (error) {
      console.error("Failed to save study session:", error);
    }
  };

  useEffect(() => {
    if (isCompleted) {
      handleComplete();
    }
  }, [isCompleted]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mode Selection */}
      <div className="flex space-x-2 justify-center">
        <Button 
          size="lg" 
          variant={mode === "pomodoro" ? "default" : "outline"}
          onClick={() => setMode("pomodoro")}
          className="flex-1 h-12"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Pomodoro 25m
        </Button>
        <Button 
          size="lg" 
          variant={mode === "short" ? "default" : "outline"}
          onClick={() => setMode("short")}
          className="flex-1 h-12"
        >
          <Coffee className="w-4 h-4 mr-2" />
          Break 5m
        </Button>
        <Button 
          size="lg" 
          variant={mode === "long" ? "default" : "outline"}
          onClick={() => setMode("long")}
          className="flex-1 h-12"
        >
          <Clock className="w-4 h-4 mr-2" />
          Long 15m
        </Button>
      </div>

      {/* Timer Display */}
      <Card className="animate-scale-in">
        <CardContent className="pt-8 pb-6">
          <div className="text-center space-y-6">
            {/* Circular Progress */}
            <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
              <div 
                className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin"
                style={{
                  animationDuration: isRunning ? '2s' : '0s',
                  opacity: isRunning ? 1 : 0.3
                }}
              ></div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {formatTime(timeLeft)}
                </div>
                <Badge variant={isRunning ? "default" : "secondary"} className="text-sm">
                  {mode === "pomodoro" ? "Work Time" : mode === "short" ? "Short Break" : "Long Break"}
                </Badge>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {!isRunning ? (
                <Button onClick={start} size="lg" className="px-8">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={pause} size="lg" variant="outline" className="px-8">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={reset} size="lg" variant="outline" className="px-8">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Input */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Study Subject</label>
            <input
              type="text"
              placeholder="What are you studying? (e.g., Mathematics, History)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
