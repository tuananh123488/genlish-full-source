// MenuArea.js
import React, { useContext, useEffect, useState } from 'react';
import { Animated, Dimensions, View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon6 from 'react-native-vector-icons/FontAwesome';
import Icon7 from 'react-native-vector-icons/MaterialIcons';
import Icon8 from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { menuContext } from '../contexts/MenuContext';
import { userContext } from '../contexts/UserContext';
import { screenContext } from '../contexts/ScreenContext';
import { notifyType, utilsContext } from '../contexts/UtilsContext';
import Course from '../../assets/course-menu.png'
import Book from '../../assets/book-menu.png'
import Glass from '../../assets/glass-menu.png'
import Radio from '../../assets/radio-menu.png'
import Com from '../../assets/com-menu.png'
import Person from '../../assets/person-menu.png'
import Logout from '../../assets/logout-menu.png'


const MenuArea = () => {
    const { menuData, menuHandler } = useContext(menuContext);
    const { userData, userHandler } = useContext(userContext)
    const { screenHandler } = useContext(screenContext)
    const { utilsHandler } = useContext(utilsContext)
    const { width } = Dimensions.get('window'); // Lấy chiều rộng của màn hình
    const [translateX] = useState(new Animated.Value(menuData.display === true ? 0 : width));

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: menuData.display === true ? 0 : width,
            duration: 300, // Thời gian animation (ms)
            useNativeDriver: true, // Sử dụng Native Driver cho hiệu suất tốt hơn
        }).start();
    }, [menuData.display]);

    const openURLAi = () => {
        const url = `https://genlish.vercel.app/ai-public/${userData.user?._id}`; // URL bạn muốn mở
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    const navigate = (goal) => {
        menuHandler.setDisplay(false)
        screenHandler.navigate(goal)
    }

    const handleLogout = async () => {
        await AsyncStorage.removeItem('accessToken')
        await AsyncStorage.removeItem('refreshToken')
        userHandler.setUser()
        menuHandler.setDisplay(false)
        utilsHandler.notify(notifyType.SUCCESS, 'Đăng Xuất Thành Công')
        screenHandler.navigate('landing')
    }

    return (
        <Animated.View
            style={{
                transform: [{ translateX }],
                position: 'absolute',
                height: '100%',
                width: '80%', // Sử dụng chiều rộng của màn hình
                backgroundColor: 'white',
                zIndex: 2,
                top: 0,
                flexDirection: 'column',
                gap: 20,
                right: 0,
                paddingTop: 20,
                paddingLeft: 25,
                paddingRight: 10
            }}
        >
            <TouchableOpacity onPress={() => menuHandler.setDisplay(false)}>
                <Icon name="x" style={{ fontSize: 30, position: 'absolute', right: 10, top: 10 }} />
            </TouchableOpacity>

            {userData.user && (
                <>
                    <TouchableOpacity onPress={() => navigate('profile')} style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', gap: 7, width: '90%' }}>
                        <Image source={{ uri: userData.user.avatar }} style={{ height: 46, width: 46, borderRadius: 23 }} />
                        <Text style={{ fontSize: 20, fontWeight: 600 }}>{userData.user.fullName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('course')} style={{ width: '100%', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Course} style={{ height: 30, width: 30 }} />
                        <Text style={{ fontSize: 17 }}>Các Khóa Học</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('learn')} style={{ width: '100%', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Book} style={{ height: 30, width: 30 }} />
                        <Text style={{ fontSize: 17 }}>Học Từ Vựng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('search')} style={{ width: '100%', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Glass} style={{ height: 30, width: 30 }} />
                        <Text style={{ fontSize: 17 }}>Tra Từ Vựng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('broadcast')} style={{ width: '100%', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Radio} style={{ height: 30, width: 30 }} />
                        <Text style={{ fontSize: 17 }}>Broadcast</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        openURLAi()
                    }} style={{ width: '100%', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Com} style={{ height: 30, width: 30 }} />
                        <Text style={{ fontSize: 17 }}>Giao Tiếp AI</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('record')} style={{ width: '100%', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Person} style={{ height: 30, width: 30 }} />
                        <Text style={{ fontSize: 17 }}>Hồ Sơ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLogout()} style={{ width: '100%', gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Logout} style={{ height: 30, width: 30 }} />
                        <Text style={{ fontSize: 17 }}>Đăng Xuất</Text>
                    </TouchableOpacity>
                </>
            )}
        </Animated.View>
    );
};

export default MenuArea;
