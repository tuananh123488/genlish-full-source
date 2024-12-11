import { authContext } from '@/context/AuthContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useState } from 'react'

const Step4 = ({ setCurrentStep, currentStep }) => {
    const [list, setList] = useState([])
    const { authData, authHandler } = useContext(authContext)
    const whys = [
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/ab81d610a8a79f174a4db0a6085e7e2c.svg",
            title: 'Giải trí'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/484f1c9610935dd40094a9f7cf06e009.svg",
            title: 'Kết nối tới mọi người'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/61a06f02b3b988d1c388d484bc0e52e6.svg",
            title: 'Phát triển sự nghiệp'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/d7315c6c7bbeba67df5ebda771d33da1.svg",
            title: 'Hỗ trợ việc học'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/5bbfb55fd21e21012a228bcef29bb557.svg",
            title: 'Hỗ trợ đi du lịch'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/0e2332e8d4074ed5db4ca9152ffd0d25.svg",
            title: 'Khác'
        }]

    const handleChangeStep = () => {
        if (list.length === 0) {
            return
        }
        api({
            sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: {
                ...authData.user, individual: {
                    reasonToLearnEnglish: list.map(item => whys[item].title)
                },
                statusSignUp: 4
            }
        })
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
                {whys.map((why, index) => (
                    <button onClick={() => list.includes(index) ? setList(prev => prev.filter(item => item !== index)) : setList(prev => [...prev, index])} key={index} style={{ transition: '0.5s' }} className='rounded-lg text-[16px] focus:outline-0 shadow-sm h-[60px] px-[1rem] border-[1px] border-[#e1e1e1] hover:scale-105 hover:opacity-80 hover:bg-[#f0f0f0] flex justify-start items-center gap-[1rem]' value={'Giải trí'} ><img src={why.image} alt="" /><span style={{ transition: '0.5s', fontWeight: list.includes(index) ? 'bold' : '400' }}>{why.title}</span></button>
                ))}
            </div>
            <div className='flex w-full items-center px-[12rem] mt-[1rem] justify-between'>
                <button onClick={() => handleChangeStepRemove()} className='flex items-center font-bold text-[#999]'><i className='bx bx-chevron-left text-[30px]'></i> Quay Về</button>
                <button onClick={() => handleChangeStep()} className="bg-[#5dade2] hover:scale-[1.06] transition-all text-[white] shadow-xl font-bold text-[15px] w-[20%] py-[8px] rounded-lg">Bước Tiếp Theo</button>
            </div>
        </>
    )
}

export default Step4