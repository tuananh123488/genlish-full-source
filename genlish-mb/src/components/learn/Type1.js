import React, { useContext, useEffect, useState } from 'react'
import * as Speech from 'expo-speech';
import { practiceContext } from '../../contexts/PracticeContext';
import { Dimensions, Image, Text, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Type1 = ({ question, index }) => {
    const { width } = Dimensions.get('window');
    const { practiceData, practiceHandler } = useContext(practiceContext)
    const speak = (phrase) => {
        Speech.speak(phrase, {
            language: 'en',
        });
    };

    const handleSubmitAnswer = (option) => {
        practiceHandler.setMyAnswer(option)
        // speak(option)
    }

    useEffect(() => {
        if (practiceData.currentQuestion === index) {
            speak(question.question.english)
        }
    }, [practiceData.currentQuestion])


    return (
        <View style={{ flexDirection: 'column', gap: 10, width, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Nghe và chọn đáp án đúng</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={LogoImage} style={{ width: 35, height: 50 }} />
                <Text style={{ backgroundColor: '#f0f0f0', fontSize: 16, paddingHorizontal: 15, borderRadius: 10, paddingVertical: 10 }}>Bạn nghe được gì?</Text>
                <TouchableOpacity onPress={() => speak(question.question.english)} style={{ backgroundColor: '#f0f0f0', borderRadius: 10, height: 40, width: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name='volume-up' style={{ fontSize: 30 }} />
                </TouchableOpacity>
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

export default Type1