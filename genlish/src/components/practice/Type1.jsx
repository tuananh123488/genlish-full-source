import React, { useContext, useEffect, useState } from 'react'
import FormResult from './FormResult'
import { practiceContext } from '@/context/PracticeContext'
import { pronounces } from '@/utils/practice'

const Type1 = ({ question, index }) => {

    const { practiceData, practiceHandler } = useContext(practiceContext)
    const [isClicked, setIsClicked] = useState(false);
    let voices = globalThis.window?.speechSynthesis.getVoices();
    let speakHandler = (voiceName, content) => { };
    const [ready, setReady] = useState(false)
    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300); // Xóa shadow sau 300ms
    };

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

    useEffect(() => {
        if (ready && practiceData.currentQuestion === index) {
            speakHandler(pronounces[4].voiceName, question.question.english)
        }
    }, [ready, practiceData.currentQuestion])


    return (
        <div className='w-[50%] flex flex-col gap-4'>
            <span className='text-[23px] font-semibold'>Bạn nghe được gì?</span>
            <div className='flex items-center gap-4 justify-center'>
                <div className="flex items-start transition-all">
                    <button
                        className={`bg-[#1cb0f6] p-[1.5rem] rounded-xl transition-all text-[white] ${isClicked ? 'shadow-2xl shake' : 'shadow-lg'
                            }`}
                        onClick={() => {
                            speakHandler(pronounces[4].voiceName, question.question.english)
                        }}
                    >
                        <i className="fa-solid fa-volume-high text-[60px]"></i>
                    </button>
                </div>
            </div>
            <div className='flex flex-col gap-2 w-full items-center py-2'>
                {question.options.map((option, index) => (
                    <button onClick={() => practiceHandler.setMyAnswer(option)} style={{ fontWeight: practiceData.myAnswer === option ? 'bold' : '400' }} key={index} className='w-[100%] bg-[white] border-[1px] border-[#dfdfdf] shadow-md py-3 rounded-md hover:scale-[1.05] transition-all'>{option}</button>
                ))}
            </div>
        </div>
    )
}

export default Type1