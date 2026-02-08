import type { Task, TaskDto, User, UserDto, Status } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }
  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

// ─── User endpoints ───

export async function registerUser(dto: UserDto): Promise<User> {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  return handleResponse<User>(res)
}

export async function loginUser(email: string, password: string): Promise<User> {
  const params = new URLSearchParams({ email, password })
  const res = await fetch(`${API_BASE}/users/login?${params}`, {
    method: "POST",
  })
  return handleResponse<User>(res)
}

export async function deleteUser(email: string, password: string): Promise<void> {
  const params = new URLSearchParams({ email, password })
  const res = await fetch(`${API_BASE}/users/delete?${params}`, {
    method: "DELETE",
  })
  return handleResponse<void>(res)
}

// ─── Task endpoints ───

export async function createTask(dto: TaskDto, username: string): Promise<Task> {
  const params = new URLSearchParams({ username })
  const res = await fetch(`${API_BASE}/tasks/create?${params}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  return handleResponse<Task>(res)
}

export async function fetchTasks(username: string): Promise<Task[]> {
  const params = new URLSearchParams({ username })
  const res = await fetch(`${API_BASE}/tasks?${params}`)
  return handleResponse<Task[]>(res)
}

export async function updateTask(taskId: number, dto: TaskDto): Promise<Task> {
  const params = new URLSearchParams({ taskId: String(taskId) })
  const res = await fetch(`${API_BASE}/tasks/${taskId}?${params}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  return handleResponse<Task>(res)
}

export async function deleteTask(taskId: number): Promise<void> {
  const params = new URLSearchParams({ taskId: String(taskId) })
  const res = await fetch(`${API_BASE}/tasks/${taskId}?${params}`, {
    method: "DELETE",
  })
  return handleResponse<void>(res)
}

export async function fetchTasksByStatus(username: string, status: Status): Promise<Task[]> {
  const params = new URLSearchParams({ username, status })
  const res = await fetch(`${API_BASE}/tasks/by-status?${params}`)
  return handleResponse<Task[]>(res)
}
