import React, { useContext, useEffect, useState } from 'react'
import * as Speech from 'expo-speech';
import { practiceContext } from '../../contexts/PracticeContext';
import { Dimensions, Image, Text, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { TouchableOpacity } from 'react-native';

const Type4 = ({ question, index }) => {
    const { width } = Dimensions.get('window');
    const { practiceData, practiceHandler } = useContext(practiceContext)
    const [myList, setMyList] = useState([])
    const speak = (phrase) => {
        Speech.speak(phrase, {
            language: 'en',
        });
    };

    useEffect(() => {
        practiceHandler.setMyAnswer(myList.join(' '))
    }, [myList])


    return (
        <View style={{ flexDirection: 'column', gap: 10, width, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Sắp xếp bằng Tiếng Việt</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={LogoImage} style={{ width: 35, height: 50 }} />
                <Text style={{ backgroundColor: '#f0f0f0', fontSize: 16, paddingHorizontal: 15, borderRadius: 10, paddingVertical: 10 }}>{`${question.question}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', gap: 10, marginTop: 10 }}>
                {question.options.map((option, index) => {
                    if (!myList.includes(option)) {
                        return <TouchableOpacity key={index} onPress={() => setMyList(prev => [...prev, option])} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#999', paddingHorizontal: 10, width: 70 }}>
                            <Text style={{ width: '100%', textAlign: 'center' }}>{option}</Text>
                        </TouchableOpacity>
                    }
                })}
            </View>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Đáp Án Của Bạn</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 10 }}>
                {myList.map((option, index) => (
                    <TouchableOpacity key={index} onPress={() => setMyList(prev => prev.filter(item1 => item1 !== option))} style={{ width: 200, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#999', width: 70 }}>
                        <Text style={{ width: '100%', textAlign: 'center' }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View >
    )
}

export default Type4