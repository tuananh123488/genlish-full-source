import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { practiceContext } from '@/context/PracticeContext'
import { shuffleArray } from '@/utils/other'
import { question1, question2, question3, question4, question5, question6, question7, question8 } from '@/utils/practice'
import React, { useContext, useEffect, useRef, useState } from 'react'

const Step = ({ setTop, margin, left, level, door, final = false }) => {
    const trangThai = {
        1: 'Chưa Học',
        2: 'Hiện Tại',
        3: 'Đã Học'
    }
    const stepRef = useRef(null); // Khởi tạo ref
    const { notifyHandler } = useContext(notifyContext)
    const { practiceHandler } = useContext(practiceContext)
    const { authData } = useContext(authContext)
    const [press, setPress] = useState(false)
    const [status, setStatus] = useState(trangThai[1])

    const handleAnimate = () => {
        try {
            if (status !== trangThai[1]) {
                const tests1 = [door.beginner, door.elementary, door.intermediate, door.upperIntermediate, door.advanced].filter(item => item.length > 0).length
                let tests = []
                if (level === door.individual.numberOfTest) {
                    if (Math.floor(door.individual.numberOfTest / 4) < 4) {
                        tests = shuffleArray([...door.beginner, ...door.elementary, ...door.intermediate])
                    } else {
                        tests = shuffleArray([...door.beginner, ...door.elementary, ...door.intermediate, ...door.upperIntermediate, ...door.advanced])
                    }
                } else {
                    if (level <= 3) {
                        tests = [...door.beginner]
                    } else if (level > 3 && level <= 5) {
                        tests = [...door.elementary, ...shuffleArray(door.beginner.filter((item, index) => index < door.beginner.length / 2))]
                    } else if (level > 5 && level <= 8) {
                        tests = [...door.intermediate, ...shuffleArray(door.elementary.filter((item, index) => index < door.elementary.length / 2))]
                    } else if (level > 8 && level <= 10) {
                        tests = [...door.upperIntermediate, ...shuffleArray(door.intermediate.filter((item, index) => index < door.intermediate.length / 2))]
                    } else if (level > 10 && level <= 13) {
                        tests = [...door.advanced, ...shuffleArray(door.upperIntermediate.filter((item, index) => index < door.upperIntermediate.length / 2))]
                    }
                }

                let questions = []
                if (level === door.individual.numberOfTest) {
                    questions = shuffleArray([
                        question1(tests),
                        question2(tests),
                        question3(tests),
                        question4(tests),
                        question5(tests),
                        question6(tests),
                        question7(tests),
                        question8(tests),
                        question1(tests),
                        question2(tests),
                        question3(tests),
                        question4(tests),
                        question5(tests),
                        question6(tests),
                        question7(tests),
                        question8(tests),
                        question3(tests),
                        question4(tests),
                        question5(tests),
                        question6(tests),
                        question7(tests),
                        question8(tests),
                        question7(tests),
                        question8(tests),
                        question2(tests),
                        question3(tests),
                    ])
                }
                else {
                    if (level <= 3) {
                        questions = shuffleArray([
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                            question5(tests),
                            question6(tests),
                            question7(tests),
                            question8(tests),
                        ])
                    } else if (level > 3 && level <= 5) {
                        questions = shuffleArray([
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                            question5(tests),
                            question6(tests),
                            question7(tests),
                            question8(tests),
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                        ])
                    } else if (level > 5 && level <= 8) {
                        questions = shuffleArray([
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                            question5(tests),
                            question6(tests),
                            question7(tests),
                            question8(tests),
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                        ])
                    } else if (level > 8 && level <= 10) {
                        questions = shuffleArray([
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                            question5(tests),
                            question6(tests),
                            question7(tests),
                            question8(tests),
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                            question5(tests),
                            question6(tests),
                            question7(tests),
                            question8(tests),
                        ])
                    } else if (level > 10 && level <= 12) {
                        questions = shuffleArray([
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                            question5(tests),
                            question6(tests),
                            question7(tests),
                            question8(tests),
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                            question5(tests),
                            question6(tests),
                            question7(tests),
                            question8(tests),
                        ])
                    }
                }
                practiceHandler.setQuestions(questions)
                setPress(true)
                setTimeout(() => {
                    setPress(false)
                    notifyHandler.navigate('/practice')
                }, 200);
            } else {
                notifyHandler.notify(notifyType.WARNING, 'Hãy hoàn thành bài học trước để có thể kiểm tra')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (authData.user && door && level > 0) {
            const currentLevel = authData.user.study.levelVocabulary
            if (currentLevel.gate === door.gate.level && currentLevel.door === door.individual.door && currentLevel.level === level) {
                setStatus(trangThai[2])
            }
            if (currentLevel.gate === door.gate.level && currentLevel.door === door.individual.door && currentLevel.level > level) {
                setStatus(trangThai[3])
            }
            if (currentLevel.gate >= door.gate.level && currentLevel.door > door.individual.door) {
                setStatus(trangThai[3])
            }
        }
    }, [authData.user, door, level])

    useEffect(() => {
        if (status === trangThai[2] && stepRef.current) {
            const rect = stepRef.current.getBoundingClientRect();
            const elementTop = rect.top + window.pageYOffset - window.innerHeight / 2;
            setTop(elementTop)
        }
    }, [status])

    return (
        <button
            ref={status === trangThai[2] ? stepRef : null} // Gán ref đúng cách
            onClick={() => handleAnimate()}
            style={left === false ? { marginLeft: `${margin}px` } : { marginRight: `${margin}px` }}
            className={`relative z-20`}
        >
            <div
                style={{
                    top: press ? '8px' : 0,
                    backgroundColor: status === trangThai[1] ? '#e5e5e5' : status === trangThai[2] ? '#85c1e9' : '#58d68d'
                }}
                className='h-[65px] transition-all absolute z-10 w-[70px] rounded-full flex items-center justify-center'
            >
                {final ? (
                    <i style={{ color: status === trangThai[1] ? '#afafaf' : 'white' }} className="fa-solid fa-champagne-glasses text-[32px]"></i>
                ) : (
                    <i style={{ color: status === trangThai[1] ? '#afafaf' : 'white' }} className="fa-solid fa-star text-[32px]"></i>
                )}
            </div>
            <div
                style={{
                    backgroundColor: status === trangThai[1] ? '#b7b7b7' : status === trangThai[2] ? '#2e86c1' : '#229954'
                }}
                className='h-[65px] absolute top-[8px] w-[70px] rounded-full'
            ></div>
            <div className='h-[78px] relative w-[80px]'>
                {status === trangThai[2] && (
                    <div className='animate-slight-move flex items-center gap-2 shadow-xl z-50 rounded-xl ml-[-140%] bg-[#85c1e9] px-2 py-2 w-[100px]'>
                        <img src={authData.user?.avatar} className='w-[40px] h-[40px] rounded-full' />
                        <span className='text-[white] font-bold text-[17px]'>Bạn</span>
                    </div>
                )}
            </div>
        </button>
    )
}

export default Step