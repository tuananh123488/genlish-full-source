import React, { useContext, useEffect, useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { menuContext } from '../../contexts/MenuContext';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import { payloadContext } from '../../contexts/PayloadContext';
import { convertSecondsToTimeFormat } from '../../utils/time';

const ListEpisode = () => {
    const { menuData, menuHandler } = useContext(menuContext);
    const { width } = Dimensions.get('window');
    const [translateX] = useState(new Animated.Value(menuData.displayListEpisode === true ? 0 : width));
    const { payloadData, payloadHandler } = useContext(payloadContext)

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: menuData.displayListEpisode === true ? 0 : width,
            duration: 300, // Thời gian animation (ms)
            useNativeDriver: true, // Sử dụng Native Driver cho hiệu suất tốt hơn
        }).start();
    }, [menuData.displayListEpisode]);


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
            <View style={{ position: 'absolute', right: 15, top: 30, zIndex: 1 }}>
                <TouchableOpacity onPress={() => menuHandler.setDisplayListEpisode(false)}>
                    <Icon name="x" style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', paddingHorizontal: 10, paddingTop: 20 }}>
                <Text style={{ width: '100%', fontSize: 20, fontWeight: '600' }}>Nội Dung Khóa Học</Text>
                {payloadData.course && (
                    <View style={{ flexDirection: 'column', gap: 10, marginTop: 10 }}>
                        {payloadData.course.list_course.map((item, index) => (
                            <TouchableOpacity
                                onPress={() => {
                                    if (index <= payloadData.currentIndex - 1) {
                                        payloadHandler.setCurrentEpisode(index + 1)
                                        menuHandler.setDisplayListEpisode(false)
                                    }
                                }}
                                style={index === payloadData.currentEpisode - 1 ? { backgroundColor: '#ebf5fb', borderRadius: 7 } : {}}
                                key={index}
                            >
                                <View style={{ flexDirection: 'row', gap: 2, paddingHorizontal: 10, paddingVertical: 7 }}>
                                    {index <= payloadData.currentIndex - 1 ? (
                                        <Text style={{ fontSize: 16, color: '#3f3f3f', fontWeight: '500', textAlign: 'center', width: '7%' }}>{index + 1}.</Text>
                                    ) : (
                                        <Icon1 name='lock' style={{ fontSize: 25, color: '#3f3f3f', fontWeight: '500', }} />
                                    )}
                                    <View style={{ color: index <= payloadData.currentIndex - 1 ? '#3f3f3f' : '#909497', flexDirection: 'column', gap: 1, width: '90%', borderRadius: 7 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '500' }}>{item.title}</Text>
                                        <Text style={{ fontSize: 12 }}>{convertSecondsToTimeFormat(item.duration)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </Animated.View>
    )
}

export default ListEpisode