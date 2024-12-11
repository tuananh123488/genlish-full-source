import React, { useContext, useEffect, useRef, useState } from 'react'
import Introduce from './Introduce'
import Step from './Step'
import SpiritBeast from './SpiritBeast'
import { getPosition } from '@/utils/other'
import { authContext } from '@/context/AuthContext'

const Gate = ({ door, setTop }) => {
    const wrapperRef = useRef()
    const [steps, setSteps] = useState([])
    const [width, setWidth] = useState(0)
    const [numberOfBeast, setNumberOfBeast] = useState([])
    const { authData } = useContext(authContext)

    useEffect(() => {
        if (steps.length > 0) {
            const num = Math.floor(steps.length / 4)
            setNumberOfBeast(() => {
                const arr = []
                for (let i = 0; i < num; i++)
                    arr.push(1)
                return arr
            })
        }
    }, [steps])

    useEffect(() => {
        if (door) {
            const arr = []
            for (let i = 1; i <= door.individual.numberOfTest; i++) {
                arr.push(i)
            }
            setSteps(arr)
        }
    }, [door])

    useEffect(() => {
        if (wrapperRef.current) {
            setWidth(wrapperRef.current.offsetWidth)
        }
    }, [wrapperRef.current])


    return (
        <div ref={wrapperRef} className='flex py-[1rem] flex-col items-center w-full'>
            <Introduce door={door} />
            <div className='mt-[3rem] flex flex-col relative w-full items-center gap-3'>
                {steps.map((step, index) => (
                    <Step setTop={setTop} level={index + 1} final={index === steps.length - 1 ? true : false} door={door} left={door.individual.door % 2 ? true : false} margin={getPosition(width, index + 1)} key={index} />
                ))}
                {numberOfBeast.map((beast, index) => (
                    <SpiritBeast key={index} index={index} top={((100 / numberOfBeast.length) * index) + (50 / numberOfBeast.length)} left={door.individual.door % 2 ? false : true} />
                ))}
            </div>
        </div>
    )
}

export default Gate