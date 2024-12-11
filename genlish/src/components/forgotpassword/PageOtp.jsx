import { formatPhoneByFireBase } from '@/utils/phone';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { auth } from '../firebase/firebase';
import { notifyContext, notifyType } from '@/context/NotifyContext';
import { api, TypeHTTP } from '@/utils/api';
import { authContext } from '@/context/AuthContext';
import Logo from '../Logo';

const PageOtp = ({ phone, change, setChange, changNextPage, setChangNextPage }) => {
    const [otp, setOtp] = useState('')
    const [verification, setVerification] = useState()
    const recaptchaRef = useRef(null);
    const { notifyHandler } = useContext(notifyContext)
    const { authHandler } = useContext(authContext)
    useEffect(() => {
        console.log(phone);

    })

    const handleSendOtp = () => {
        // // Xóa phần tử chứa reCAPTCHA cũ
        // const recaptchaContainer = recaptchaRef.current;
        // recaptchaContainer.innerHTML = '';


        // setTimeout(() => {
        //     if (recaptchaContainer) {
        //         // Tạo một phần tử chứa reCAPTCHA mới
        //         const recaptcha = new RecaptchaVerifier(recaptchaContainer, {
        //             'size': 'invisible',
        //             'callback': (response) => {
        //                 console.log('reCAPTCHA đã được giải quyết:', response);
        //             },
        //             'expired-callback': () => {
        //                 console.log('reCAPTCHA đã hết hạn');
        //             }
        //         }, auth);

        //         signInWithPhoneNumber(auth, formatPhoneByFireBase(phone), recaptcha)
        //             .then(confirmation => {
        //                 setVerification(confirmation);
        //             })
        //             .catch(error => {
        //                 console.error('Lỗi trong quá trình gửi mã OTP:', error);
        //             });
        //     }
        // }, 100);
    }

    useEffect(() => {

        setTimeout(() => {
            const recaptchaContainer = recaptchaRef.current;

            if (recaptchaContainer) {
                const recaptcha = new RecaptchaVerifier(auth, recaptchaContainer, {
                    'size': 'invisible',
                    'callback': (response) => {
                        console.log('reCAPTCHA đã được giải quyết:', response);
                    },
                    'expired-callback': () => {
                        console.log('reCAPTCHA đã hết hạn');
                    }
                });

                signInWithPhoneNumber(auth, formatPhoneByFireBase(phone), recaptcha)
                    .then(confirmation => {
                        setVerification(confirmation);
                    })
                    .catch(error => {
                        console.error('Lỗi trong quá trình xác thực số điện thoại:', error);

                    });
            }
        }, 100); // trì hoãn 100ms
    }, [phone]);
    const handleOtp = () => {
        notifyHandler.notify(notifyType.LOADING, 'Đang xác thực')
        verification.confirm(otp)
            .then(data => {
                notifyHandler.notify(notifyType.SUCCESS, 'Mã xác minh đúng')
                setNewPage(false)
            })
            .catch((error) => {
                notifyHandler.notify(notifyType.FAIL, 'Mã xác minh không đúng')
            })
        setTimeout(() => {
            setNewPage(false)
            notifyHandler.notify(notifyType.SUCCESS, 'Xác minh thành công')
        }, 2000);
    }
    const [newPage, setNewPage] = useState(true)
    const [newPassword, setNewPassword] = useState()
    const [reNewPassword, setReNewPassword] = useState()
    const handleChange = () => {

        if (newPassword === '' || reNewPassword === '') {
            notifyHandler.notify(notifyType.FAIL, 'Vui lòng không  để trống')
            return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            notifyHandler.notify(notifyType.WARNING, 'Mật khẩu không hợp lệ. Mật khẩu ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số');
            return;
        }
        if (newPassword !== reNewPassword) {
            notifyHandler.notify(notifyType.WARNING, 'Mật khẩu mới phải trùng với mật khẩu xác nhận')
            return
        }
        api({ path: '/user/changeNewPassword', body: { phone: phone, newPassword: newPassword, reNewPassword: reNewPassword }, sendToken: false, type: TypeHTTP.POST }).then(res => {
            notifyHandler.notify(notifyType.SUCCESS, 'Đổi mật khẩu thành công')
            setChange(!change)
            setNewPage(true)
            setChangNextPage(true)
        }).catch(e => {
            notifyHandler.notify(notifyType.FAIL, e.message.data)
        })

    }
    return (
        <>
            {newPage ?
                (

                    <section style={{ top: change ? '0' : '100%', transition: '0.4s' }} className='z-[45] flex items-center gap-5 justify-center fixed left-0 w-screen h-screen flex-col bg-gradient-to-r from-purple-300 to-pink-300'>
                        <button onClick={() => setChangNextPage(true)} className='text-[35px] absolute top-3 right-4 text-[#999]'><i className='bx bx-x' ></i></button>
                        <div className='p-[30px] w-[450px] rounded-lg bg-white flex flex-col space-y-3'>
                            <Logo />

                            <div className='text-center block font-bold text-[25px]'>Quên mật khẩu?</div>
                            <div id='recaptcha' ref={recaptchaRef}></div>
                            <div className='text-center text-gray-500'>Mã được gửi tới {phone}</div>
                            <input value={otp} onChange={e => setOtp(e.target.value)} className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[40px] w-full px-4 border' placeholder='Mã Xác Thực' />

                            <button onClick={() => handleOtp()} className='rounded-lg text-[15px] h-[45px] focus:outline-0 hover:scale-[1.05] w-full transition-all bg-purple-600 text-white'>Xác thực</button>
                            <div className='flex justify-between'>
                                <div onClick={() => setChangNextPage(true)} className=' text-[15px] h-[45px] focus:outline-0 hover:scale-[1.05] w-50% transition-all text-purple-600'>Quay lại</div>

                            </div>

                        </div>
                    </section >
                ) :
                (

                    <section style={{ top: change ? '0' : '100%', transition: '0.4s' }} className='z-[45] flex items-center gap-5 justify-center fixed left-0 w-screen h-screen flex-col bg-gradient-to-r from-purple-300 to-pink-300'>

                        <div className='p-[30px] w-[450px] rounded-lg bg-white flex flex-col space-y-3'>
                            <Logo />
                            <div className='text-center'>
                                <span className='block font-bold text-[25px]'>Thay đổi mật khẩu</span>
                                <span className='text-[14px] text-gray-500'>
                                    Điền mật khẩu mới và nhập lại mật khẩu để hoàn thành
                                </span>
                            </div>
                            <input type='password' onChange={e => setNewPassword(e.target.value)} className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[40px] w-full px-4 border' placeholder='Nhập mật khẩu' />
                            <input type='password' onChange={e => setReNewPassword(e.target.value)} className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[40px] w-full px-4 border' placeholder='Nhập lại mật khẩu' />
                            <button onClick={() => handleChange()} className='rounded-lg text-[15px] h-[45px] focus:outline-0 hover:scale-[1.05] w-full transition-all bg-purple-600 text-white' >Đổi mật khẩu</button>
                            <button onClick={() => setNewPage(true)} className='rounded-lg text-[15px] h-[45px] focus:outline-0 hover:scale-[1.05] w-full transition-all text-purple-600' >Quay lại</button>
                        </div>

                    </section>
                )}

        </>


    )
}

export default PageOtp