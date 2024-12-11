import React, { useContext, useEffect, useRef, useState } from 'react'
import { notifyType, utilsContext } from '../../contexts/UtilsContext';
import { shuffleArray } from '../../utils/other';
import { learnContext } from '../../contexts/LearnContext';
import { userContext } from '../../contexts/UserContext';
import { Image, Text, View } from 'react-native';
import { question1, question2, question3, question4, question5, question6, question7, question8 } from '../../utils/practice';
import { practiceContext } from '../../contexts/PracticeContext';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import { menuContext } from '../../contexts/MenuContext';

const Step = ({ setTop, margin, left, level, door, final = false }) => {

    const trangThai = {
        1: 'Chưa Học',
        2: 'Hiện Tại',
        3: 'Đã Học'
    }
    const { menuHandler } = useContext(menuContext)
    const stepRef = useRef(null); // Khởi tạo ref
    const { learnHandler } = useContext(learnContext)
    const { userData } = useContext(userContext)
    const [press, setPress] = useState(false)
    const [status, setStatus] = useState(trangThai[1])
    const { utilsHandler } = useContext(utilsContext)
    const { practiceHandler } = useContext(practiceContext)

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
                    if (level <= 4) {
                        tests = [...door.beginner]
                    } else if (level > 4 && level <= 8) {
                        tests = [...door.elementary, ...shuffleArray(door.beginner.filter((item, index) => index < door.beginner.length / 2))]
                    } else if (level > 8 && level <= 12) {
                        tests = [...door.intermediate, ...shuffleArray(door.elementary.filter((item, index) => index < door.elementary.length / 2))]
                    } else if (level > 12 && level <= 16) {
                        tests = [...door.upperIntermediate, ...shuffleArray(door.intermediate.filter((item, index) => index < door.intermediate.length / 2))]
                    } else if (level > 16 && level <= 20) {
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
                }
                else {
                    if (level <= 4) {
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
                    } else if (level > 16 && level <= 20) {
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
                            question7(tests),
                            question8(tests),
                            question7(tests),
                            question8(tests),
                            question8(tests),
                            question1(tests),
                            question2(tests),
                            question3(tests),
                            question4(tests),
                            question5(tests),
                            question6(tests),
                        ])
                    }
                    else {
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
                            question7(tests),
                            question8(tests),
                            question7(tests),
                            question8(tests),
                        ])
                    }
                }
                practiceHandler.setQuestions(questions)
                setPress(true)
                setTimeout(() => {
                    setPress(false)
                    menuHandler.setDisplayPractice(true)
                }, 200);
            } else {
                utilsHandler.notify(notifyType.WARNING, 'Hãy hoàn thành bài học trước để có thể kiểm tra')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userData.user && door && level > 0) {
            const currentLevel = userData.user.study.levelVocabulary
            if (door.gate.level <= userData.user.study.levelVocabulary.gate) {
                if (currentLevel.gate === door.gate.level && currentLevel.door === door.individual.door && currentLevel.level === level) {
                    setStatus(trangThai[2])
                }
                if (currentLevel.gate === door.gate.level && currentLevel.door === door.individual.door && currentLevel.level > level) {
                    setStatus(trangThai[3])
                }
                if (currentLevel.gate >= door.gate.level && currentLevel.door > door.individual.door) {
                    setStatus(trangThai[3])
                }
            } else {
                setStatus(trangThai[1])
            }
        }
    }, [userData.user, door, level])

    useEffect(() => {
        if (status === trangThai[2] && stepRef.current) {
            const rect = stepRef.current.getBoundingClientRect();
            const elementTop = rect.top + window.pageYOffset - window.innerHeight / 2;
            setTop(elementTop)
        }
    }, [status])

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
            {status === trangThai[2] && (
                <View style={{ height: 70, width: 70, flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#85c1e9', position: 'absolute', left: -80, top: 20, borderRadius: 10 }}>
                    <Image source={{ uri: userData.user?.avatar }} style={{ width: 40, height: 40, borderRadius: 40 }} />
                </View>
            )}
            <TouchableOpacity onPress={() => handleAnimate()} style={left === true ? { flexDirection: 'column', position: 'relative', marginLeft: margin ? margin : 0 } : { flexDirection: 'column', position: 'relative', marginRight: margin ? margin : 0 }}>
                <View style={{ height: 90, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, width: 90, backgroundColor: status === trangThai[1] ? '#e5e5e5' : status === trangThai[2] ? '#85c1e9' : '#58d68d', borderRadius: 90, zIndex: 10 }}>
                    {final ? (
                        <Icon1 name='champagne-glasses' style={{ fontSize: 35, color: status === trangThai[1] ? '#afafaf' : 'white' }} />
                    ) : (
                        <Icon name='star-fill' style={{ fontSize: 35, color: status === trangThai[1] ? '#afafaf' : 'white' }} />
                    )}
                </View>
                <View style={{ height: 90, width: 90, borderRadius: 90, top: 20, position: 'absolute', backgroundColor: status === trangThai[1] ? '#b7b7b7' : status === trangThai[2] ? '#2e86c1' : '#229954' }} />
            </TouchableOpacity>
        </View>
    )
}

export default Step