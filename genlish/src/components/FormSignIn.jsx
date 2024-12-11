'use client'
import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import ForgotPassword from './forgotpassword/ForgotPassword'
import { payloadContext } from '@/context/PayloadContext'

const FormSignIn = ({ visible, hidden }) => {
    const router = useRouter()
    const { authHandler } = useContext(authContext)
    const { notifyHandler } = useContext(notifyContext)
    const { payloadData, payloadHandler } = useContext(payloadContext)

    const [info, setInfo] = useState({
        phone: '',
        password: ''
    })

    const handleSignIn = () => {
        if (info.phone === '' || info.password === '') {
            notifyHandler.notify(notifyType.FAIL, 'Vui lòng không  để trống')
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
        api({ type: TypeHTTP.POST, body: { phone: info.phone, password: info.password }, sendToken: false, path: '/auth/sign-in' })
            .then(res => {
                globalThis.localStorage.setItem('accessToken', res.tokens.accessToken)
                globalThis.localStorage.setItem('refreshToken', res.tokens.refreshToken)
                authHandler.setUser(res.user)
                if (res.user.statusSignUp === 7) {
                    if (payloadData.target === '') {
                        router.push('/course')
                    } else {
                        router.push(payloadData.target)
                        payloadHandler.setTarget('')
                    }
                } else {
                    router.push('/getting-started')
                }
                setTimeout(() => {
                    if (res.user.statusSignUp === 7) {
                        notifyHandler.notify(notifyType.SUCCESS, 'Đăng nhập thành công')
                        setInfo(prevState => ({
                            ...prevState,
                            phone: ""
                        }));
                        setInfo(prevState => ({
                            ...prevState,
                            password: ""
                        }));

                    } else {
                        notifyHandler.notify(notifyType.WARNING, 'Hãy hoàn thành thông tin của bạn')
                    }
                    hidden()
                }, (1000));
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }
    const [change, setChange] = useState()
    return (
        <section style={{ top: visible ? '0' : '100%', transition: '0.4s' }} className='z-[45] flex items-center justify-center fixed left-0 w-screen h-screen transition-all bg-gradient-to-r from-purple-300 to-pink-300' >
            <div className='shadow-2xl flex flex-col p-[2rem] from-[#ffffffac] to-[#ffffff45] bg-gradient-to-br rounded-[1rem] '>
                <button onClick={() => hidden()} className='text-[35px] absolute top-3 left-4 text-[#999]'><i className='bx bx-x' ></i></button>


                <h1 className=' my-[0.5rem] mb-[1rem] font-bold text-[28px] font-poppins' >Sign In</h1>
                <input value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} className='w-[18rem] sm:w-[25rem] focus:scale-[1.03] transition pt-1 text-[15px] focus:outline-0 rounded-[0.5rem] px-[1rem] text-black my-[5px] h-[50px] from-[#ffffffac] to-[#ffffff45] bg-gradient-to-br bg-transparent' placeholder='Số Điện Thoại' />
                <input value={info.password} onChange={e => setInfo({ ...info, password: e.target.value })} type='password' className='w-[18rem] sm:w-[25rem] focus:scale-[1.03] transition pt-1 text-[15px] focus:outline-0 rounded-[0.5rem] px-[1rem] text-black my-[5px] h-[50px] from-[#ffffffac] to-[#ffffff45] bg-gradient-to-br bg-transparent' placeholder='Mật Khẩu' />
                <button onClick={() => handleSignIn()} className='hover:scale-[1.02] transition my-[0.5rem] font-semibold rounded-[10px] py-[12px] text-[white] bg-[#241d49]'>Đăng Nhập</button>
                <div onClick={() => setChange('d')} className='py-1 cursor-pointer w-full text-center text-[16px]'>Quên mật khẩu?</div>
                <p className='w-full text-center mt-[2.0rem]'> Don&#39;t have an account?<span onClick={() => {
                    hidden()
                    notifyHandler.navigate('/getting-started')
                }} className='font-bold underline cursor-pointer'>Sign Up</span></p>
            </div>

            <ForgotPassword setChange={setChange} change={change} />
        </section>
    )
}

export default FormSignIn