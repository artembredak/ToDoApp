"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { taskApi, type Task, type TaskDto } from "@/lib/api"
import { TaskCard } from "@/components/task-card"
import { TaskForm } from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { CheckCircle2, Plus, Search, LogOut, User, Loader2, ListTodo, Clock, CheckCheck } from "lucide-react"

type StatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Delete confirmation
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

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Group tasks by status for display
  const todoTasks = filteredTasks.filter((t) => t.status === "TODO")
  const inProgressTasks = filteredTasks.filter((t) => t.status === "IN_PROGRESS")
  const completedTasks = filteredTasks.filter((t) => t.status === "COMPLETED")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-semibold text-foreground">TaskFlow</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden sm:inline text-foreground">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
            <p className="text-muted-foreground mt-1">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border-border/50"
            />
          </div>
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="ALL" className="gap-1.5">
                <ListTodo className="h-4 w-4" />
                <span className="hidden sm:inline">All</span>
              </TabsTrigger>
              <TabsTrigger value="TODO" className="gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">To Do</span>
              </TabsTrigger>
              <TabsTrigger value="IN_PROGRESS" className="gap-1.5">
                <Loader2 className="h-4 w-4" />
                <span className="hidden sm:inline">In Progress</span>
              </TabsTrigger>
              <TabsTrigger value="COMPLETED" className="gap-1.5">
                <CheckCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Completed</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <ListTodo className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "ALL"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first task"}
            </p>
            {!searchQuery && statusFilter === "ALL" && (
              <Button onClick={() => setIsFormOpen(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            )}
          </div>
        ) : statusFilter === "ALL" ? (
          <div className="space-y-8">
            {/* To Do Section */}
            {todoTasks.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  To Do ({todoTasks.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todoTasks.map((task) => (
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
              </section>
            )}

            {/* In Progress Section */}
            {inProgressTasks.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Loader2 className="h-4 w-4" />
                  In Progress ({inProgressTasks.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inProgressTasks.map((task) => (
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
              </section>
            )}

            {/* Completed Section */}
            {completedTasks.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCheck className="h-4 w-4" />
                  Completed ({completedTasks.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedTasks.map((task) => (
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
              </section>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
