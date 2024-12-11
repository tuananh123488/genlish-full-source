import React, { useContext } from 'react'
import * as Speech from 'expo-speech';
import { practiceContext } from '../../contexts/PracticeContext';
import { Dimensions, Image, Text, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { TouchableOpacity } from 'react-native';

const Type0 = ({ question }) => {
    const { width } = Dimensions.get('window');
    const { practiceData, practiceHandler } = useContext(practiceContext)
    const speak = (phrase) => {
        Speech.speak(phrase, {
            language: 'en',
        });
    };

    const handleSubmitAnswer = (option) => {
        practiceHandler.setMyAnswer(option)
        speak(option)
    }


    return (
        <View style={{ flexDirection: 'column', gap: 10, width, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Chọn Nghĩa Đúng</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={LogoImage} style={{ width: 35, height: 50 }} />
                <Text style={{ backgroundColor: '#f0f0f0', fontSize: 16, paddingHorizontal: 15, borderRadius: 10, paddingVertical: 10 }}>{question.question}</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 10 }}>
                {question.options.map((option, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSubmitAnswer(option)} style={{ width: 200, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 47, borderRadius: 10, borderWidth: 1, borderColor: '#999' }}>
                        <Text style={{ width: '100%', textAlign: 'center', fontWeight: practiceData.myAnswer === option ? 600 : 400 }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

export default Type0