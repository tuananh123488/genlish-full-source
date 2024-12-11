import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useState } from 'react'

const Step1 = ({ setCurrentStep, currentStep }) => {

    const { notifyHandler } = useContext(notifyContext)
    const { authHandler } = useContext(authContext)

    const [info, setInfo] = useState({
        phone: '',
        password: '',
        confirmPassword: ''

    })

    const handleChangeStep = () => {
        if (info.phone === '' || info.password === '' || info.confirmPassword === '') {
            notifyHandler.notify(notifyType.WARNING, 'Không được để trống')
            return
        }
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

        if (!phoneRegex.test(info.phone)) {
            notifyHandler.notify(notifyType.WARNING, 'Số điện thoại không hợp lệ');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(info.password)) {
            notifyHandler.notify(notifyType.WARNING, 'Mật khẩu không hợp lệ. Mật khẩu ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số');
            return;
        }
        if (info.confirmPassword !== info.password) {
            notifyHandler.notify(notifyType.WARNING, 'Mật khẩu và mật khẩu xác nhận không khớp');
            return
        }
        api({ sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-1', body: { phone: info.phone, password: info.password } })
            .then(user => {
                authHandler.setUser(user)
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }


    return (
        <>
            <div className='grid grid-cols-2 gap-[1rem] w-full px-[12rem] mt-[3rem]'>
                <input value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Số điện thoại +84' />
                <input value={info.password} onChange={e => setInfo({ ...info, password: e.target.value })} type='password' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Mật khẩu' />
                <div></div>
                <input value={info.confirmPassword} onChange={e => setInfo({ ...info, confirmPassword: e.target.value })} type='password' className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Xác nhận mật khẩu' />
            </div>

            <div className='flex justify-end w-full px-[12rem] mt-[1rem]'>
                <button onClick={() => handleChangeStep()} className="bg-[#5dade2] hover:scale-[1.06] transition-all text-[white] shadow-xl font-bold text-[15px] w-[20%] py-[8px] rounded-lg">Bước Tiếp Theo</button>
            </div>
        </>
    )
}

export default Step1