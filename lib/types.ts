export type Status = "TODO" | "IN_PROGRESS" | "COMPLETED"

export type Priority = "HIGH" | "MEDIUM" | "LOW"

export interface Task {
  taskId: number
  title: string
  description: string
  priority: Priority
  status: Status
}

export interface TaskDto {
  title: string
  description: string
  priority: Priority
  status: Status
}

export interface User {
  userId: number
  username: string
  email: string
  password?: string
}

export interface UserDto {
  username: string
  email: string
  password: string
}
