"use client"

import type { Task } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

const priorityStyles = {
  HIGH: "border-l-red-500",
  MEDIUM: "border-l-amber-500",
  LOW: "border-l-blue-500",
}

const statusLabels = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  COMPLETED: "Done",
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className={`group border border-border rounded-lg p-4 border-l-4 ${priorityStyles[task.priority]} bg-card hover:bg-accent/50 transition-colors`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>{task.priority.toLowerCase()}</span>
            <span className="text-border">|</span>
            <span>{statusLabels[task.status]}</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Task options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.taskId)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
