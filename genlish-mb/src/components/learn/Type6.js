import React, { useContext } from 'react'
import * as Speech from 'expo-speech';
import { practiceContext } from '../../contexts/PracticeContext';
import { Dimensions, Image, Text, TextInput, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { TouchableOpacity } from 'react-native';

const Type6 = ({ question }) => {
    const { width } = Dimensions.get('window');
    const { practiceData, practiceHandler } = useContext(practiceContext)
    const speak = (phrase) => {
        Speech.speak(phrase, {
            language: 'en',
        });
    };

    return (
        <View style={{ flexDirection: 'column', gap: 10, width, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>Dịch Câu Sau</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={LogoImage} style={{ width: 35, height: 50 }} />
                <Text style={{ backgroundColor: '#f0f0f0', fontSize: 16, paddingHorizontal: 15, borderRadius: 10, paddingVertical: 10 }}>{question.question}</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <TextInput
                    onChangeText={e => practiceHandler.setMyAnswer(e)}
                    style={{
                        width: '100%',
                        height: 150, // Chiều cao lớn hơn để giống textarea
                        borderWidth: 1,
                        borderColor: '#999',
                        borderRadius: 10,
                        textAlignVertical: 'top', // Canh văn bản từ đầu (trên cùng)
                        padding: 10, // Thêm khoảng cách bên trong
                    }}
                    placeholder='Viết Tiếng Việt...'
                    multiline={true} // Cho phép nhiều dòng
                />
            </View>
        </View>
    )
}

export default Type6