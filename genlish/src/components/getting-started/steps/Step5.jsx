import { authContext } from '@/context/AuthContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useState } from 'react'

const Step5 = ({ setCurrentStep, currentStep }) => {
    const { authData, authHandler } = useContext(authContext)

    const handleChangeStep = (currentEnglishLevel) => {
        api({
            sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: {
                ...authData.user, individual: {
                    ...authData.user.individual,
                    currentEnglishLevel
                },
                statusSignUp: 5
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
            <div className='flex flex-col items-center gap-[1rem] w-full px-[12rem] mt-[3rem]'>
                <button style={{ transition: '0.5s' }} className='rounded-lg text-[16px] w-[400px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center' value={'Tôi mới học tiếng anh'} onClick={() => { handleChangeStep('Tôi mới học tiếng anh') }}><i className='bx bx-signal-1' ></i>Tôi mới học tiếng anh</button>
                <button style={{ transition: '0.5s' }} className='rounded-lg text-[16px] w-[400px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center' value={'Tôi mới hiểu sơ qua'} onClick={() => { handleChangeStep('Tôi mới hiểu sơ qua') }}><i className='bx bx-signal-3' ></i>Tôi mới hiểu sơ qua</button>
                <button style={{ transition: '0.5s' }} className='rounded-lg text-[16px] w-[400px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center' value={'Tôi có thể giao tiếp cơ bản'} onClick={() => { handleChangeStep('Tôi có thể giao tiếp cơ bản') }}><i className='bx bx-signal-3' ></i>Tôi có thể giao tiếp cơ bản</button>
                <button style={{ transition: '0.5s' }} className='rounded-lg text-[16px] w-[400px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center' value={'Tôi có thể nói về các chủ đề'} onClick={() => { handleChangeStep('Tôi có thể nói về các chủ đề') }}><i className='bx bx-signal-4' ></i>Tôi có thể nói về các chủ đề</button>
                <button style={{ transition: '0.5s' }} className='rounded-lg text-[16px] w-[400px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1] gap-4 hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center' value={'Tôi có thể thể thảo luận được chủ đề'} onClick={() => { handleChangeStep('Tôi có thể thảo luận được chủ đề') }}><i className='bx bx-signal-5' ></i>Tôi có thể thảo luận được chủ đề</button>
            </div>
            <div className='flex w-full items-center px-[12rem] mt-[1rem] justify-between'>
                <button onClick={() => handleChangeStepRemove()} className='flex items-center font-bold text-[#999]'><i className='bx bx-chevron-left text-[30px]'></i> Quay Về</button>
                {/* <button onClick={() => handleChangeStep()} className="bg-[#5dade2] hover:scale-[1.06] transition-all text-[white] shadow-xl font-bold text-[15px] w-[20%] py-[8px] rounded-lg">Bước Tiếp Theo</button> */}
            </div>
        </>
    )
}

export default Step5