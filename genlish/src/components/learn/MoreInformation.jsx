import { authContext } from '@/context/AuthContext'
import { studyContext } from '@/context/StudyContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useEffect } from 'react'

const MoreInformation = () => {

    const englishLevels = [
        'Tôi mới học tiếng anh',
        'Tôi mới hiểu sơ qua',
        'Tôi có thể giao tiếp cơ bản',
        'Tôi có thể nói về các chủ đề',
        'Tôi có thể thảo luận được chủ đề'
    ]
    const { studyData } = useContext(studyContext)
    const { authData, authHandler } = useContext(authContext)

    const handleUpdateLevel = (currentEnglishLevel) => {
        api({
            sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: {
                ...authData.user, individual: {
                    ...authData.user.individual,
                    currentEnglishLevel
                }
            }
        })
            .then(user => {
                authHandler.setUser(user)
            })
    }

    const getProcess = (door) => {
        const currentLevel = authData.user?.study?.levelVocabulary
        if (currentLevel?.gate === door.gate.level && currentLevel?.door === door.individual.door) {
            return currentLevel?.level
        }
        if (currentLevel?.gate > door.gate.level || currentLevel?.door > door.individual.door) {
            return door.individual.numberOfTest
        }
        return 0
    }
    useEffect(() => {
        console.log(studyData);

    })
    return (
        <div className='w-[28%] flex flex-col gap-4 h-screen overflow-auto py-[1rem]'>
            <div className='flex text-[#6e6e6e] items-center justify-end gap-4 w-full'>
                <img src='/america.png' className='w-[40px]' />
                <img src={authData.user?.avatar} className='w-[40px] rounded-full' />
            </div>
            {/* <div className='gap-3 mt-2 border-[2px] p-4 border-[#f2f2f2] rounded-xl flex items-center justify-evenly w-full'>
                <img src='/level.png' className='w-[50px]' />
                <div className='flex flex-col gap-1'>
                    <span className='font-bold text-[#5d5d5d] text-[18px]'>Trình độ của tôi</span>
                    <select onChange={e => handleUpdateLevel(e.target.value)} value={authData.user?.individual?.currentEnglishLevel} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[4px] border-[1px] border-[#e1e1e1]'>
                        {englishLevels.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
            </div> */}
            <div className='border-[2px] text-[#5d5d5d] h-[90%] p-4 pb-0 border-[#ededed] rounded-xl w-full'>
                <div className='flex w-full items-center gap-3'>
                    <img src='/ai.png' className='w-[52px]' />
                    <div className='flex flex-col'>
                        <span className='text-[15px]'>Level {studyData.currentGate.level}</span>
                        <span className='font-bold text-[18px]'>{studyData.currentGate.title}</span>
                    </div>
                </div>
                <div className='w-full cursor-pointer mt-3 h-[75%] overflow-auto items-center transition-all flex flex-col gap-2'>
                    {studyData.doors.map((door, index) => (
                        <div key={index} style={{ backgroundColor: door.individual.color }} className={`flex w-[95%] hover:scale-[1.05] transition-all items-center gap-1 text-[white] px-2 py-3 rounded-lg`}>
                            <img className='h-[25px]' style={{ mixBlendMode: 'multiply', filter: ' brightness(0.8) contrast(2)' }} src={door.individual.image} />
                            <span className='font-semibold text-[15px] translate-y-[2px]'>{`Cửa ${door.individual.door}: ${door.individual.title} (${getProcess(door)}/${door.individual.numberOfTest})`}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MoreInformation