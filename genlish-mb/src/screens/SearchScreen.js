import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, ImageBackground, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { menuContext } from '../contexts/MenuContext';
import { payloadContext } from '../contexts/PayloadContext';
import { userContext } from '../contexts/UserContext';
import { api, TypeHTTP } from '../utils/api';
import * as Speech from 'expo-speech';

const SearchScreen = () => {
    const { width, height } = Dimensions.get('window');
    const { menuHandler } = useContext(menuContext)
    const { payloadHandler } = useContext(payloadContext)
    const { userData } = useContext(userContext)
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setError('');
        setResult(null);
        api({ path: `/vocabulary/search/${searchTerm}`, type: TypeHTTP.GET, sendToken: false }).then(res => {
            setResult(res);
        })
    };

    const speak = (phrase) => {
        Speech.speak(phrase, {
            language: 'en',
        });
    };

    return (
        <ScrollView>
            {/* {screenData.currentScreen === 1 && ( */}
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width, height: height - 70, paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text style={{ fontSize: 22, fontWeight: 600 }}>Từ Điển Anh - Việt</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <TextInput value={searchTerm} onChangeText={(e) => setSearchTerm(e)} placeholder='Nhập từ Tiếng Anh...' style={{ paddingHorizontal: 20, width: '70%', marginTop: 10, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
                    <TouchableOpacity onPress={() => handleSearch()} style={{ marginTop: 10, backgroundColor: '#241d49', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 7 }}>
                        <Text style={{ color: 'white', fontSize: 15 }}>Tìm Kiếm</Text>
                    </TouchableOpacity>
                </View>
                {result && (
                    result.translatedText !== undefined ? (
                        <View style={{ flexDirection: 'column', backgroundColor: '#f7f7f7', width: '95%', marginTop: 10, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, gap: 2 }}>
                            <Text style={{ fontSize: 25, fontWeight: 600, marginBottom: 5 }}>{result.word}</Text>
                            <Text style={{ fontSize: 16 }}>Định nghĩa: {result.translatedText}</Text>
                            <Text style={{ fontSize: 16 }}>Loại từ: {result.form}</Text>
                            <Text style={{ fontSize: 16 }}>Ngữ âm: {result.phonetics}</Text>
                            <TouchableOpacity onPress={() => speak(result.word)} style={{ marginTop: 10, backgroundColor: '#241d49', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 7 }}>
                                <Text style={{ color: 'white', fontSize: 15 }}>Nhấn Để Nghe Phát Âm</Text>
                            </TouchableOpacity>

                        </View>
                    ) : (
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ fontSize: 16 }}>Lỗi: Không tìm thấy kết quả cho từ này.</Text>
                        </View>
                    )
                )}
            </View>
            {/* )} */}
        </ScrollView>
    )
}

export default SearchScreen