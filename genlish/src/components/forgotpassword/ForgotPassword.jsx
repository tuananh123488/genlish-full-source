import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { auth } from '../firebase/firebase'
import { formatPhoneByFireBase } from '@/utils/phone'
import PageOtp from './PageOtp'
import { api, TypeHTTP } from '@/utils/api'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import Logo from '../Logo'

const ForgotPassword = ({ change, setChange }) => {
    const [phone, setPhone] = useState()
    const [changNextPage, setChangNextPage] = useState(true)
    const { notifyHandler } = useContext(notifyContext)
    const validPhone = () => {

        api({ path: `/user/getByPhone/${phone}`, type: TypeHTTP.GET, sendToken: false }).then(res => {
            notifyHandler.notify(notifyType.SUCCESS, `Đã gửi mã xác nhận tới số ${phone}`)
            setChangNextPage(false)

        }).catch(e => {

            notifyHandler.notify(notifyType.FAIL, e.message.data)


        })
    }
    return (

        <>
            {changNextPage ? (

                <section section style={{ top: change ? '0' : '100%', transition: '0.4s' }} className='z-[45] flex items-center gap-5 justify-center fixed left-0 w-screen h-screen flex-col bg-gradient-to-r from-purple-300 to-pink-300'>

                    <div className='p-[30px] w-[500px] rounded-lg bg-white flex flex-col space-y-3 h-[400px] shadow-sm'>
                        <Logo />
                        <div className='text-center'>
                            <span className='block font-bold text-[25px]'>Quên mật khẩu?</span>
                            <span className='text-[17px] text-gray-500'>
                                Điền số điện thoại của bạn để nhận được mã OTP thay đổi mật khẩu
                            </span>
                        </div>
                        <input
                            type='text'
                            value={phone} // Liên kết giá trị input với state phone
                            onChange={(e) => setPhone(e.target.value)}
                            className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[40px] w-full px-4 border'
                            placeholder='Nhập số điện thoại'
                        />
                        <button onClick={() => validPhone()} className='rounded-lg text-[15px] h-[45px] focus:outline-0 hover:scale-[1.05] w-full transition-all bg-purple-600 text-white'>
                            Xác thực
                        </button>
                        <button onClick={() => { setChange(!change); setPhone("") }} className=' text-[15px] h-[45px]  hover:scale-[1.05] w-full transition-all text-purple-600' >
                            Quay lại trang đăng nhập
                        </button>
                    </div>
                </section >
            ) : (
                <PageOtp phone={phone} change={change} setChange={setChange} changNextPage={changNextPage} setChangNextPage={setChangNextPage} />
            )}
        </>

    )
}

export default ForgotPassword