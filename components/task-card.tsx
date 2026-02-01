"use client"

import type { Task } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

const priorityConfig = {
  HIGH: { label: "High", className: "bg-red-500/10 text-red-500 border-red-500/20" },
  MEDIUM: { label: "Medium", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  LOW: { label: "Low", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
}

const statusConfig = {
  TODO: { label: "To Do", icon: Clock, className: "bg-muted text-muted-foreground" },
  IN_PROGRESS: { label: "In Progress", icon: AlertTriangle, className: "bg-yellow-500/10 text-yellow-500" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, className: "bg-primary/10 text-primary" },
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority]
  const status = statusConfig[task.status]
  const StatusIcon = status.icon

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-border/80 transition-all group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-medium leading-snug text-foreground">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
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
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn("text-xs", priority.className)}>
            {priority.label}
          </Badge>
          <Badge variant="outline" className={cn("text-xs", status.className)}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
