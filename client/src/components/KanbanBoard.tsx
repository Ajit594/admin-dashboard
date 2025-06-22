import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog";
import type { Task } from "@shared/schema";

export function KanbanBoard() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json() as Promise<Task[]>;
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return apiRequest("PUT", `/api/tasks/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  const columns = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in-progress", title: "In Progress", status: "in-progress" },
    { id: "done", title: "Done", status: "done" }
  ];

  const getTasksByStatus = (status: string) => {
    return tasks?.filter(task => task.status === status) || [];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "design":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
      case "frontend":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300";
      case "backend":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300";
      case "docs":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("text/plain", taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("text/plain"));
    updateTaskMutation.mutate({ id: taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="h-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Board</CardTitle>
          <AddTaskDialog />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            
            return (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-muted-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
                
                <div
                  className="min-h-[200px] space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.status)}
                >
                  {columnTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium flex-1">{task.title}</h4>
                          <DeleteTaskDialog task={task} />
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={getCategoryColor(task.category)}>
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          </Badge>
                          {task.assigneeAvatar && (
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName || ""} />
                              <AvatarFallback className="text-xs">
                                {task.assigneeName?.split(' ').map(n => n[0]).join('') || '?'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        
                        {task.status === "in-progress" && task.progress !== undefined && (
                          <div className="space-y-1">
                            <Progress value={task.progress} className="h-1.5" />
                            <p className="text-xs text-muted-foreground">{task.progress}% complete</p>
                          </div>
                        )}
                        
                        {task.status === "done" && (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Completed</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
