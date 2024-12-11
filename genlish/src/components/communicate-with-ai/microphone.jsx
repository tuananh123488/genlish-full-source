import React, { useEffect, useRef, useState } from 'react'

const MicroPhone = ({ handleSendMessage, type = false, inputRef, isRecord, setIsRecord, setValue, value, visibleSend }) => {

    const recognitionRef = useRef(null)
    const [reLoad, setReLoad] = useState(false)
    const [transcript, setTranscript] = useState('')

    const handleStart = () => {
        setValue('')
        setTranscript('')
        recognitionRef.current = new globalThis.window.webkitSpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.onresult = (e) => {
            let fullTranscript = ''
            for (let i = 0; i < e.results.length; i++) {
                fullTranscript += e.results[i][0].transcript // Nối tất cả các đoạn
            }

            // Chỉ cập nhật transcript cuối cùng nếu nó là final, không ghi đè khi tạm ngừng
            if (e.results[e.results.length - 1].isFinal) {
                setValue(fullTranscript)
                setTranscript((prev) => fullTranscript)  // Nối đoạn mới với đoạn cũ
            }
        }
        recognitionRef.current.start()
        setIsRecord(true)
    }

    const handleEnd = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsRecord(false)
        }
    }

    useEffect(() => {
        if (value === '') {
            setTranscript('')
        }
    }, [value])

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                handleStart()
            } else if (event.code === 'Enter') {
                event.preventDefault();
                if (transcript !== '') {
                    handleSendMessage(transcript)
                    handleEnd()
                }
            } else if (event.shiftKey) {
                event.preventDefault();
                handleEnd()
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [transcript]);

    return (
        <div style={type === false ? { width: '80%' } : { width: '100%', position: 'fixed', bottom: 10 }} className='absolute bottom-4 left-[50%] translate-x-[-50%] h-[130px] font-poppins transition-all bg-[white] shadow-xl py-5 px-4 flex items-end justify-between rounded-md overflow-hidden gap-4'>
            <div className='w-full'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-bold mb-1'>{isRecord ? 'Communicating' : 'Communicate'}</h3>
                    {isRecord && <div className='bg-[#e93c3c] h-[20px] w-[20px] animate-pulse rounded-full'></div>}
                </div>
                {isRecord && <h4 className='mb-1'>Start Speaking</h4>}
                <input ref={inputRef} value={transcript} onChange={e => { setValue(e.target.value); setTranscript(e.target.value) }} className='focus:outline-0 border-[#d7d7d7] w-full border-[1px] h-[40px] px-2 rounded-md' placeholder={isRecord ? 'Speaking...' : 'Some Words'} />
            </div>
            {visibleSend ? (
                <>
                    <button onClick={() => handleSendMessage(transcript)} className='transition-all text-[30px] text-[#4dac96] focus:outline-0 flex justify-center items-end translate-y-[-5px]'>
                        <i className='bx bx-send'></i>
                    </button>
                </>
            ) : (
                <>
                    {!isRecord ?
                        <button onClick={() => handleStart()} className='transition-all text-[30px] text-[#4dac96] focus:outline-0 flex justify-center items-end translate-y-[-5px]'>
                            <i className='bx bx-microphone'></i>
                        </button>
                        :
                        <button onClick={() => handleEnd()} className='transition-all text-[40px] text-[#4dac96] focus:outline-0 flex justify-center items-end'>
                            <i className='bx bx-pause-circle' ></i>
                        </button>
                    }
                </>
            )}
        </div>
    )
}

export default MicroPhone