'use client'

import { createContext, useContext, useEffect, useRef, useState } from "react";
export const payloadContext = createContext()

const PayloadProvider = ({ children }) => {

    // dùng để Note theo thời gian bài học
    const [course, setCourse] = useState()
    const [studyCourse, setStudyCourse] = useState()
    const [time, setTime] = useState()
    const [currentEpisode, setCurrentEpisode] = useState()

    // navigate sau khi signin (dung cho course public)
    const [target, setTarget] = useState('')

    const data = {
        studyCourse, time, course, currentEpisode, target
    }

    const handler = {
        setStudyCourse, setTime, setCourse, setCurrentEpisode, setTarget
    }

    return (
        <payloadContext.Provider value={{ payloadData: data, payloadHandler: handler }}>
            {children}
        </payloadContext.Provider >
    )
}

export default PayloadProvider
