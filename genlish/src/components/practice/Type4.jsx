import React, { useContext, useEffect, useState } from 'react'
import FormResult from './FormResult'
import { practiceContext } from '@/context/PracticeContext'
import { pronounces } from '@/utils/practice'

const Type4 = ({ question, index }) => {

    const { practiceData, practiceHandler } = useContext(practiceContext)
    let voices = globalThis.window?.speechSynthesis.getVoices();
    let speakHandler = (voiceName, content) => { };
    const [ready, setReady] = useState(false)
    const [myList, setMyList] = useState([])
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
            speakHandler(pronounces[4].voiceName, question.question)
        }
    }, [ready, practiceData.currentQuestion])

    useEffect(() => {
        practiceHandler.setMyAnswer(myList.join(' '))
    }, [myList])

    return (
        <div className='w-[50%] flex flex-col gap-2 mt-4'>
            <span className='text-[23px] font-semibold'>Sắp xếp bằng Tiếng Việt</span>
            <div className='flex items-center gap-4'>
                <img src='/logo.png' className='w-[100px] animate-slight-move' />
                <div className="flex items-start transition-all">
                    <div className="relative max-w-xs px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg">
                        <span className="block">{question.question}</span>
                        <span className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-blue-500"></span>
                    </div>
                </div>
            </div>
            <div className='min-h-[60px] w-full border-t-[1px] flex flex-wrap items-center gap-2 border-[#d1d1d1] border-b-[1px] mt-[0.5rem]'>
                {myList.map((item, index) => (
                    <button onClick={() => setMyList(prev => prev.filter(item1 => item1 !== item))} key={index} className='px-3 bg-[white] border-[1px] border-[#dfdfdf] shadow-md py-2 rounded-md hover:scale-[1.05] transition-all'>{item}</button>
                ))}
            </div>
            <div className='flex gap-2 justify-start w-full items-center flex-wrap py-2 mt-2 list'>
                {question.options.map((option, index) => {
                    if (!myList.includes(option)) {
                        return <button onClick={() => setMyList(prev => [...prev, option])} key={index} className='px-3 bg-[white] border-[1px] border-[#dfdfdf] shadow-md py-2 rounded-md hover:scale-[1.05] transition-all'>{option}</button>
                    }
                })}
            </div>
        </div>
    )
}

export default Type4