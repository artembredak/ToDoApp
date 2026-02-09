"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"
import type { User } from "./types"

interface AuthState {
    user: User | null
    setUser: (u: User | null) => void
    logout: () => void
}

const AuthContext = createContext<AuthState>({
    user: null,
    setUser: () => {},
    logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    function logout() {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
