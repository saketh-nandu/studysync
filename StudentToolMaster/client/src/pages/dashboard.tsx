import { useQuery } from "@tanstack/react-query";
import { StudyTimer } from "@/components/tools/study-timer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Clock, 
  TrendingUp, 
  GraduationCap, 
  Zap, 
  Timer, 
  PlusCircle, 
  Calendar,
  BookOpen,
  CalendarCheck,
  CheckCircle
} from "lucide-react";

export default function Dashboard() {
  const { data: todos = [], isLoading: todosLoading } = useQuery({
    queryKey: ["/api/todos"],
  });

  const { data: schedules = [], isLoading: schedulesLoading } = useQuery({
    queryKey: ["/api/schedules"],
  });

  const { data: studySessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/study-sessions"],
  });

  const incompleteTodos = todos.filter((todo: any) => !todo.completed);
  const todaySchedules = schedules.filter((schedule: any) => {
    const today = new Date();
    const scheduleDate = new Date(schedule.startTime);
    return scheduleDate.toDateString() === today.toDateString();
  });

  const totalStudyTime = studySessions.reduce((total: number, session: any) => {
    return total + session.duration;
  }, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Welcome Card */}
      <Card className="gradient-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Welcome back, Student! 🎓
              </h2>
              <p className="text-blue-100 mb-4 text-lg">
                You have {incompleteTodos.length} tasks and {todaySchedules.length} events today
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-medium">Study Time: {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Keep it up!</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center w-32 h-32 bg-white/10 rounded-2xl">
              <GraduationCap className="w-16 h-16 text-white/80" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col space-y-2 card-hover border-2 hover:border-primary hover:bg-primary/5"
              onClick={() => window.location.href = "/productivity"}
            >
              <Timer className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">Study Timer</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col space-y-2 card-hover border-2 hover:border-green-500 hover:bg-green-50"
              onClick={() => window.location.href = "/productivity"}
            >
              <PlusCircle className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium">Quick Note</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col space-y-2 card-hover border-2 hover:border-orange-500 hover:bg-orange-50"
              onClick={() => window.location.href = "/utilities"}
            >
              <Calendar className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium">Timetable</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col space-y-2 card-hover border-2 hover:border-purple-500 hover:bg-purple-50"
              onClick={() => window.location.href = "/academic"}
            >
              <BookOpen className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium">Flashcards</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {schedulesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-surface-variant rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : todaySchedules.length > 0 ? (
            <div className="space-y-3">
              {todaySchedules.map((schedule: any) => (
                <div key={schedule.id} className="flex items-center space-x-3 p-3 bg-surface-variant rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    schedule.type === 'class' ? 'bg-primary' : 
                    schedule.type === 'exam' ? 'bg-error' : 
                    schedule.type === 'assignment' ? 'bg-warning' : 'bg-success'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium">{schedule.title}</p>
                    <p className="text-sm text-text-secondary">
                      {format(new Date(schedule.startTime), 'h:mm a')} - {format(new Date(schedule.endTime), 'h:mm a')}
                      {schedule.location && ` • ${schedule.location}`}
                    </p>
                  </div>
                  <Badge variant={
                    schedule.type === 'class' ? 'default' : 
                    schedule.type === 'exam' ? 'destructive' : 
                    schedule.type === 'assignment' ? 'secondary' : 'outline'
                  }>
                    {schedule.type}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <CalendarCheck className="w-12 h-12 mx-auto mb-2 text-text-secondary" />
              <p>No events scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {todosLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-surface-variant rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : incompleteTodos.length > 0 ? (
            <div className="space-y-3">
              {incompleteTodos.slice(0, 5).map((todo: any) => (
                <div key={todo.id} className="flex items-center space-x-3 p-3 bg-surface-variant rounded-lg">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary rounded"
                    checked={todo.completed}
                    readOnly
                  />
                  <div className="flex-1">
                    <p className="font-medium">{todo.title}</p>
                    {todo.description && (
                      <p className="text-sm text-text-secondary">{todo.description}</p>
                    )}
                  </div>
                  <Badge variant={
                    todo.priority === 'high' ? 'destructive' : 
                    todo.priority === 'medium' ? 'secondary' : 'outline'
                  }>
                    {todo.priority}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-text-secondary" />
              <p>All tasks completed! Great job!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
