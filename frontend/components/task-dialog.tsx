"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Task, Priority, Status, CreateTaskPayload } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface TaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    task: Task | null
    onSave: (payload: CreateTaskPayload) => Promise<void>
}

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
    const isEditing = task !== null

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<Priority>("MEDIUM")
    const [status, setStatus] = useState<Status>("TODO")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (open) {
            if (task) {
                setTitle(task.title)
                setDescription(task.description || "")
                setPriority(task.priority)
                setStatus(task.status)
            } else {
                setTitle("")
                setDescription("")
                setPriority("MEDIUM")
                setStatus("TODO")
            }
            setError("")
        }
    }, [open, task])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) {
            setError("Title is required")
            return
        }
        setLoading(true)
        setError("")
        try {
            await onSave({ title, description, priority, status })
            onOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save task")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Task" : "New Task"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Update the details of your task."
                                : "Fill in the details for your new task."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                        {error && (
                            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="task-title">Title</Label>
                            <Input
                                id="task-title"
                                placeholder="What needs to be done?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="task-description">Description</Label>
                            <Textarea
                                id="task-description"
                                placeholder="Add more details (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="task-priority">Priority</Label>
                            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                                <SelectTrigger id="task-priority">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="LOW">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {isEditing && (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="task-status">Status</Label>
                                <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                                    <SelectTrigger id="task-status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODO">To Do</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isEditing ? "Save Changes" : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
