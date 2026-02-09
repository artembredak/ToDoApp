"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Task, Status, CreateTaskPayload } from "@/lib/types"
import { fetchTasks, fetchTasksByStatus, createTask, updateTask, deleteTask, deleteUser } from "@/lib/api"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, LogOut, Trash2 } from "lucide-react"

type FilterStatus = "ALL" | Status

const filters: { value: FilterStatus; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "TODO", label: "To do" },
    { value: "IN_PROGRESS", label: "In progress" },
    { value: "COMPLETED", label: "Done" },
]

export function Dashboard() {
    const { user, logout } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterStatus>("ALL")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
    const [showDeleteAccount, setShowDeleteAccount] = useState(false)
    const [deletePassword, setDeletePassword] = useState("")
    const [deleteAccountError, setDeleteAccountError] = useState("")
    const [deletingAccount, setDeletingAccount] = useState(false)

    const loadTasks = useCallback(async () => {
        if (!user) return
        setLoading(true)
        try {
            const data =
                filter === "ALL"
                    ? await fetchTasks(user.username, user.email)
                    : await fetchTasksByStatus(user.username, user.email, filter)
            setTasks(data)
        } catch {
            /* ignore */
        } finally {
            setLoading(false)
        }
    }, [user, filter])

    useEffect(() => {
        loadTasks()
    }, [loadTasks])

    async function handleSave(payload: CreateTaskPayload) {
        if (!user) return
        if (editingTask) {
            await updateTask(editingTask.taskId, payload)
        } else {
            await createTask({ ...payload, status: "TODO" }, user.username, user.email)
        }
        await loadTasks()
    }

    async function handleDelete() {
        if (deleteConfirmId === null) return
        try {
            await deleteTask(deleteConfirmId)
            await loadTasks()
        } finally {
            setDeleteConfirmId(null)
        }
    }

    async function handleDeleteAccount() {
        if (!user || !deletePassword) return
        setDeletingAccount(true)
        setDeleteAccountError("")
        try {
            await deleteUser(user.email, deletePassword)
            logout()
        } catch (err) {
            setDeleteAccountError(err instanceof Error ? err.message : "Failed to delete account")
        } finally {
            setDeletingAccount(false)
        }
    }

    function openCreate() {
        setEditingTask(null)
        setDialogOpen(true)
    }

    return (
        <div className="mx-auto min-h-screen max-w-xl px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Tasks</h1>
                    <p className="text-sm text-muted-foreground">{user?.username}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={openCreate} className="gap-1.5">
                        <Plus className="h-4 w-4" />
                        New
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={logout}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Sign out"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setDeletePassword("")
                            setDeleteAccountError("")
                            setShowDeleteAccount(true)
                        }}
                        className="text-destructive hover:text-destructive"
                        aria-label="Delete account"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-4 flex gap-1">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        type="button"
                        onClick={() => setFilter(f.value)}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                            filter === f.value
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Tasks */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="py-16 text-center">
                    <p className="text-sm text-muted-foreground">
                        {filter === "ALL" ? "No tasks yet." : "No tasks here."}
                    </p>
                    {filter === "ALL" && (
                        <Button size="sm" variant="outline" onClick={openCreate} className="mt-3 bg-transparent">
                            Create your first task
                        </Button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.taskId}
                            task={task}
                            onEdit={(t) => {
                                setEditingTask(t)
                                setDialogOpen(true)
                            }}
                            onDelete={setDeleteConfirmId}
                        />
                    ))}
                </div>
            )}

            <TaskDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                task={editingTask}
                onSave={handleSave}
            />

            <AlertDialog
                open={deleteConfirmId !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteConfirmId(null)
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete task?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your account and all your tasks. Enter your password to confirm.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex flex-col gap-2 py-2">
                        <Label htmlFor="delete-password" className="text-sm">
                            Password
                        </Label>
                        <Input
                            id="delete-password"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                        {deleteAccountError && (
                            <p className="text-xs text-destructive">{deleteAccountError}</p>
                        )}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={!deletePassword || deletingAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deletingAccount ? "Deleting..." : "Delete account"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
