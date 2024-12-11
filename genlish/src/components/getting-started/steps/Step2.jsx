import { auth } from '@/components/firebase/firebase'
import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { formatPhoneByFireBase } from '@/utils/phone'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import React, { useContext, useEffect, useRef, useState } from 'react'

const Step2 = ({ setCurrentStep, currentStep }) => {

    const { authHandler, authData } = useContext(authContext)
    const { notifyHandler } = useContext(notifyContext)
    const [verification, setVerification] = useState()
    const [otp, setOtp] = useState('')
    const recaptchaRef = useRef(null);

    useEffect(() => {
        if (authData.user?.phone && currentStep === 1) {
            setTimeout(() => {
                const recaptchaContainer = recaptchaRef.current;
                if (recaptchaContainer) {
                    const recaptcha = new RecaptchaVerifier(auth, recaptchaContainer, {
                        'size': 'invisible',
                        'callback': (response) => {
                            console.log(response)
                            console.log('reCAPTCHA solved');
                        },
                        'expired-callback': () => {
                            console.log('reCAPTCHA expired');
                        }
                    });
                    signInWithPhoneNumber(auth, formatPhoneByFireBase(authData.user?.phone), recaptcha)
                        .then(confirmation => {
                            setVerification(confirmation);
                        })
                        .catch(error => {
                            console.error('Error during phone number sign-in:', error);
                        });
                }
            }, 100); // delay 100ms
        }
    }, [authData.user, currentStep]);

    const handleChangeStep = () => {
        notifyHandler.notify(notifyType.LOADING, 'Đang xác thực')
        verification.confirm(otp)
            .then(data => {
                api({ sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: { ...authData.user, statusSignUp: 2 } })
                    .then(user => {
                        notifyHandler.notify(notifyType.SUCCESS, 'Xác thực thành công')
                        authHandler.setUser(user)
                    })
                    .catch(error => {
                        notifyHandler.notify(notifyType.FAIL, error.message)
                    })
            })
            .catch((error) => {
                notifyHandler.notify(notifyType.FAIL, 'Mã xác minh không đúng')
            })
    }
    const handleChangeStepRemove = () => {
        setCurrentStep(prev => prev - 1)
    }
    return (
        <>
            <div className='grid grid-cols-1 gap-[1rem] w-full px-[12rem] mt-[3rem]'>
                <div id='recaptcha' ref={recaptchaRef}></div>
                <input value={otp} onChange={e => setOtp(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Mã Xác Thực' />
            </div>
            <div className='flex w-full items-center px-[12rem] mt-[1rem] justify-between'>
                <button onClick={() => handleChangeStepRemove()} className='flex items-center font-bold text-[#999]'><i className='bx bx-chevron-left text-[30px]'></i> Quay Về</button>
                <button onClick={() => handleChangeStep()} className="bg-[#5dade2] hover:scale-[1.06] transition-all text-[white] shadow-xl font-bold text-[15px] w-[20%] py-[8px] rounded-lg">Bước Tiếp Theo</button>
            </div>
        </>
    )
}

export default Step2