
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { payloadContext } from '@/context/PayloadContext'
import { api, TypeHTTP } from '@/utils/api'
import { mainColor } from '@/utils/color'
import { convertSecondsToTimeFormat } from '@/utils/time'
import React, { useContext, useState } from 'react'

const ThemAi = ({ visible, hidden }) => {

    const [currentStep, setCurrentStep] = useState(1)
    const { payloadData, payloadHandler } = useContext(payloadContext)
    const { notifyHandler } = useContext(notifyContext)
    const [title, setTitle] = useState('')
    const [level, setLevel] = useState('')


    const handleCreateAi = () => {
        const body = {
            title,
            level
        };

        api({ type: TypeHTTP.POST, sendToken: false, body, path: '/gate/save' })
            .then(gate => {
                notifyHandler.notify(notifyType.SUCCESS, 'Thêm Thành Công')
                globalThis.window.location.reload()
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }

    return (
        <div style={visible ? { height: '200px', width: '700px', transition: '0.3s', backgroundImage: 'url(/bg-form.jpg)', backgroundSize: 'cover', overflow: 'hidden' } : { height: 0, width: 0, transition: '0.3s', overflow: 'hidden' }} className='z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {(visible) && (
                <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex overflow-auto h-[100%]'>
                    <div className='min-w-[100%] px-[1.5rem] py-[1rem] flex flex-col gap-3'>
                        <span className='font-semibold text-[#393939] text-[18px]'>Thêm Chương Học</span>
                        <div className='grid grid-cols-2 gap-3 w-full'>
                            <input value={title} onChange={e => setTitle(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Tên Ải Từ Vựng' />
                            <input value={level} onChange={e => setLevel(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Level' />
                            <div />
                            <div className='flex justify-end items-center'>
                                <button onClick={() => handleCreateAi()} className='hover:scale-[1.02] transition my-[0.25rem] font-semibold rounded-[10px] px-[2rem] py-[12px] text-[white] bg-[#241d49]'>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
        </div>
    )
}

export default ThemAi