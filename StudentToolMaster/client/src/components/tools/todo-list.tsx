import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, RotateCcw, Trash2, CheckCircle2 } from "lucide-react";

export function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["/api/todos"],
  });

  const createTodoMutation = useMutation({
    mutationFn: (todo: { title: string; priority: string }) =>
      apiRequest("POST", "/api/todos", todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setNewTodo("");
      toast({
        title: "Todo created",
        description: "Your task has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create todo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: number; completed?: boolean }) =>
      apiRequest("PUT", `/api/todos/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/todos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Todo deleted",
        description: "Your task has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      createTodoMutation.mutate({
        title: newTodo.trim(),
        priority: "medium",
      });
    }
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    updateTodoMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-12 bg-surface-variant rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Todo */}
      <div className="flex space-x-2">
        <Input
          placeholder="Add new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
          className="flex-1"
        />
        <Button 
          onClick={handleAddTodo} 
          size="sm"
          disabled={createTodoMutation.isPending}
          className="px-3"
        >
          {createTodoMutation.isPending ? (
            <RotateCcw className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Todo List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {todos.map((todo: any) => (
          <div
            key={todo.id}
            className="flex items-center space-x-3 p-2 bg-surface-variant rounded-lg group"
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
            />
            <div className="flex-1">
              <span
                className={`text-sm ${
                  todo.completed ? "line-through text-text-secondary" : ""
                }`}
              >
                {todo.title}
              </span>
            </div>
            <Badge
              variant={
                todo.priority === "high"
                  ? "destructive"
                  : todo.priority === "medium"
                  ? "secondary"
                  : "outline"
              }
            >
              {todo.priority}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-text-secondary" />
          <p>No tasks yet. Add one above!</p>
        </div>
      )}
    </div>
  );
}
