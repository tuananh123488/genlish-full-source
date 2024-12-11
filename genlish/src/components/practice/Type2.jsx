import React, { useContext, useEffect, useState } from 'react'
import FormResult from './FormResult'
import { practiceContext } from '@/context/PracticeContext'
import { pronounces } from '@/utils/practice'
import { shuffleArray } from '@/utils/other'

// Nối các câu
const Type2 = ({ question, index }) => {

    const { practiceData, practiceHandler } = useContext(practiceContext)
    const [isClicked, setIsClicked] = useState(false);
    let voices = globalThis.window?.speechSynthesis.getVoices();
    let speakHandler = (voiceName, content) => { };
    const [ready, setReady] = useState(false)
    const [myList, setMyList] = useState([])
    const [vietnameses, setVietnameses] = useState([])
    const [current, setCurrent] = useState({
        english: '',
        vietnamese: ''
    })

    useEffect(() => {
        if (question) {
            setVietnameses(shuffleArray(question.vocabularies.map(item => item.vietnamese)))
        }
    }, [question])

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
        } else {
            setMyList([])
        }
    }, [ready, practiceData.currentQuestion])

    useEffect(() => {
        if (current.english !== '' && current.vietnamese !== '') {
            const arr = [...myList, current]
            const arr1 = []
            question.vocabularies.map(item => item.english).forEach(item => {
                const found = arr.filter(item1 => item1.english === item)[0]
                if (found)
                    arr1.push(found)
            })
            setMyList(arr1)
            practiceHandler.setMyAnswer(arr1.map(item => `${item.english}-${item.vietnamese}`).join('/'))
            setCurrent({
                english: '',
                vietnamese: ''
            })
        }
    }, [current])

    return (
        <div className='w-[50%] flex flex-col gap-4 relative'>
            <div className='flex items-center gap-4'>
                <img src='/logo.png' className='w-[80px] animate-slight-move' />
                <div className="flex items-start transition-all">
                    <div className="relative max-w-xs px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg">
                        <span className="block">{question.question}</span>
                        <span className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-blue-500"></span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2 w-full items-center py-2'>
                {/* {question.options.map((option, index) => (
                    <button onClick={() => practiceHandler.setMyAnswer(option)} style={{ fontWeight: practiceData.myAnswer === option ? 'bold' : '400' }} key={index} className='w-[100%] bg-[white] border-[1px] border-[#dfdfdf] shadow-md py-3 rounded-md hover:scale-[1.05] transition-all'>{option}</button>
                ))} */}
                <div className='grid grid-cols-2 w-[80%] gap-4 font-semibold text-[15px] text-[#4e4e4e]'>
                    <div className='grid grid-cols-1 gap-2'>
                        {question.vocabularies.map(item => item.english).map((item, index) => (
                            <div key={index} className='text-center h-[45px] cursor-pointer transition-all hover:scale-[1.05]'>
                                {!myList.map(item => item.english).includes(item) && (
                                    <div style={{ fontWeight: current.english === item ? 'bold' : '500' }} onClick={() => {
                                        speakHandler(pronounces[3].voiceName, item)
                                        setCurrent({ ...current, english: item })
                                    }} className='w-full h-full border-[2px] border-[#e4e4e4] rounded-md flex items-center justify-center'>
                                        {item}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='grid grid-cols-1 gap-2'>
                        {vietnameses.map((item, index) => (
                            <div key={index} className='text-center h-[45px] cursor-pointer transition-all hover:scale-[1.05]'>
                                {!myList.map(item => item.vietnamese).includes(item) && (
                                    <div style={{ fontWeight: current.vietnamese === item ? 'bold' : '500' }} onClick={() => setCurrent({ ...current, vietnamese: item })} className='w-full h-full border-[2px] border-[#e4e4e4] rounded-md flex items-center justify-center'>
                                        {item}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div style={practiceData.questions[practiceData.currentQuestion]?.type === 2 ? { right: myList.length > 0 ? myList.length === 4 ? '50%' : '20px' : '-100%', transform: myList.length === 4 ? 'translateX(50%) translateY(-50%)' : 'translateX(0) translateY(-50%)' } : { right: '-100%' }} className='flex flex-col gap-2 transition-all rounded-lg border-[2px] p-2 fixed top-[50%] translate-y-[-50%] w-[350px] border-[#e4e4e4]'>
                    <span className='font-semibold'>Kết quả của bạn</span>
                    {myList.map((item, index) => (
                        <div onClick={() => setMyList(prev => prev.filter(item1 => item1.english !== item.english))} key={index} className='border-[1px] text-[14px] border-[#e4e4e4] text-center rounded-md py-3 cursor-pointer transition-all hover:scale-[1.05]'>
                            {`${item.english} : ${item.vietnamese}`}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Type2