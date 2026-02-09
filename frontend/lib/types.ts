export type Priority = "HIGH" | "MEDIUM" | "LOW"
export type Status = "TODO" | "IN_PROGRESS" | "COMPLETED"

export interface Task {
    taskId: number
    title: string
    description: string
    priority: Priority
    status: Status
}

export interface User {
    userId: number
    username: string
    email: string
    password: string
}

export interface CreateTaskPayload {
    title: string
    description: string
    priority: Priority
    status: Status
}

export interface RegisterPayload {
    username: string
    email: string
    password: string
}
