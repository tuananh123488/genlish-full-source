
import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { payloadContext } from '@/context/PayloadContext'
import { api, TypeHTTP } from '@/utils/api'
import { mainColor } from '@/utils/color'
import { handleImageUpload } from '@/utils/file'
import { convertSecondsToTimeFormat } from '@/utils/time'
import React, { useContext, useState } from 'react'

const ThemKhoaHoc = ({ visible, hidden }) => {

    const [currentStep, setCurrentStep] = useState(1)
    const { payloadData, payloadHandler } = useContext(payloadContext)
    const { notifyHandler } = useContext(notifyContext)
    const { authData } = useContext(authContext)

    //data
    const [image, setImage] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [level, setLevel] = useState('')
    const [result, setResult] = useState('')
    const [type, setType] = useState('')

    const handleCreate = () => {
        const body = {
            image, title, description, price, level, result, type,
            teacher: {
                _id: authData.user._id,
                fullName: authData.user.fullName,
                avatar: authData.user.avatar
            },
            slug: title.toLowerCase().split(' ').join('-')
        }
        api({ type: TypeHTTP.POST, body, sendToken: true, path: '/course/create' })
            .then(res => {
                notifyHandler.notify(notifyType.SUCCESS, 'Tạo khóa học thành công, hãy chờ quản trị viên xét duyệt')
                // notify
                const body1 = {
                    toUser: {
                        _id: 'admin',
                        fullName: 'admin',
                        avatar: 'admin'
                    },
                    fromUser: {
                        _id: authData.user._id,
                        fullName: authData.user.fullName,
                        avatar: authData.user.avatar
                    },
                    content: `${authData.user.fullName} yêu cầu phê duyệt khóa học "${title}"`,
                    type: 'notify'
                }
                api({ type: TypeHTTP.POST, sendToken: false, path: '/notification/save', body: body1 })
                setTimeout(() => {
                    notifyHandler.reload()
                }, (1000));
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }

    return (
        <div style={visible ? { height: '350px', width: '700px', transition: '0.3s', backgroundImage: 'url(/bg-form.jpg)', backgroundSize: 'cover', overflow: 'hidden' } : { height: 0, width: 0, transition: '0.3s', overflow: 'hidden' }} className='z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {(visible) && (
                <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex overflow-auto h-[100%]'>
                    <div className='min-w-[100%] px-[1.5rem] py-[1rem] flex flex-col gap-3'>
                        <span className='font-semibold text-[#393939] text-[18px]'>Thêm Khóa học</span>
                        <div className='grid grid-cols-2 gap-3 w-full'>
                            <input value={title} onChange={e => setTitle(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Title' />
                            <input value={price} onChange={e => setPrice(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Price' />
                            <input value={level} onChange={e => setLevel(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Level' />
                            <select onChange={e => setType(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]'>
                                <option value={null}>Hình Thức Phí</option>
                                <option value={'free'}>Miễn Phí</option>
                                <option value={'pay'}>Trả Phí</option>
                            </select>
                            <textarea value={result} onChange={e => setResult(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[100px] px-[1rem] border-[1px] border-[#e1e1e1] py-2' placeholder='Result' />
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[100px] px-[1rem] border-[1px] border-[#e1e1e1] py-2' placeholder='Description' />
                            <div className='flex items-center overflow-hidden'>
                                <span>Image: </span>
                                <input onChange={(e) => handleImageUpload(e).then(res => setImage(res))} type='file' className='rounded-lg text-[15px] focus:outline-0 translate-y-[10px] shadow-sm h-[45px] px-[1rem]' />
                            </div>
                            <div className='flex justify-end items-center'>
                                <button onClick={() => handleCreate()} className='hover:scale-[1.02] transition my-[0.25rem] font-semibold rounded-[10px] px-[2rem] py-[12px] text-[white] bg-[#241d49]'>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
        </div>
    )
}

export default ThemKhoaHoc