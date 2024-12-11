'use client'
import Notification from "@/components/notification";
import { api, TypeHTTP } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authContext } from "./AuthContext";
export const studyContext = createContext()

const StudyProvider = ({ children }) => {

    const [doors, setDoors] = useState([])
    const [gates, setGates] = useState([])
    const [currentGate, setCurrentGate] = useState()
    const { authData } = useContext(authContext)
    const [showSchedule, setShowSchedule] = useState(true)

    useEffect(() => {
        if (authData.user) {
            api({ type: TypeHTTP.GET, path: '/gate/get-all', sendToken: false, })
                .then(gates => {
                    setGates(gates)
                    setCurrentGate(gates[authData.user.study.levelVocabulary.gate - 1])
                })
        }
    }, [authData.user])

    useEffect(() => {
        if (gates.length > 0 && currentGate) {
            api({ sendToken: false, path: `/door/get-by-gate/${currentGate?._id}`, type: TypeHTTP.GET })
                .then(doors => setDoors(doors))
        }
    }, [gates, currentGate])

    const data = {
        doors,
        gates,
        currentGate,
        showSchedule
    }

    const handler = {
        setDoors,
        setGates,
        setCurrentGate,
        setShowSchedule
    }

    return (
        <studyContext.Provider value={{ studyData: data, studyHandler: handler }}>
            {children}
        </studyContext.Provider >
    )
}

export default StudyProvider
