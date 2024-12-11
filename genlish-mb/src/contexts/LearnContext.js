import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { Alert } from "react-native";
import { userContext } from "./UserContext";
import { api, TypeHTTP } from "../utils/api";
export const learnContext = createContext()

const LearnProvider = ({ children }) => {

    const [doors, setDoors] = useState([])
    const [gates, setGates] = useState([])
    const [currentGate, setCurrentGate] = useState()
    const { userData } = useContext(userContext)
    const [showSchedule, setShowSchedule] = useState(false)

    useEffect(() => {
        if (userData.user) {
            api({ type: TypeHTTP.GET, path: '/gate/get-all', sendToken: false, })
                .then(gates => {
                    setGates(gates)
                    setCurrentGate(gates[userData.user.study.levelVocabulary.gate - 1])
                })
        }
    }, [userData.user])

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
        <learnContext.Provider value={{ learnData: data, learnHandler: handler }}>
            {children}
        </learnContext.Provider>
    )
}

export default LearnProvider