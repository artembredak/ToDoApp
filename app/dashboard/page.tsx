"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { taskApi, type Task, type TaskDto } from "@/lib/api"
import { TaskCard } from "@/components/task-card"
import { TaskForm } from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Plus, Search, LogOut } from "lucide-react"

type StatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadTasks = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await taskApi.findAll(user.username)
      setTasks(data)
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleCreateTask = async (data: TaskDto) => {
    if (!user) return
    await taskApi.create({ ...data, status: "TODO" }, user.username)
    await loadTasks()
  }

  const handleUpdateTask = async (data: TaskDto) => {
    if (!editingTask) return
    await taskApi.update(editingTask.taskId, data)
    await loadTasks()
    setEditingTask(null)
  }

  const handleDeleteTask = async () => {
    if (deleteTaskId === null) return
    setIsDeleting(true)
    try {
      await taskApi.delete(deleteTaskId)
      await loadTasks()
    } finally {
      setIsDeleting(false)
      setDeleteTaskId(null)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "To do", value: "TODO" },
    { label: "In progress", value: "IN_PROGRESS" },
    { label: "Done", value: "COMPLETED" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.username}</span>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-4 max-w-3xl mx-auto w-full">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
              className="shrink-0"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Tasks */}
        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">Loading...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "ALL" ? "No tasks found" : "No tasks yet"}
            </p>
            {!searchQuery && statusFilter === "ALL" && (
              <Button variant="outline" onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.taskId}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t)
                  setIsFormOpen(true)
                }}
                onDelete={(id) => setDeleteTaskId(id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Form Dialog */}
      <TaskForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingTask(null)
        }}
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteTaskId !== null} onOpenChange={(open) => !open && setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
