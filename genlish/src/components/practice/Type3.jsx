import React, { useContext, useEffect, useState } from 'react'
import FormResult from './FormResult'
import { practiceContext } from '@/context/PracticeContext'
import { pronounces } from '@/utils/practice'

const Type3 = ({ question, index }) => {

    const { practiceData, practiceHandler } = useContext(practiceContext)
    let voices = globalThis.window?.speechSynthesis.getVoices();
    let speakHandler = (voiceName, content) => { };
    const [ready, setReady] = useState(false)
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
            setReady(true)
        };
    }, [voices]);
    const handleSubmitAnswer = (option) => {
        practiceHandler.setMyAnswer(option)
        speakHandler(pronounces[4].voiceName, option)
    }

    return (
        <div className='w-[50%] flex flex-col gap-2 mt-4'>
            <span className='text-[23px] font-semibold'>Hoàn Thành Câu</span>
            <div className='flex items-center gap-4'>
                <img src='/logo.png' className='w-[100px] animate-slight-move' />
                <div className="flex items-start transition-all">
                    <div className="relative max-w-xs px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg">
                        <span className="block">{question.question}</span>
                        <span className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-blue-500"></span>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2 w-full items-center py-2'>
                {question.options.map((option, index) => (
                    <button onClick={() => handleSubmitAnswer(option)} style={{ fontWeight: practiceData.myAnswer === option ? 'bold' : '400' }} key={index} className='w-[100%] bg-[white] border-[1px] border-[#dfdfdf] shadow-md py-3 rounded-md hover:scale-[1.05] transition-all'>{option}</button>
                ))}
            </div>
        </div>
    )
}

export default Type3