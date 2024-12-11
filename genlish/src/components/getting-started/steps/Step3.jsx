import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useState } from 'react'

const Step3 = ({ setCurrentStep, currentStep }) => {

    const { authData, authHandler } = useContext(authContext)
    const { notifyHandler } = useContext(notifyContext)

    const [info, setInfo] = useState({
        fullName: '',
        dob: null,
        gender: null,
        address: ''
    })

    const handleChangeStep = () => {
        if (info.fullName === '' || info.address === '' || info.gender === null || info.dob === null) {
            notifyHandler.notify(notifyType.WARNING, 'Không được để trống')
            return
        }
        const nameRegex = /^[A-Za-zÀ-ÿ\s]{2,}$/;
        if (!nameRegex.test(info.fullName)) {
            notifyHandler.notify(notifyType.WARNING, 'Họ tên không hợp lệ');
            return;
        }

        const addressRegex = /^[A-Za-z0-9À-ÿ\s,.-]{5,}$/;
        if (!addressRegex.test(info.address)) {
            notifyHandler.notify(notifyType.WARNING, 'Địa chỉ không hợp lệ');
            return;
        }


        api({ sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: { ...authData.user, statusSignUp: 3, fullName: info.fullName, dob: info.dob, address: info.address, gender: info.gender } })
            .then(user => {
                authHandler.setUser(user)
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }
    const handleChangeStepRemove = () => {
        setCurrentStep(prev => prev - 1)
    }
    return (
        <>
            <div className='grid grid-cols-2 gap-[1rem] w-full px-[12rem] mt-[3rem]'>
                <input value={info.fullName} onChange={e => setInfo({ ...info, fullName: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Họ và Tên' />
                <input value={info.dob} onChange={e => setInfo({ ...info, dob: e.target.value })} type='date' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                <select onChange={e => setInfo({ ...info, gender: Boolean(e.target.value) })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]'>
                    <option>Chọn giới tính</option>
                    <option value={true}>Nam</option>
                    <option value={false}>Nữ</option>
                </select>
                <input value={info.address} onChange={e => setInfo({ ...info, address: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Địa Chỉ' />
            </div>
            <div className='flex w-full items-center px-[12rem] mt-[1rem] justify-between'>
                <button onClick={() => handleChangeStepRemove()} className='flex items-center font-bold text-[#999]'><i className='bx bx-chevron-left text-[30px]'></i> Quay Về</button>
                <button onClick={() => handleChangeStep()} className="bg-[#5dade2] hover:scale-[1.06] transition-all text-[white] shadow-xl font-bold text-[15px] w-[20%] py-[8px] rounded-lg">Bước Tiếp Theo</button>
            </div>
        </>
    )
}

export default Step3