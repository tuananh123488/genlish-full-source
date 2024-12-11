'use client'
import Processing from '@/components/getting-started/Processing'
import Step1 from '@/components/getting-started/steps/Step1'
import Step2 from '@/components/getting-started/steps/Step2'
import Step3 from '@/components/getting-started/steps/Step3'
import Step4 from '@/components/getting-started/steps/Step4'
import Step5 from '@/components/getting-started/steps/Step5'
import Step6 from '@/components/getting-started/steps/Step6'
import Step7 from '@/components/getting-started/steps/Step7'
import { authContext } from '@/context/AuthContext'
import { notifyContext } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
const GettingStarted = () => {
    const router = useRouter()
    const { authData } = useContext(authContext)
    const [currentStep, setCurrentStep] = useState(0)
    const { notifyHandler } = useContext(notifyContext)
    const stepRef = useRef()
    const talksByStep = {
        '0': 'Bạn hãy cung cấp thông tin đăng nhập',
        '1': 'Hãy xác thực số điện thoại của bạn',
        '2': 'Hãy bổ sung thông tin cá nhân của bạn nhé',
        '3': 'Tại sao bạn lại học tiếng anh?',
        '4': 'Trình độ tiếng anh của bạn ở mức nào?',
        '5': 'Thành quả sau khi học tiếng anh của GenLish',
        '6': 'Thời gian học một ngày',
    }

    useEffect(() => {
        if (authData.user) {
            if (authData.user.statusSignUp === 7) {
                api({ type: TypeHTTP.POST, path: '/auth/generate-token', sendToken: false, body: { id: authData.user?._id } })
                    .then(tokens => {
                        globalThis.localStorage.setItem('accessToken', tokens.accessToken)
                        globalThis.localStorage.setItem('refreshToken', tokens.refreshToken)
                        // notifyHandler.navigate('/learn')
                        if (authData.user.role === "TEACHER") {
                            notifyHandler.navigate('/teacher')
                        }
                        else {
                            notifyHandler.navigate('/course')
                        }

                    })
            } else {
                setCurrentStep(authData.user.statusSignUp)
            }
        }
    }, [authData.user])

    return (
        <section className='py-[1.5rem] px-[3rem] flex flex-col items-center'>
            <div className='flex w-full items-center justify-center gap-3'>
                <Link href={'/'}><i className='bx bx-left-arrow-alt text-[35px] text-[#929292]'></i></Link>
                <Processing width={'80%'} height={'10px'} process={currentStep} total={7} />
            </div>
            <div className='flex items-end gap-3 w-full px-[5rem] mt-3'>
                <img src='/logo.png' width={'60px'} className='animate-slight-move' />
                <div className='py-2 px-5 bg-[white] transition-all shadow-md rounded-lg ' >
                    {talksByStep[currentStep + '']}
                </div>
            </div>
            <div className='w-full overflow-hidden'>
                <div style={{ marginLeft: stepRef.current ? stepRef.current.offsetWidth * currentStep * -1 + 'px' : 0, transition: '0.5s' }} className='w-full flex'>
                    <div ref={stepRef} className='min-w-full flex flex-col items-center'>
                        <Step1 setCurrentStep={setCurrentStep} currentStep={currentStep} />
                    </div>
                    <div className='min-w-full flex flex-col items-center'>
                        <Step2 setCurrentStep={setCurrentStep} currentStep={currentStep} />
                    </div>
                    <div className='min-w-full flex flex-col items-center'>
                        <Step3 setCurrentStep={setCurrentStep} currentStep={currentStep} />
                    </div>
                    <div className='min-w-full flex flex-col items-center'>
                        <Step4 setCurrentStep={setCurrentStep} currentStep={currentStep} />
                    </div>
                    <div className='min-w-full flex flex-col items-center'>
                        <Step5 setCurrentStep={setCurrentStep} currentStep={currentStep} />
                    </div>
                    <div className='min-w-full flex flex-col items-center'>
                        <Step6 setCurrentStep={setCurrentStep} currentStep={currentStep} />
                    </div>
                    <div className='min-w-full flex flex-col items-center'>
                        <Step7 setCurrentStep={setCurrentStep} currentStep={currentStep} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GettingStarted

// 1 . dang ky nhap sdt, mk
// 2/ xac minh sdt
// 3/ Nhap thong tin chi tiet
// 4/ tai sao hoc tieng anh
// 5/ Trinh do tieng anh cua ban o muc nao
// 6/ Thanh qua dat duoc
// 7/ Hoc bao nhieu phut 1 ngay
// 8/ Thong bao thanh cong