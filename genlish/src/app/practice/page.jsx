'use client'
import Processing from '@/components/getting-started/Processing'
import FormResult from '@/components/practice/FormResult'
import Type0 from '@/components/practice/Type0'
import Type1 from '@/components/practice/Type1'
import Type2 from '@/components/practice/Type2'
import Type3 from '@/components/practice/Type3'
import Type4 from '@/components/practice/Type4'
import Type5 from '@/components/practice/Type5'
import Type6 from '@/components/practice/Type6'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { practiceContext } from '@/context/PracticeContext'
import Link from 'next/link'
import React, { useContext, useEffect, useRef, useState } from 'react'

const Practice = () => {
    const { practiceData } = useContext(practiceContext)
    const { notifyHandler } = useContext(notifyContext)
    const [questions, setQuestions] = useState([])
    const [wrong, setWrong] = useState(0)
    const stepRef = useRef()

    useEffect(() => {
        if (practiceData.questions.length < 1) {
            notifyHandler.navigate('/learn')
        } else {
            setQuestions(practiceData.questions)
        }
    }, [practiceData.questions])

    useEffect(() => {
        setWrong(0)
    }, [questions])

    useEffect(() => {
        if (wrong === 5) {
            setWrong(0)
            notifyHandler.notify(notifyType.FAIL, 'Bạn đã trượt bài học này')
            notifyHandler.navigate('/learn')
        }
    }, [wrong])


    return (
        <section className='py-[1.5rem] px-[3rem] flex flex-col items-center'>
            <div className='flex w-full items-center justify-center gap-3'>
                <button onClick={() => notifyHandler.navigate('/learn')}><i className='bx bx-left-arrow-alt text-[35px] text-[#929292]'></i></button>
                <Processing width={'80%'} height={'10px'} process={practiceData.currentQuestion} total={questions.length} />
            </div>
            <div className='w-full overflow-hidden'>
                <div style={{ marginLeft: stepRef.current ? stepRef.current.offsetWidth * practiceData.currentQuestion * -1 + 'px' : 0, transition: '0.5s' }} className='w-full flex'>
                    {questions.map((question, index) => (
                        <div key={index} ref={stepRef} className='min-w-full flex flex-col items-center'>
                            {question.type === 0 ? (
                                <Type0 question={question} index={index} />
                            ) : question.type === 1 ? (
                                <Type1 question={question} index={index} />
                            ) : question.type === 2 ? (
                                <Type2 question={question} index={index} />
                            ) : question.type === 3 ? (
                                <Type3 question={question} index={index} />
                            ) : question.type === 4 ? (
                                <Type4 question={question} index={index} />
                            ) : question.type === 5 ? (
                                <Type5 question={question} index={index} />
                            ) : question.type === 6 && (
                                <Type6 question={question} index={index} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <FormResult setWrong={setWrong} />
        </section>
    )
}

export default Practice