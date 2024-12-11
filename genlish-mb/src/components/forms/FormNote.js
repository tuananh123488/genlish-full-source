import React, { useContext, useEffect, useState } from 'react'
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { menuContext } from '../../contexts/MenuContext';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { payloadContext } from '../../contexts/PayloadContext';
import { convertSecondsToTimeFormat } from '../../utils/time';
import { api, TypeHTTP } from '../../utils/api';

const FormNote = () => {
    const { menuData, menuHandler } = useContext(menuContext);
    const { width } = Dimensions.get('window');
    const [translateX] = useState(new Animated.Value(menuData.displayNote === true ? 0 : width));
    const { payloadData, payloadHandler } = useContext(payloadContext)
    const [note, setNote] = useState('')

    const handleSubmitNote = () => {
        const body = {
            ...payloadData.studyCourse,
            note: payloadData.studyCourse.note === '' ? `${payloadData.currentEpisode}-${payloadData.time}:${note}` : payloadData.studyCourse.note + `\n${payloadData.currentEpisode}-${payloadData.time}:${note}`
        }
        api({ type: TypeHTTP.PUT, sendToken: true, path: `/studycourse/update/${payloadData.studyCourse._id}`, body })
            .then(res => {
                payloadHandler.setStudyCourse(res)
                setNote('')
                payloadHandler.setTime()
                menuHandler.setDisplayNote(false)
            })
    }

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: menuData.displayNote === true ? 0 : width,
            duration: 300, // Thời gian animation (ms)
            useNativeDriver: true, // Sử dụng Native Driver cho hiệu suất tốt hơn
        }).start();
    }, [menuData.displayNote]);


    return (
        <Animated.View
            style={{
                transform: [{ translateX }],
                position: 'absolute',
                height: '100%',
                width: '100%', // Sử dụng chiều rộng của màn hình
                backgroundColor: 'white',
                zIndex: 3,
                top: 0,
                flexDirection: 'column',
                // alignItems: 'center',
                gap: 20,
                right: 0,
            }}
        >
            <View style={{ position: 'absolute', right: 15, top: 30 }}>
                <TouchableOpacity onPress={() => menuHandler.setDisplayNote(false)}>
                    <Icon name="x" style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', paddingHorizontal: 10, paddingTop: 20, gap: 10 }}>
                <Text style={{ width: '100%', fontSize: 18, fontWeight: 600 }}>Ghi Chú Tại {convertSecondsToTimeFormat(payloadData.time)}</Text>
                <TextInput
                    value={note}
                    onChangeText={e => setNote(e)}
                    placeholder="Thêm bình luận..."
                    multiline={true}  // Kích hoạt chế độ nhiều dòng
                    numberOfLines={4} // Số dòng hiển thị mặc định
                    style={{
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        width: '100%',
                        height: '85%', // Chiều cao lớn hơn để giống textarea
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: '#d0d3d4',
                        textAlignVertical: 'top' // Căn chỉnh văn bản từ đầu
                    }}
                />
                <TouchableOpacity onPress={() => {
                    handleSubmitNote()
                }} style={{ backgroundColor: '#149dff', width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                    <Text style={{ color: 'white', fontSize: 17 }}>Thêm Ghi Chú</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}

export default FormNote