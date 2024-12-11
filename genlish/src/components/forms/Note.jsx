
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { payloadContext } from '@/context/PayloadContext'
import { api, TypeHTTP } from '@/utils/api'
import { mainColor } from '@/utils/color'
import { convertSecondsToTimeFormat } from '@/utils/time'
import React, { useContext, useState } from 'react'

const Note = ({ visible, hidden }) => {

    const [currentStep, setCurrentStep] = useState(1)
    const { payloadData, payloadHandler } = useContext(payloadContext)
    const [note, setNote] = useState('')
    const { notifyHandler } = useContext(notifyContext)
    const handleSubmitNote = () => {
        const body = {
            ...payloadData.studyCourse,
            note: payloadData.studyCourse.note === '' ? `${payloadData.currentEpisode}-${payloadData.time}:${note}` : payloadData.studyCourse.note + `\n${payloadData.currentEpisode}-${payloadData.time}:${note}`
        }
        api({ type: TypeHTTP.PUT, sendToken: true, path: `/studycourse/update/${payloadData.studyCourse._id}`, body })
            .then(res => {
                payloadHandler.setStudyCourse(res)
                setNote('')
                payloadHandler.setTime()
                hidden()
                notifyHandler.notify(notifyType.SUCCESS, 'Ghi chú thành công')
            })
    }

    return (
        <div style={visible ? { height: '350px', width: '700px', transition: '0.3s', backgroundImage: 'url(/bg-form.jpg)', backgroundSize: 'cover', overflow: 'hidden' } : { height: 0, width: 0, transition: '0.3s', overflow: 'hidden' }} className='z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {(visible && payloadData.time && payloadData.studyCourse && payloadData.currentEpisode) && (
                <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex overflow-auto h-[100%]'>
                    <div className='min-w-[100%] px-[1.5rem] py-[1rem] flex flex-col gap-3'>
                        <span>Thêm Ghi Chú tại <b>{convertSecondsToTimeFormat(payloadData.time)}</b></span>
                        <textarea value={note} onChange={e => setNote(e.target.value)} className='focus:outline-none px-4 py-3 w-full h-full border-[1px] border-[#dfdfdf] rounded-lg' />
                        <div className='w-full flex justify-end'>
                            <button onClick={() => handleSubmitNote()} style={{ backgroundColor: mainColor }} className='px-6 py-2 rounded-3xl font-semibold text-[white]'>Thêm Ghi Chú</button>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
        </div>
    )
}

export default Note