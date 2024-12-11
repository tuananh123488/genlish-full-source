'use client'
import FormSignIn from "@/components/FormSignIn";
import Notification from "@/components/notification";
import { api, TypeHTTP } from "@/utils/api";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { notifyContext } from "./NotifyContext";
export const authContext = createContext()

const AuthProvider = ({ children }) => {
    const { notifyHandler } = useContext(notifyContext)
    const [user, setUser] = useState()
    const [visibleSignIn, setVisibleSignIn] = useState(false)
    const pathname = usePathname()

    //check route
    useEffect(() => {
        const accessToken = globalThis.window.localStorage.getItem('accessToken')
        const refreshToken = globalThis.window.localStorage.getItem('refreshToken')
        const privateRoutes = ['learn', 'practice', 'broad-casts', 'communicate-with-ai', 'hoso', 'vocabulary', 'course', 'teacher', 'admin']
        if (pathname.split('/')[1] !== 'ai-public') {
            if (privateRoutes.includes(pathname.split('/')[1])) {
                if (!accessToken || !refreshToken) {
                    notifyHandler.navigate('/')
                } else {
                    api({ type: TypeHTTP.POST, path: '/auth/find-user-by-token', sendToken: true })
                        .then(res => {
                            setUser(res)
                            if (res.statusSignUp !== 7) {
                                notifyHandler.navigate('/getting-started')
                            }
                        })
                        .catch(error => {
                            notifyHandler.navigate('/')
                        })
                }
            } else {
                if (accessToken && refreshToken) {
                    api({ type: TypeHTTP.POST, path: '/auth/find-user-by-token', sendToken: true })
                        .then(res => {
                            if (res) {
                                setUser(res)
                                if (res.role === 'TEACHER') {
                                    notifyHandler.navigate('/teacher')
                                } else if (res.role === 'ADMIN') {
                                    notifyHandler.navigate('/admin')
                                } else {
                                    if (res?.statusSignUp === 7) {
                                        notifyHandler.navigate('/course')
                                    } else {
                                        notifyHandler.navigate('/getting-started')
                                    }
                                }
                            }
                        })
                }
            }
        }
    }, [pathname])

    const hiddenSignIn = () => {
        setVisibleSignIn(false)
    }

    const showSignIn = () => {
        setVisibleSignIn(true)
    }

    const data = {
        user
    }
    const handler = {
        setUser,
        hiddenSignIn,
        showSignIn
    }

    return (
        <authContext.Provider value={{ authData: data, authHandler: handler }}>
            <FormSignIn visible={visibleSignIn} hidden={hiddenSignIn} />
            {children}
        </authContext.Provider >
    )
}

export default AuthProvider
