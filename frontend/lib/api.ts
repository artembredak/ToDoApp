import type {
    CreateTaskPayload,
    RegisterPayload,
    Task,
    User,
    Status,
} from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// =======================
// USER ENDPOINTS
// =======================

export async function registerUser(payload: RegisterPayload): Promise<User> {
    const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Registration failed")
    }

    return res.json()
}

export async function loginUser(email: string, password: string): Promise<User> {
    const params = new URLSearchParams({ email, password })

    const res = await fetch(`${API_BASE}/users/login?${params.toString()}`, {
        method: "POST",
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Login failed")
    }

    return res.json()
}

export async function deleteUser(email: string, password: string): Promise<void> {
    const params = new URLSearchParams({ email, password })

    const res = await fetch(`${API_BASE}/users/delete?${params.toString()}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Delete user failed")
    }
}

// =======================
// TASK ENDPOINTS
// =======================

export async function fetchTasks(
    username: string,
    email: string
): Promise<Task[]> {
    const params = new URLSearchParams({ username, email })

    const res = await fetch(`${API_BASE}/tasks?${params.toString()}`)

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to fetch tasks")
    }

    return res.json()
}

export async function fetchTasksByStatus(
    username: string,
    email: string,
    status: Status
): Promise<Task[]> {
    const params = new URLSearchParams({ username, email, status })

    const res = await fetch(`${API_BASE}/tasks/by-status?${params.toString()}`)

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to fetch tasks by status")
    }

    return res.json()
}

export async function createTask(
    payload: CreateTaskPayload,
    username: string,
    email: string
): Promise<Task> {
    const params = new URLSearchParams({ username, email })

    const res = await fetch(`${API_BASE}/tasks/create?${params.toString()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to create task")
    }

    return res.json()
}

export async function updateTask(
    taskId: number,
    payload: CreateTaskPayload
): Promise<Task> {
    const params = new URLSearchParams({ taskId: taskId.toString() })

    const res = await fetch(`${API_BASE}/tasks/${taskId}?${params.toString()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to update task")
    }

    return res.json()
}

export async function deleteTask(taskId: number): Promise<void> {
    const params = new URLSearchParams({ taskId: taskId.toString() })

    const res = await fetch(`${API_BASE}/tasks/${taskId}?${params.toString()}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to delete task")
    }
}
