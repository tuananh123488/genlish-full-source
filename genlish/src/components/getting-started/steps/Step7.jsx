import { authContext } from '@/context/AuthContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext } from 'react'

const Step7 = ({ setCurrentStep, currentStep }) => {
    const { authData, authHandler } = useContext(authContext)
    const handleChangeStep = (englishLearningTimeInOneDay) => {
        api({
            sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: {
                ...authData.user, individual: {
                    ...authData.user.individual,
                    englishLearningTimeInOneDay
                },
                statusSignUp: 7
            }
        })
            .then(user => {
                authHandler.setUser(user)
            })
    }
    const handleChangeStepRemove = () => {
        setCurrentStep(prev => prev - 1)
    }
    return (
        <>
            <div className='grid gap-[0.5rem] w-full px-[20rem] mt-[3rem]'>
                <button style={{ transition: '0.5s' }} className='rounded-lg text-[16px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center' value={'5 phút /1 ngày'} onClick={() => handleChangeStep('5 phút /1 ngày')}>5 phút /1 ngày</button>
                <button style={{ transition: '0.5s' }} className='rounded-lg text-[16px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center' value={'10 phút /1 ngày'} onClick={() => handleChangeStep('10 phút /1 ngày')}>10 phút /1 ngày</button>
                <button style={{ transition: '0.5s' }} className='rounded-lg text-[16px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center' value={'15 phút /1 ngày'} onClick={() => handleChangeStep('15 phút /1 ngày')}>15 phút /1 ngày</button>
                <button style={{ transition: '0.5s' }} className='rounded-lg text-[16px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center' value={'20 phút /1 ngày'} onClick={() => handleChangeStep('20 phút /1 ngày')}>20 phút /1 ngày</button>

            </div>
            <div className='flex w-full items-center px-[12rem] mt-[1rem] justify-between'>
                <button onClick={() => handleChangeStepRemove()} className='flex items-center font-bold text-[#999]'><i className='bx bx-chevron-left text-[30px]'></i> Quay Về</button>
                {/* <button onClick={() => handleChangeStep()} className="bg-[#5dade2] hover:scale-[1.06] transition-all text-[white] shadow-xl font-bold text-[15px] w-[20%] py-[8px] rounded-lg">Bước Tiếp Theo</button> */}
            </div>
        </>
    )
}

export default Step7