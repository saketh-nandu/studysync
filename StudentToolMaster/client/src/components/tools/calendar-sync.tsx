import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Download, Share2, Plus, X } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'class' | 'assignment' | 'exam' | 'meeting' | 'personal';
  reminder: string;
  attendees: string[];
}

export function CalendarSync() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    date: new Date(),
    time: '',
    location: '',
    type: 'personal',
    reminder: '15 minutes',
    attendees: []
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-500';
      case 'assignment': return 'bg-red-500';
      case 'exam': return 'bg-orange-500';
      case 'meeting': return 'bg-green-500';
      case 'personal': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getDayEvents = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.time) {
      toast({
        title: "Missing information",
        description: "Please fill in the event title and time.",
        variant: "destructive",
      });
      return;
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      description: newEvent.description || '',
      date: newEvent.date || new Date(),
      time: newEvent.time!,
      location: newEvent.location || '',
      type: newEvent.type as CalendarEvent['type'] || 'personal',
      reminder: newEvent.reminder || '15 minutes',
      attendees: newEvent.attendees || []
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      description: '',
      date: new Date(),
      time: '',
      location: '',
      type: 'personal',
      reminder: '15 minutes',
      attendees: []
    });
    setIsCreating(false);

    toast({
      title: "Event created",
      description: `"${event.title}" has been added to your calendar.`,
    });
  };

  const handleExportCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//StudySync//Calendar//EN
${events.map(event => `BEGIN:VEVENT
UID:${event.id}@studysync.com
DTSTART:${event.date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT`).join('\n')}
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'studysync-calendar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Calendar exported",
      description: "Your calendar has been exported as an ICS file.",
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "Event deleted",
      description: "The event has been removed from your calendar.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Calendar Sync</h3>
          <p className="text-sm text-text-secondary">
            Manage your academic schedule and sync with external calendars
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportCalendar} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Event description (optional)"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newEvent.type} onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value as CalendarEvent['type'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class">Class</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Event location"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent}>
                    Create Event
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>
                {selectedDate ? selectedDate.toLocaleDateString() : 'Today'}
              </span>
              <Badge variant="outline">
                {selectedDate ? getDayEvents(selectedDate).length : 0} events
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDate && getDayEvents(selectedDate).length > 0 ? (
                getDayEvents(selectedDate).map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)} mt-2`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{event.title}</h4>
                        <Button
                          onClick={() => handleDeleteEvent(event.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-text-secondary">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-text-secondary">No events for this date</p>
                  <Button
                    onClick={() => setIsCreating(true)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {events.filter(e => e.type === 'class').length}
              </div>
              <p className="text-sm text-text-secondary">Classes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {events.filter(e => e.type === 'assignment').length}
              </div>
              <p className="text-sm text-text-secondary">Assignments</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {events.filter(e => e.type === 'exam').length}
              </div>
              <p className="text-sm text-text-secondary">Exams</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.type === 'meeting').length}
              </div>
              <p className="text-sm text-text-secondary">Meetings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}