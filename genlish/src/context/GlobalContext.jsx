'use client'
import Notification from "@/components/notification";
import { api, TypeHTTP } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
export const globalContext = createContext()

const GlobalProvider = ({ children }) => {

    const reload = () => {
        setTimeout(() => { globalThis.window.location.reload() }, 1000)
    }


    const data = {}
    const handler = {
        reload
    }

    return (
        <globalContext.Provider value={{ globalData: data, globalHandler: handler }}>
            {children}
        </globalContext.Provider >
    )
}

export default GlobalProvider
