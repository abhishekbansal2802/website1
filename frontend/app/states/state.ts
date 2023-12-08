"use client"

import { create } from "zustand";

interface GenerationState {
    user: User | undefined,
    loggedIn: boolean,
    setUser: (newUser: User | undefined) => void,
    setLoggedIn: (newLoggedIn: boolean) => void
}

interface User {
    name: string,
    email: string
    contact: string
}

export const useGenerationState = create<GenerationState>()((set) => ({

    user: undefined,
    loggedIn: false,
    setUser: (newUser: User | undefined) => set({ user: newUser }),
    setLoggedIn: (newLoggedIn: boolean) => set({ loggedIn: newLoggedIn })

}))