// pages/index.js
'use client'
import Navbar from '@/components/Navbar';
import { notifyContext, notifyType } from '@/context/NotifyContext';
import { api, TypeHTTP } from '@/utils/api';
import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';
const Vocabulary = () => {
    const pronounces = [
        {
            name: 'David US',
            voiceName: 'Microsoft David - English (United States)',
            image: '/EN.png'
        },
        {
            name: 'Mark US',
            voiceName: 'Microsoft Mark - English (United States)',
            image: '/EN.png'
        },
        {
            name: 'Zira US',
            voiceName: 'Microsoft Zira - English (United States)',
            image: '/EN.png'
        },
        {
            name: 'Google US',
            voiceName: 'Google US English',
            image: '/EN.png'
        },
        {
            name: 'Google UK Male',
            voiceName: 'Google UK English Male',
            image: '/EN.png'
        },
        {
            name: 'Google UK Female',
            voiceName: 'Google UK English Female',
            image: '/EN.png'
        }
    ]
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { notifyHandler } = useContext(notifyContext)
    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setResult(null);
        api({ path: `/vocabulary/search/${searchTerm}`, type: TypeHTTP.GET, sendToken: false }).then(res => {
            setResult(res);
        }).catch(e => {
            notifyHandler.notify(notifyType.FAIL, e.message.data)
        })
        setLoading(false);
    };
    let speakHandler = (voiceName, content) => { }
    useEffect(() => {
        let voices = globalThis.window.speechSynthesis.getVoices();
        speakHandler = (voiceName, content) => {
            if (typeof globalThis.window !== 'undefined' && globalThis.window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(content);
                utterance.rate = 1;
                utterance.pitch = 1;
                utterance.volume = 1;
                voices = globalThis.window.speechSynthesis.getVoices();
                const selectedVoice = voices.find(voice => voice.name === voiceName);
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                globalThis.window.speechSynthesis.speak(utterance);
            }
        };
    })
    return (
        <motion.div
            initial={{ x: 300 * -1 }}
            animate={{ x: 0 }}
            exit={{ x: 1920 * -1, transition: { duration: 0.5 } }}
        >
            <section className='h-screen w-full flex bg-[#f9fafb] relative' >
                <div onClick={() => router.push('/')} className='w-full cursor-pointer absolute left-6 flex items-center gap-2 top-2 text-[#3f3f3f]'>
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Trở về</span>
                </div>
                <div className="max-w-4xl mx-auto p-6 rounded-lg flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-center mb-6">Từ Điển Anh - Việt</h1>
                    <div className="flex justify-center mb-4">
                        <input
                            type="text"
                            className="w-80 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập từ tiếng Anh..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className={`ml-2 px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                        </button>
                    </div>

                    {error && <p className="text-red-600 text-center">{error}</p>}

                    {result && (
                        result.translatedText !== undefined ? (
                            <div className="mt-6 p-4 flex flex-col gap-2 bg-white rounded-md shadow-md">
                                <h2 classNam e="text-3xl font -semiboldt text-blue-500 font-bold">{result.word}</h2>
                                <p><strong>Định nghĩa:</strong> {result.translatedText}</p>
                                <p><strong>Loại từ:</strong> {result.form}</p>
                                <p><strong>Ngữ âm:</strong> {result.phonetics}</p>
                                <div className='flex '>
                                    <strong>Phát âm:</strong>
                                    <div className='flex w-[80%] flex-wrap font-poppins gap-1'>
                                        {pronounces.map((pronounce, index) => (
                                            <button onClick={() => speakHandler(pronounce.voiceName, result.word)} key={index} className='ml-4 flex h-[30px] text-[14px] items-center gap-1'>
                                                <span className='font-semibold'>{pronounce.name}</span>
                                                <img src={pronounce.image} className='h-[60%]' />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md shadow-md">
                                <p><strong>Lỗi:</strong> Không tìm thấy kết quả cho từ này.</p>
                            </div>
                        )
                    )}
                </div>
            </section>
        </motion.div >
    )
}

export default Vocabulary
