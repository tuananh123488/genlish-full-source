import React, { useContext, useEffect, useState } from 'react'
import * as Speech from 'expo-speech';
import { practiceContext } from '../../contexts/PracticeContext';
import { Dimensions, Image, Text, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { TouchableOpacity } from 'react-native';
import { shuffleArray } from '../../utils/other';

const Type2 = ({ question, index }) => {
    const { width } = Dimensions.get('window');
    const { practiceData, practiceHandler } = useContext(practiceContext)
    const [myList, setMyList] = useState([])
    const [vietnameses, setVietnameses] = useState([])
    const [current, setCurrent] = useState({
        english: '',
        vietnamese: ''
    })
    const speak = (phrase) => {
        Speech.speak(phrase, {
            language: 'en',
        });
    };

    useEffect(() => {
        if (question) {
            setVietnameses(shuffleArray(question.vocabularies.map(item => item.vietnamese)))
        }
    }, [question])

    useEffect(() => {
        if (practiceData.currentQuestion === index) {
            speak(question.question.english)
        }
    }, [practiceData.currentQuestion])

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
        <View style={{ flexDirection: 'column', gap: 10, width, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Nối Từ</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={LogoImage} style={{ width: 35, height: 50 }} />
                <Text style={{ backgroundColor: '#f0f0f0', fontSize: 16, paddingHorizontal: 15, borderRadius: 10, paddingVertical: 10 }}>{question.question}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 }}>
                <View style={{ flexDirection: 'column', gap: 5, width: '48%' }}>
                    {question.vocabularies.map(item => item.english).map((item, index) => {
                        return !myList.map(item1 => item1.english).includes(item) && (
                            <TouchableOpacity key={index} onPress={() => {
                                speak(item)
                                setCurrent({ ...current, english: item })
                            }} style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 47, borderRadius: 10, borderWidth: 1, borderColor: '#999' }}>
                                <Text style={{ width: '100%', textAlign: 'center', fontWeight: current.english === item ? 600 : 400 }}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={{ flexDirection: 'column', gap: 5, width: '48%' }}>
                    {vietnameses.map((item, index) => {
                        {
                            return !myList.map(item1 => item1.vietnamese).includes(item) && (
                                <TouchableOpacity key={index} onPress={() => {
                                    setCurrent({ ...current, vietnamese: item })
                                }} style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 47, borderRadius: 10, borderWidth: 1, borderColor: '#999' }}>
                                    <Text style={{ width: '100%', textAlign: 'center', fontWeight: current.vietnamese === item ? 600 : 400 }}>{item}</Text>
                                </TouchableOpacity>
                            )
                        }
                    })}
                </View>
            </View>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Đáp Án Của Bạn</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 }}>
                <View style={{ flexDirection: 'column', gap: 5, width: '100%' }}>
                    {myList.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => setMyList(prev => prev.filter(item1 => item1.english !== item.english))} style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 47, borderRadius: 10, borderWidth: 1, borderColor: '#999' }}>
                            <Text style={{ width: '100%', textAlign: 'center', fontWeight: current.vietnamese === item ? 600 : 400 }}>{`${item.english} : ${item.vietnamese}`}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default Type2