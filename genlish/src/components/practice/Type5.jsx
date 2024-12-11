import React, { useContext, useEffect, useState } from 'react'
import FormResult from './FormResult'
import { practiceContext } from '@/context/PracticeContext'
import { pronounces } from '@/utils/practice'

const Type5 = ({ question, index }) => {

    const { practiceData, practiceHandler } = useContext(practiceContext)


    return (
        <div className='w-[50%] flex flex-col gap-2 mt-4'>
            <span className='text-[23px] font-semibold'>Dịch Câu Sau</span>
            <div className='flex items-center gap-4'>
                <img src='/logo.png' className='w-[100px] animate-slight-move' />
                <div className="flex items-start transition-all">
                    <div className="relative max-w-xs px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg">
                        <span className="block">{question.question}</span>
                        <span className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-blue-500"></span>
                    </div>
                </div>
            </div>
            <textarea placeholder='Viết Tiếng Anh' onChange={e => practiceHandler.setMyAnswer(e.target.value)} className='w-[100%] h-[120px] focus:outline-0 p-2 text-[14px] border-[#d3d3d3] border-[1px] rounded-md '>

            </textarea>
        </div>
    )
}

export default Type5