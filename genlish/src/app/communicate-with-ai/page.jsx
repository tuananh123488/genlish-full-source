'use client'
import MicroPhone from '@/components/communicate-with-ai/microphone';
import Navbar from '@/components/Navbar'
import { authContext } from '@/context/AuthContext';
import { api, TypeHTTP } from '@/utils/api';
import { pronounces } from '@/utils/practice';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
const CommunicateWithAI = () => {

    const inputRef = useRef(null);
    const [isRecord, setIsRecord] = useState(false)
    const [value, setValue] = useState('')
    const [visibleSend, setVisibleSend] = useState(false)
    const { authData } = useContext(authContext)
    let voices = globalThis.window?.speechSynthesis.getVoices();
    let speakHandler = (voiceName, content) => { };
    const [messages, setMessages] = useState([])
    const chatRef = useRef()

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
        if (value !== '' && isRecord === false) {
            setVisibleSend(true)
        } else {
            setVisibleSend(false)
        }
    }, [value, isRecord])

    const handleSendMessage = (doc) => {
        const data = [...messages, { speaker: 'i', content: doc }].map(item => {
            return item.content
        }).join('---------------------------------')
        console.log(data);

        setMessages(prev => [...prev, { speaker: 'i', content: doc }])
        api({ sendToken: false, type: TypeHTTP.POST, path: '/openai/ask', body: { ask: data + (messages.length < 2 ? ' Communicate with me briefly and daily life, No Yapping' : '') } })
            .then(res => {
                speakHandler(pronounces[1].voiceName, res)
                setMessages(prev => [...prev, { speaker: 'ai', content: res }])
                setValue('')
            })
    }

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current?.offsetHeight,
            behavior: 'smooth'
        });
    }, [messages, chatRef.current?.offsetHeight])

    return (
        <motion.div
            initial={{ x: 200 * -1 }}
            animate={{ x: 0 }}
            exit={{ x: 1920 * -1, transition: { duration: 0.2 } }}
        >
            <section className='w-full h-screen flex overflow-hidden bg-[#f9fafb]'>
                <Navbar />
                <div className='relative w-[95%] py-[1rem] flex flex-col items-center px-[2.5rem] h-screen overflow-y-auto'>
                    <MicroPhone handleSendMessage={handleSendMessage} visibleSend={visibleSend} inputRef={inputRef} setValue={setValue} isRecord={isRecord} setIsRecord={setIsRecord} />
                    {messages.length === 0 ? (
                        <div className='w-[85%] h-[80%] flex flex-col justify-center items-center overflow-auto'>
                            <span>Bạn hãy nói gì đó bằng Tiếng Anh</span>
                        </div>
                    ) : (
                        <div ref={chatRef} className='w-[85%] h-[77%] flex flex-col overflow-auto'>
                            {messages.map((message, index) => {
                                if (message.speaker === 'ai') {
                                    return <div key={index} className='flex items-start justify-start gap-4'>
                                        <div className='bg-cover h-[45px] w-[45px] rounded-full' style={{ backgroundImage: `url(/logo.png)` }} />
                                        <div className="flex items-start transition-all">
                                            <div style={{ background: 'linear-gradient(to left, #12c2e9, #c471ed, #f64f59)' }} className="relative max-w-xs px-4 py-2 text-white rounded-lg shadow-lg">
                                                <span className="text-[14px] flex flex-col gap-3">
                                                    {message.content.split('/n').map((item, index) => (
                                                        <span key={index}>{item}</span>
                                                    ))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                } else {
                                    return <div key={index} className='flex items-center justify-end gap-4'>
                                        <div className="flex items-start transition-all">
                                            <div className="relative max-w-xs px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg">
                                                <span className="block text-[14px]">{message.content}</span>
                                                <span className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-blue-500"></span>
                                            </div>
                                        </div>
                                        <div className='bg-cover h-[45px] w-[45px] rounded-full' style={{ backgroundImage: `url(${authData.user?.avatar})` }} />
                                    </div>
                                }
                            })}
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    )
}

export default CommunicateWithAI