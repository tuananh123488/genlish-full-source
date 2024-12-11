import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { userContext } from "./UserContext";
import { api, TypeHTTP } from "../utils/api";
export const payloadContext = createContext()

const PayLoadProvider = ({ children }) => {

    const [currentStepSignUp, setCurrentStepSignUp] = useState(0)
    const [course, setCourse] = useState()
    const { userData } = useContext(userContext)
    const [studyCourse, setStudyCourse] = useState()
    const [time, setTime] = useState()
    const [currentEpisode, setCurrentEpisode] = useState()
    const [currentIndex, setCurrentIndex] = useState()
    const [handleChangeEpisode, setHandleChangeEpisode] = useState()

    //broad cast
    const [currentBroadCast, setCurrentBroadCast] = useState()

    // payment
    const [currentCourse, setCurrentCourse] = useState(false)

    useEffect(() => {
        if (userData.user?._id, course?._id) {
            api({ sendToken: true, type: TypeHTTP.GET, path: `/studycourse/get-by-student-and-course?studentid=${userData.user?._id}&courseid=${course._id}` })
                .then(res => setStudyCourse(res))
        }
    }, [userData.user?._id, course?._id])

    const data = {
        currentStepSignUp,
        course,
        studyCourse,
        time,
        currentEpisode,
        currentIndex,
        handleChangeEpisode,
        currentBroadCast,
        currentCourse
    }

    const handler = {
        setCurrentStepSignUp,
        setCourse,
        setStudyCourse,
        setTime,
        setCurrentEpisode,
        setCurrentIndex,
        setHandleChangeEpisode,
        setCurrentBroadCast,
        setCurrentCourse
    }

    return (
        <payloadContext.Provider value={{ payloadData: data, payloadHandler: handler }}>
            {children}
        </payloadContext.Provider>
    )
}

export default PayLoadProvider