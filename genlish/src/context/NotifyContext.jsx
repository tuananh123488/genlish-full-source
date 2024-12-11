'use client'
import FormLoading from "@/components/FormLoading";
import Notification from "@/components/notification";
import { api, TypeHTTP } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
export const notifyContext = createContext()

export const notifyType = {
    SUCCESS: 'success',
    FAIL: 'fail',
    WARNING: 'warning',
    LOADING: 'loading',
    NONE: 'none'
}

const NotifyProvider = ({ children }) => {
    const router = useRouter()
    const [info, setInfo] = useState({ status: notifyType.NONE, message: '' })
    const [loading, setLoading] = useState(false)
    const [oldPathname, setOldPathname] = useState('')
    const pathname = usePathname()

    const notify = (status, message) => setInfo({ status, message })

    const navigate = (route) => {
        setOldPathname(pathname)
        setLoading(true)
        setTimeout(() => {
            router.push(route)
        }, 500);
    }

    const reload = () => {
        globalThis.window.location.reload()
    }

    useEffect(() => {
        if (info.status !== notifyType.NONE) {
            if (info.status !== notifyType.LOADING) {
                setTimeout(() => {
                    setInfo({ status: notifyType.NONE, message: '' })
                }, 3000);
            }
        }
    }, [info.status])


    const data = {}
    const handler = {
        notify,
        navigate,
        reload
    }

    return (
        <notifyContext.Provider value={{ notifyData: data, notifyHandler: handler }}>
            <Notification status={info.status} message={info.message} setInfomation={setInfo} />
            <FormLoading visible={loading} setLoading={setLoading} oldPathname={oldPathname} pathname={pathname} />
            {children}
        </notifyContext.Provider >
    )
}

export default NotifyProvider
