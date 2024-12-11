import React, { useContext, useEffect, useRef, useState } from 'react'
import Introduce from './Introduce'
import Step from './Step'
import Gate from './Gate'
import { api, TypeHTTP } from '@/utils/api'
import { authContext } from '@/context/AuthContext'
import { studyContext } from '@/context/StudyContext'

const StudySchedule = () => {

    const [doors, setDoors] = useState([])
    const [gates, setGates] = useState([])
    const { studyData } = useContext(studyContext)
    const studyScheduleRef = useRef()
    const [top, setTop] = useState(0)

    useEffect(() => {
        if (studyScheduleRef.current && top !== 0) {
            studyScheduleRef.current.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
    }, [top])

    return (
        <div ref={studyScheduleRef} className='w-[66%] flex flex-col items-center h-screen overflow-auto'>
            {studyData.doors.map((door, index) => (
                <Gate setTop={setTop} key={index} door={door} />
            ))}
        </div>
    )
}

export default StudySchedule