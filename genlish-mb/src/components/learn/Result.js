import React, { useContext, useEffect, useState } from 'react'
import * as Speech from 'expo-speech';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { correctResponses, incorrectResponses, removeSpecialChars, shuffleArray } from '../../utils/other';
import { practiceContext } from '../../contexts/PracticeContext';
import { api, TypeHTTP } from '../../utils/api';
import { userContext } from '../../contexts/UserContext';
import { menuContext } from '../../contexts/MenuContext';
import { learnContext } from '../../contexts/LearnContext';
import Success from '../../../assets/success.png'
import Fail from '../../../assets/fail.png'

const Result = ({ setWrong }) => {

    const [status, setStatus] = useState(0)
    const { practiceData, practiceHandler } = useContext(practiceContext)
    const { userHandler } = useContext(userContext)
    const { menuHandler } = useContext(menuContext)
    const { userData } = useContext(userContext)
    const { learnData } = useContext(learnContext)

    const speak = (phrase) => {
        Speech.speak(phrase, {
            language: 'en',
        });
    };

    useEffect(() => {
        if (practiceData.questions.length === 0) {
            setStatus(0)
        }
    }, [practiceData.questions])

    const handleCheckAnswer = () => {
        if (removeSpecialChars(practiceData.myAnswer.trim().toLowerCase()) === removeSpecialChars(practiceData.questions[practiceData.currentQuestion].answer.trim().toLowerCase())) {
            speak(shuffleArray(correctResponses)[0])
            setStatus(1)
        } else {
            setWrong(prev => prev + 1)
            speak(shuffleArray(incorrectResponses)[0])
            setStatus(-1)
        }
    }

    const handleNext = () => {
        if (practiceData.currentQuestion === practiceData.questions.length - 1) {

        } else {
            setStatus(0)
            practiceHandler.setMyAnswer('')
            practiceHandler.setCurrentQuestion(prev => prev + 1)
        }
    }

    const handleComplete = () => {
        let levelVocabulary = {}
        if (userData.user.study.levelVocabulary.level === learnData.doors.filter(item => item.individual.door === userData.user.study.levelVocabulary.door)[0].individual.numberOfTest) {
            levelVocabulary = {
                ...userData.user.study.levelVocabulary,
                door: userData.user.study.levelVocabulary.door + 1,
                level: 1
            }
        } else {
            levelVocabulary = {
                ...userData.user.study.levelVocabulary,
                level: userData.user.study.levelVocabulary.level + 1
            }
        }
        const body = {
            ...userData.user,
            study: {
                ...userData.user.study,
                levelVocabulary
            }
        }
        api({ type: TypeHTTP.POST, path: '/user/update', body, sendToken: true })
            .then(userUpdated => {
                userHandler.setUser(userUpdated)
                menuHandler.setDisplayPractice(false)
                setTimeout(() => {
                    practiceHandler.setMyAnswer('')
                    practiceHandler.setCurrentQuestion(0)
                    practiceHandler.setQuestions([])
                }, 200);
            })
    }

    return (
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 100, flexDirection: 'row', paddingHorizontal: 20 }}>
            {status === 0 && (
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TouchableOpacity onPress={() => handleCheckAnswer()} style={{ backgroundColor: '#149dff', paddingHorizontal: 40, flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 8 }}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Kiểm Tra</Text>
                    </TouchableOpacity>
                </View>
            )}
            {status === 1 && (
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Image source={Success} style={{ height: 40, width: 40 }} />
                        <Text style={{ fontSize: 17, fontWeight: 600 }}>Đúng Rồi</Text>
                    </View>
                    {practiceData.currentQuestion === practiceData.questions.length - 1 ? (
                        <TouchableOpacity onPress={() => handleComplete()} style={{ backgroundColor: '#149dff', paddingHorizontal: 40, flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 8 }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Hoàn Thành</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => handleNext()} style={{ backgroundColor: '#149dff', paddingHorizontal: 40, flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 8 }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Tiếp Tục</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {status === -1 && (
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, width: '60%' }}>
                        <Image source={Fail} style={{ height: 40, width: 40 }} />
                        <View style={{ flexDirection: 'column', width: '100%' }}>
                            <Text style={{ fontSize: 17, fontWeight: 600 }}>Sai Rồi</Text>
                            {![2].includes(practiceData.questions[practiceData.currentQuestion]?.type) && (
                                <>
                                    <Text style={{ fontSize: 14, fontWeight: 600, width: '100%' }}>{practiceData.questions[practiceData.currentQuestion]?.display.english} - {practiceData.questions[practiceData.currentQuestion]?.display.vietnamese}</Text>
                                </>
                            )}
                        </View>
                    </View>
                    {practiceData.currentQuestion === practiceData.questions.length - 1 ? (
                        <TouchableOpacity onPress={() => handleComplete()} style={{ backgroundColor: '#149dff', paddingHorizontal: 40, flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 8 }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Hoàn Thành</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => handleNext()} style={{ backgroundColor: '#149dff', paddingHorizontal: 40, flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 8 }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Tiếp Tục</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    )
}

export default Result