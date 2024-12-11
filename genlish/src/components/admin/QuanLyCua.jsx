import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { handleFileUpload } from '@/utils/file'
import React, { useContext, useEffect } from 'react'

const QuanLyCua = ({ cua, setCua, gates, currentAi, setCurrentAi }) => {
    const { notifyHandler } = useContext(notifyContext)

    const handleCreateCua = () => {
        api({ type: TypeHTTP.POST, sendToken: false, body: { ...cua }, path: '/door/save-or-update' })
            .then(door => {
                notifyHandler.notify(notifyType.SUCCESS, 'Thêm Thành Công')
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }

    useEffect(() => {
        if (currentAi) {
            setCua({ ...cua, gate: { _id: currentAi._id, title: currentAi.title, level: currentAi.level } })
        }
    }, [currentAi])

    return (
        <div className='w-full p-[1rem] flex flex-col gap-2'>
            <div className='flex items-center'>
                <i onClick={() => setCurrentAi()} className='bx bx-chevron-left text-[30px] cursor-pointer text-[#333333]'></i>
                <span className='font-semibold'>Quản Lý Danh Sách Bài Học</span>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <input value={cua.individual.title} onChange={e => setCua({ ...cua, individual: { ...cua.individual, title: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Tên Cửa Từ Vựng' />
                <input value={cua.individual.image} onChange={e => setCua({ ...cua, individual: { ...cua.individual, image: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Ảnh Cửa Từ Vựng' />
                <input value={cua.individual.numberOfTest} onChange={e => setCua({ ...cua, individual: { ...cua.individual, numberOfTest: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Số Bài Kiểm Tra' />
                <input value={cua.individual.color} onChange={e => setCua({ ...cua, individual: { ...cua.individual, color: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Màu Sắc' />
                <input value={cua.individual.door} onChange={e => setCua({ ...cua, individual: { ...cua.individual, door: e.target.value } })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Cửa' />
                <div />
                <span className='font-bold'>Beginner (excel)</span>
                <span className='font-bold'>Elementary (excel)</span>
                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, beginner: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, elementary: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                <span className='font-bold'>Intermediate (excel)</span>
                <span className='font-bold'>UpperIntermediate (excel)</span>
                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, intermediate: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, upperIntermediate: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                <span className='font-bold'>Advanced (excel)</span>
                <div></div>
                <input onChange={(e) => { handleFileUpload(e).then(res => setCua({ ...cua, advanced: res })) }} accept=".xlsx, .xls" type='file' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                <div></div>
            </div>
            <button onClick={() => handleCreateCua()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[10%] py-[7px] rounded-lg">Thêm</button>
        </div>
    )
}

export default QuanLyCua