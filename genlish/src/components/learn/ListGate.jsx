import { studyContext } from '@/context/StudyContext'
import { gradients } from '@/utils/color'
import React, { useContext } from 'react'

const ListGate = () => {

    const { studyData, studyHandler } = useContext(studyContext)

    return (
        <div className=' w-[95%] flex flex-wrap h-screen py-[1rem] px-[2rem] gap-2 overflow-y-auto'>
            {studyData.gates.map((gate, index) => (
                <div onClick={() => {
                    studyHandler.setCurrentGate(gate)
                    setTimeout(() => {
                        studyHandler.setShowSchedule(true)
                    }, 1000)
                }} style={{ background: gradients.reverse()[index] }} className='flex justify-center items-center flex-col w-[230px] cursor-pointer h-[230px] rounded-xl' key={index}>
                    <span className='text-[white] text-[30px] font-semibold'>Level {gate.level}</span>
                    <span className='text-[white] text-[18px]'>{gate.title}</span>
                    <img src={`/beast-${index + 1}.gif`} className='w-auto top-0 left-[50%] h-[110px] z-50' />
                </div>
            ))}
        </div>
    )
}

export default ListGate