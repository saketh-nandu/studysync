import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Plus } from "lucide-react";

export function NoteEditor() {
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["/api/notes"],
  });

  const createNoteMutation = useMutation({
    mutationFn: (note: { title: string; content: string }) =>
      apiRequest("POST", "/api/notes", note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setTitle("");
      setContent("");
      setIsEditing(false);
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: number; title?: string; content?: string }) =>
      apiRequest("PUT", `/api/notes/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsEditing(false);
      setSelectedNote(null);
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setSelectedNote(null);
      setTitle("");
      setContent("");
      toast({
        title: "Note deleted",
        description: "Your note has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveNote = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    if (selectedNote) {
      updateNoteMutation.mutate({
        id: selectedNote.id,
        title: title.trim(),
        content: content.trim(),
      });
    } else {
      createNoteMutation.mutate({
        title: title.trim(),
        content: content.trim(),
      });
    }
  };

  const handleEditNote = (note: any) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-16 bg-surface-variant rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Notes</h3>
        <Button onClick={handleNewNote} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          New Note
        </Button>
      </div>

      {/* Editor */}
      {isEditing ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSaveNote}
                  disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                >
                  <span className="material-icons text-sm mr-1">save</span>
                  Save
                </Button>
                <Button onClick={handleCancelEdit} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Note List */
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notes.map((note: any) => (
            <Card key={note.id} className="cursor-pointer hover:bg-surface-variant">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1" onClick={() => handleEditNote(note)}>
                    <h4 className="font-medium text-sm">{note.title}</h4>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {note.content}
                    </p>
                    <p className="text-xs text-text-secondary mt-2">
                      {format(new Date(note.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNoteMutation.mutate(note.id);
                    }}
                  >
                    <span className="material-icons text-sm">delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {notes.length === 0 && !isEditing && (
        <div className="text-center py-8 text-text-secondary">
          <span className="material-icons text-4xl mb-2">note</span>
          <p>No notes yet. Create your first note!</p>
        </div>
      )}
    </div>
  );
}
