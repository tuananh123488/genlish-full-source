'use client'
import { authContext } from '@/context/AuthContext'
import { notifyContext } from '@/context/NotifyContext'
import { practiceContext } from '@/context/PracticeContext'
import { studyContext } from '@/context/StudyContext'
import { api, TypeHTTP } from '@/utils/api'
import { correctResponses, incorrectResponses, removeSpecialChars, shuffleArray } from '@/utils/other'
import { pronounces } from '@/utils/practice'
import React, { useContext, useEffect, useState } from 'react'

const FormResult = ({ setWrong }) => {
    const { practiceData, practiceHandler } = useContext(practiceContext)
    const { notifyHandler } = useContext(notifyContext)
    const { studyData } = useContext(studyContext)
    const { authData, authHandler } = useContext(authContext)
    const [status, setStatus] = useState(0)
    let voices = globalThis.window?.speechSynthesis.getVoices();
    let speakHandler = (voiceName, content) => { };

    useEffect(() => {
        speakHandler = (voiceName, content) => {
            const utterance = new SpeechSynthesisUtterance(content);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;
            voices = globalThis.window?.speechSynthesis.getVoices();
            const selectedVoice = voices.find(voice => voice.name === voiceName);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            globalThis.window?.speechSynthesis.speak(utterance);
        };
    }, [voices]);

    useEffect(() => {
        setStatus(0)
    }, [practiceData.currentQuestion])

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.code === 'Enter') {
                event.preventDefault();
                if (status === 0) {
                    handleCheckAnswer()
                }
            }
            if (event.code === 'AltRight') {
                event.preventDefault();
                if (status !== 0) {
                    handleNext()
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [practiceData.currentQuestion, practiceData.myAnswer, status]);

    const handleCheckAnswer = () => {
        console.log(removeSpecialChars(practiceData.myAnswer.trim().toLowerCase()), removeSpecialChars(practiceData.questions[practiceData.currentQuestion].answer.trim().toLowerCase()))
        if (removeSpecialChars(practiceData.myAnswer.trim().toLowerCase()) === removeSpecialChars(practiceData.questions[practiceData.currentQuestion].answer.trim().toLowerCase())) {
            speakHandler(pronounces[4].voiceName, shuffleArray(correctResponses)[0])
            setStatus(1)
        } else {
            setWrong(prev => prev + 1)
            speakHandler(pronounces[4].voiceName, shuffleArray(incorrectResponses)[0])
            setStatus(-1)
        }
    }

    const handleNext = () => {
        if (practiceData.currentQuestion === practiceData.questions.length - 1) {

        } else {
            practiceHandler.setMyAnswer('')
            practiceHandler.setCurrentQuestion(prev => prev + 1)
        }
    }

    const handleComplete = () => {
        let levelVocabulary = {}
        if (authData.user.study.levelVocabulary.level === studyData.doors.filter(item => item.individual.door === authData.user.study.levelVocabulary.door)[0].individual.numberOfTest) {
            levelVocabulary = {
                ...authData.user.study.levelVocabulary,
                door: authData.user.study.levelVocabulary.door + 1,
                level: 1
            }
        } else {
            levelVocabulary = {
                ...authData.user.study.levelVocabulary,
                level: authData.user.study.levelVocabulary.level + 1
            }
        }
        const body = {
            ...authData.user,
            study: {
                ...authData.user.study,
                levelVocabulary
            }
        }
        api({ type: TypeHTTP.POST, path: '/user/update', body, sendToken: true })
            .then(userUpdated => {
                authHandler.setUser(userUpdated)
                notifyHandler.navigate('/learn')
                setTimeout(() => {
                    practiceHandler.setMyAnswer('')
                    practiceHandler.setCurrentQuestion(0)
                    practiceHandler.setQuestions([])
                }, 200);
            })
    }

    return (
        <section className='h-[20%] px-[25%] border-t-[1px] border-[#e4e4e4] bg-[white] fixed bottom-0 left-0 w-full flex justify-between items-start py-6'>
            <button className="text-center border-[2px] border-[#e0e0e0] transition-all hover:scale-[1.06] text-[#999] font-bold text-[16px] px-10 py-[7px] rounded-lg">Bỏ qua</button>
            {practiceData.myAnswer && (
                <button onClick={() => handleCheckAnswer()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] px-10 py-[7px] rounded-lg">Kiểm tra</button>
            )}
            {status === 1 ? (
                <div style={{ transition: '0.5s', top: status === 1 ? '0' : '100%' }} className='w-full h-full px-[25%] items-center py-6 flex justify-between absolute left-0 bg-[#d7ffb8] z-50'>
                    <div className='flex items-center gap-4'>
                        <img src='/success.png' className=' w-[70px] z-50' />
                        <div className='flex flex-col'>
                            <span className='text-[21px] font-semibold text-[#009c22]'>Đúng rồi !!!</span>
                            {![2].includes(practiceData.questions[practiceData.currentQuestion]?.type) && (
                                <>
                                    <span className='font-semibold text-[#4f4f4f]'>{practiceData.questions[practiceData.currentQuestion]?.display.english} - {practiceData.questions[practiceData.currentQuestion]?.display.vietnamese}</span>
                                </>
                            )}
                        </div>
                    </div>
                    {practiceData.currentQuestion === practiceData.questions.length - 1 ? (
                        <button onClick={() => handleComplete()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] px-10 py-[7px] rounded-lg">Hoàn Thành</button>
                    ) : (
                        <button onClick={() => handleNext()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] px-10 py-[7px] rounded-lg">Tiếp Theo</button>
                    )}
                </div>
            ) : status === -1 && (
                <div style={{ transition: '0.5s', top: status === -1 ? '0' : '100%' }} className='w-full h-full px-[25%] items-center py-6 flex justify-between absolute left-0 bg-[#ffdfe0] z-50'>
                    <div className='flex items-center gap-4'>
                        <img src='/fail.png' className=' w-[60px] z-50' />
                        <div className='flex flex-col'>
                            <span className='text-[20px] font-bold text-[red]'>Sai Rồi !!!</span>
                            {![2].includes(practiceData.questions[practiceData.currentQuestion]?.type) && (
                                <>
                                    <span className='font-semibold text-[#4f4f4f]'>{practiceData.questions[practiceData.currentQuestion]?.display.english} - {practiceData.questions[practiceData.currentQuestion]?.display.vietnamese}</span>
                                </>
                            )}
                        </div>
                    </div>
                    {practiceData.currentQuestion === practiceData.questions.length - 1 ? (
                        <button onClick={() => handleComplete()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] px-10 py-[7px] rounded-lg">Hoàn Thành</button>
                    ) : (
                        <button onClick={() => handleNext()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] px-10 py-[7px] rounded-lg">Tiếp Theo</button>
                    )}
                </div>
            )
            }
        </section >
    )
}

export default FormResult