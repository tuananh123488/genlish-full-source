import { authContext } from '@/context/AuthContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext } from 'react'

const Step6 = ({ setCurrentStep, currentStep }) => {
    const { authHandler, authData } = useContext(authContext)
    const handleChangeStep = () => {
        api({ sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: { ...authData.user, statusSignUp: 6 } })
            .then(user => {
                authHandler.setUser(user)
            })
    }
    const handleChangeStepRemove = () => {
        setCurrentStep(prev => prev - 1)
    }
    return (
        <>
            <div className='grid gap-[1rem] w-full px-[12rem] mt-[3rem]'>

                <div className='rounded-lg text-[16px] focus:outline-0 shadow-sm h-[65px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 flex justify-start items-center'>
                    <img src="https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/958e9a5aac8a0aeb099e08c28e327de7.svg" alt="" />
                    <div className='text-[16px] font-semibold'>Tự tin giao tiếp
                        <div className='text-[14px] font-normal'>32.700+ bài học đa tương tác và không hề áp lực</div>
                    </div>
                </div>
                <div className='rounded-lg text-[16px] focus:outline-0 shadow-sm h-[65px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 flex justify-start items-center'>
                    <img src="https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/bc1008ae41c90c9b1a6f63bb9e142f7f.svg" alt="" />
                    <div className='text-[16px] font-semibold'>Kho từ vựng đa dạng
                        <div className='text-[14px] font-normal'>1.900+ từ và cụm từ thiết thực</div>
                    </div>
                </div>
                <div className='rounded-lg text-[16px] focus:outline-0 shadow-sm h-[65px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 flex justify-start items-center'>
                    <img src="https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/3757137c3beb1fbf0bfe21fdf9254023.svg" alt="" />
                    <div className='text-[16px] font-semibold'>Tạo thói quen học tập
                        <div className='text-[14px] font-normal'>Nhắc nhở thông minh, thử thách vui nhộn và còn nhiều tính năng thú vị khác</div>
                    </div>
                </div>
            </div>
            <div className='flex w-full items-center px-[12rem] mt-[1rem] justify-between'>
                <button onClick={() => handleChangeStepRemove()} className='flex items-center font-bold text-[#999]'><i className='bx bx-chevron-left text-[30px]'></i> Quay Về</button>
                <button onClick={() => handleChangeStep()} className="bg-[#5dade2] hover:scale-[1.06] transition-all text-[white] shadow-xl font-bold text-[15px] w-[20%] py-[8px] rounded-lg">Bước Tiếp Theo</button>
            </div>
        </>
    )
}

export default Step6