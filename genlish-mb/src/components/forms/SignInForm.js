import React, { useContext, useEffect, useState } from 'react'
import { Animated, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { menuContext } from '../../contexts/MenuContext';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LogoImage from '../../../assets/logo.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userContext } from '../../contexts/UserContext';
import { payloadContext } from '../../contexts/PayloadContext';
import { notifyType, utilsContext } from '../../contexts/UtilsContext';
import { api, TypeHTTP } from '../../utils/api';
import { screenContext } from '../../contexts/ScreenContext';

const SignInForm = () => {
    const { menuData, menuHandler } = useContext(menuContext);
    const { width } = Dimensions.get('window');
    const { userHandler } = useContext(userContext)
    const { screenHandler } = useContext(screenContext)
    const { payloadHandler } = useContext(payloadContext)
    const { utilsHandler } = useContext(utilsContext)
    const [translateX] = useState(new Animated.Value(menuData.displaySignIn === true ? 0 : width));
    const [info, setInfo] = useState({
        phone: '',
        password: ''
    })

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: menuData.displaySignIn === true ? 0 : width,
            duration: 300, // Thời gian animation (ms)
            useNativeDriver: true, // Sử dụng Native Driver cho hiệu suất tốt hơn
        }).start();
    }, [menuData.displaySignIn]);


    const handleSignIn = () => {

        if (info.phone === '' || info.password === '') {
            utilsHandler.notify(notifyType.FAIL, 'Vui lòng không  để trống')
            return
        }
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

        if (!phoneRegex.test(info.phone)) {
            utilsHandler.notify(notifyType.WARNING, 'Số điện thoại không hợp lệ');
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(info.password)) {
            utilsHandler.notify(notifyType.WARNING, 'Mật khẩu không hợp lệ. Mật khẩu ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số');
            return;
        }
        api({ type: TypeHTTP.POST, body: { phone: info.phone, password: info.password }, sendToken: false, path: '/auth/sign-in' })
            .then(async (res) => {
                await AsyncStorage.setItem('accessToken', res.tokens.accessToken)
                await AsyncStorage.setItem('refreshToken', res.tokens.refreshToken)
                userHandler.setUser(res.user)
                if (res.user.statusSignUp === 7) {
                    menuHandler.setDisplaySignIn(false)
                    screenHandler.navigate('course')
                } else {
                    menuHandler.setDisplaySignIn(false)
                    menuHandler.setDisplaySignUp(true)
                    payloadHandler.setCurrentStepSignUp(res.user.statusSignUp)
                }
                setTimeout(() => {
                    if (res.user.statusSignUp === 7) {
                        setInfo(prevState => ({
                            ...prevState,
                            phone: ""
                        }));
                        setInfo(prevState => ({
                            ...prevState,
                            password: ""
                        }));
                    } else {
                        utilsHandler.notify(notifyType.WARNING, 'Hãy hoàn thành thông tin của bạn')
                    }
                }, (1000));
            })
            .catch(error => {
                utilsHandler.notify(notifyType.FAIL, error.message)
            })
    }


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
                <TouchableOpacity onPress={() => menuHandler.setDisplaySignIn(false)}>
                    <Icon name="x" style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Image source={LogoImage} style={{ width: 50, height: 80 }} />
                <Text style={{ fontSize: 22, fontWeight: 700 }}>Đăng Nhập Vào GenLish</Text>
                <TextInput value={info.phone} onChangeText={e => setInfo({ ...info, phone: e })} placeholder='Số Điện Thoại' style={{ paddingHorizontal: 20, width: '80%', marginTop: 20, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
                <TextInput value={info.password} onChangeText={e => setInfo({ ...info, password: e })} secureTextEntry={true} placeholder='Mật Khẩu' style={{ paddingHorizontal: 20, width: '80%', height: 50, marginTop: 10, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
                <TouchableOpacity onPress={() => handleSignIn()} style={{ marginTop: 10, backgroundColor: '#241d49', width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                    <Text style={{ color: 'white', fontSize: 17 }}>Đăng Nhập</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 10, width: '80%', gap: 5, flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                    <Text style={{ fontSize: 15 }}>Chưa có tài khoản?</Text>
                    <TouchableOpacity onPress={() => {
                        menuHandler.setDisplaySignIn(false)
                        menuHandler.setDisplaySignUp(true)
                    }}>
                        <Text style={{ fontSize: 15, fontWeight: 600 }}>Đăng Ký</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    )
}

export default SignInForm