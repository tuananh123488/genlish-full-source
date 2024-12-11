import { studyContext } from '@/context/StudyContext'
import React, { useContext } from 'react'

const Introduce = ({ door }) => {

    const { studyHandler } = useContext(studyContext)

    return (
        <div style={{ backgroundColor: door?.individual?.color }} className='flex items-center justify-between text-[white] w-[80%] px-[2rem] py-2 rounded-lg'>
            <div className='flex flex-col'>
                <div className='flex items-center text-[#ffffff] gap-2'>
                    <i onClick={() => {
                        studyHandler.setShowSchedule(false)
                        studyHandler.setCurrentGate()
                    }} className='bx cursor-pointer bx-left-arrow-alt text-[30px]'></i>
                    <span className='text-[17px] font-medium'>{door?.gate?.title}, Cửa {door?.individual?.door}</span>
                </div>
                <span className='ml-2 text-[18px] font-extrabold'>{door?.individual?.title}</span>
            </div>
            <button className="bg-[white] hover:scale-[1.06] transition-all text-[#149dff] border-[1px] border-[#e4e4e4] font-bold text-[15px] w-[30%] py-[5px] rounded-lg">Chi Tiết</button>
        </div>
    )
}

export default Introduce