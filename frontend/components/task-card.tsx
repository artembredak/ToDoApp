"use client"

import type { Task } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pencil, Trash2, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle } from "lucide-react"

const priorityConfig = {
    HIGH: {
        label: "High",
        className: "bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/15",
        icon: ArrowUpCircle,
    },
    MEDIUM: {
        label: "Medium",
        className: "bg-chart-3/15 text-chart-3 border-chart-3/20 hover:bg-chart-3/15",
        icon: ArrowRightCircle,
    },
    LOW: {
        label: "Low",
        className: "bg-accent/15 text-accent border-accent/20 hover:bg-accent/15",
        icon: ArrowDownCircle,
    },
}

const statusConfig = {
    TODO: {
        label: "To Do",
        className: "bg-muted text-muted-foreground border-border hover:bg-muted",
    },
    IN_PROGRESS: {
        label: "In Progress",
        className: "bg-primary/15 text-primary border-primary/20 hover:bg-primary/15",
    },
    COMPLETED: {
        label: "Completed",
        className: "bg-accent/15 text-accent border-accent/20 hover:bg-accent/15",
    },
}

interface TaskCardProps {
    task: Task
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const priority = priorityConfig[task.priority]
    const status = statusConfig[task.status]
    const PriorityIcon = priority.icon

    return (
        <Card className="group transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <h3 className="font-semibold text-card-foreground leading-snug truncate">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className={priority.className}>
                            <PriorityIcon className="mr-1 h-3 w-3" />
                            {priority.label}
                        </Badge>
                        <Badge variant="outline" className={status.className}>
                            {status.label}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(task)}
                        aria-label={`Edit task ${task.title}`}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(task.taskId)}
                        aria-label={`Delete task ${task.title}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            {task.description && (
                <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {task.description}
                    </p>
                </CardContent>
            )}
        </Card>
    )
}
