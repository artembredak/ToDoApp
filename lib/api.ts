// API Configuration - Update this to match your Spring Boot backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Types based on your Spring Boot entities
export interface User {
  id: number
  username: string
  email: string
}

export interface Task {
  taskId: number
  title: string
  description: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
}

export interface UserDto {
  username: string
  email: string
  password: string
}

export interface TaskDto {
  title: string
  description: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
}

// User API
export const userApi = {
  register: async (data: UserDto): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Registration failed")
    }
    return response.json()
  },

  findByUsername: async (username: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/username/${username}`)
    if (!response.ok) throw new Error("User not found")
    return response.json()
  },

  login: async (username: string, password: string): Promise<User> => {
    const response = await fetch(
      `${API_BASE_URL}/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      { method: "POST" }
    )
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Invalid credentials")
    }
    return response.json()
  },

  findByEmail: async (email: string): Promise<User | null> => {
    const response = await fetch(`${API_BASE_URL}/users/email/${email}`)
    if (!response.ok) return null
    return response.json()
  },

  delete: async (email: string, password: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/users/delete?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      { method: "DELETE" }
    )
    if (!response.ok) throw new Error("Delete failed")
  },
}

// Task API
export const taskApi = {
  create: async (taskDto: TaskDto, username: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/create?username=${encodeURIComponent(username)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskDto),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Failed to create task")
    }
    return response.json()
  },

  findAll: async (username: string): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks?username=${encodeURIComponent(username)}`)
    if (!response.ok) throw new Error("Failed to fetch tasks")
    return response.json()
  },

  update: async (taskId: number, taskDto: TaskDto): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}?taskId=${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskDto),
    })
    if (!response.ok) throw new Error("Failed to update task")
    return response.json()
  },

  delete: async (taskId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}?taskId=${taskId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete task")
  },

  findByStatus: async (username: string, status: Task["status"]): Promise<Task[]> => {
    const response = await fetch(
      `${API_BASE_URL}/tasks/by-status?username=${encodeURIComponent(username)}&status=${status}`
    )
    if (!response.ok) throw new Error("Failed to fetch tasks")
    return response.json()
  },
}
