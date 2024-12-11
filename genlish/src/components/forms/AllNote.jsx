
import { payloadContext } from '@/context/PayloadContext'
import { api, TypeHTTP } from '@/utils/api'
import { mainColor } from '@/utils/color'
import { convertSecondsToTimeFormat } from '@/utils/time'
import React, { useContext, useEffect, useState } from 'react'

const AllNote = ({ visible, hidden }) => {

    const [currentStep, setCurrentStep] = useState(1)
    const { payloadData, payloadHandler } = useContext(payloadContext)
    const [notes, setNotes] = useState([])
    const [open, setOpen] = useState(-1)

    useEffect(() => {
        if (payloadData.studyCourse?.note && payloadData.course) {
            const listNote = payloadData.studyCourse.note.split('\n')
            let listCourse = payloadData.course.list_course
            listCourse = listCourse.map((item, index) => {
                const filter = listNote.filter(item1 => Number(item1.split('-')[0]) === index + 1)
                return {
                    ...item,
                    notes: filter.map(item1 => ({
                        time: Number(item1.split('-')[1].split(':')[0]),
                        note: item1.split('-')[1].split(':')[1]
                    }))
                }
            })
            setNotes(listCourse)
        }
    }, [payloadData.studyCourse?.note, payloadData.course])

    return (
        <div style={visible ? { height: '500px', width: '700px', transition: '0.3s', backgroundImage: 'url(/bg-form.jpg)', backgroundSize: 'cover', overflow: 'hidden' } : { height: 0, width: 0, transition: '0.3s', overflow: 'hidden' }} className='z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {(visible && payloadData.studyCourse) && (
                <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex overflow-auto h-[100%]'>
                    <div className='min-w-[100%] px-[1.5rem] py-[1rem] flex flex-col gap-3'>
                        <span className='text-[17px] font-semibold'>Tất Cả Ghi Chú ({payloadData.course.title})</span>
                        <div className='w-full h-[92%] flex flex-col gap-2 overflow-auto'>
                            {notes.map((note, index) => {
                                if (note.notes.length > 0) {
                                    return <div style={{ transition: '0.5s' }} key={index} className='w-full flex flex-col'>
                                        <div onClick={() => open === index ? setOpen(-1) : setOpen(index)} className='cursor-pointer h-[50px] relative gap-2 px-5 flex items-center w-full bg-[#efefef] rounded-lg'>
                                            <span>{index + 1}.</span>
                                            <span className='flex flex-col text-[15px]'>
                                                {note.title}
                                            </span>
                                            <span style={{ backgroundColor: mainColor }} className='absolute w-5 h-5 rounded-full text-[white] flex justify-center items-center right-3 top-[50%] text-[13px] translate-y-[-50%]'>
                                                {note.notes.length}
                                            </span>
                                        </div>
                                        <div style={{ transition: '0.7s', height: open === index ? 'auto' : 0 }} className='flex flex-col overflow-hidden'>
                                            {note.notes.map((item, index1) => (
                                                <div key={index1} className='px-[2rem] py-2 relative gap-2 flex items-center w-full rounded-lg'>
                                                    <span className='flex flex-col text-[14px]'>
                                                        {convertSecondsToTimeFormat(item.time)}:
                                                    </span>
                                                    <span className='flex flex-col text-[14px]'>
                                                        {item.note}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
                            })}
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
        </div>
    )
}

export default AllNote