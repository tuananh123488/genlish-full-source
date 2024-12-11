import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { menuContext } from '../../contexts/MenuContext';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Image } from 'react-native';
import { userContext } from '../../contexts/UserContext';
import Step1 from '../stepSignUp/Step1';
import { payloadContext } from '../../contexts/PayloadContext';
import Step2 from '../stepSignUp/Step2';
import Step3 from '../stepSignUp/Step3';
import Step4 from '../stepSignUp/Step4';
import Step5 from '../stepSignUp/Step5';
import Step6 from '../stepSignUp/Step6';
import Step7 from '../stepSignUp/Step7';
import { api, TypeHTTP } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifyType, utilsContext } from '../../contexts/UtilsContext';

const SignUpForm = () => {
    const { menuData, menuHandler } = useContext(menuContext);
    const { userData } = useContext(userContext)
    const { utilsHandler } = useContext(utilsContext)
    const { payloadData, payloadHandler } = useContext(payloadContext)
    const { width } = Dimensions.get('window');
    const [translateX] = useState(new Animated.Value(menuData.displaySignUp === true ? 0 : width));
    const scrollViewRef = useRef(null);

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: menuData.displaySignUp === true ? 0 : width,
            duration: 300, // Thời gian animation (ms)
            useNativeDriver: true, // Sử dụng Native Driver cho hiệu suất tốt hơn
        }).start();
    }, [menuData.displaySignUp]);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: payloadData.currentStepSignUp * width, animated: true });
        }
    }, [payloadData.currentStepSignUp])

    useEffect(() => {
        if (payloadData.currentStepSignUp === 7) {
            api({ type: TypeHTTP.POST, path: '/auth/generate-token', sendToken: false, body: { id: userData.user?._id } })
                .then(async (tokens) => {
                    await AsyncStorage.setItem('accessToken', tokens.accessToken)
                    await AsyncStorage.setItem('refreshToken', tokens.refreshToken)
                    menuHandler.setDisplaySignUp(false)
                    utilsHandler.notify(notifyType.SUCCESS, 'Đã hoàn tất đăng ký')

                })
        }
    }, [payloadData.currentStepSignUp])


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
                <TouchableOpacity onPress={() => menuHandler.setDisplaySignUp(false)}>
                    <Icon name="x" style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                style={{ flexDirection: 'row' }}
                scrollEnabled={false}
            >
                {/*step 1*/}
                <Step1 />
                <Step2 />
                <Step3 />
                <Step4 />
                <Step5 />
                <Step6 />
                <Step7 />
                {/*step 1*/}
            </ScrollView>
        </Animated.View>
    )
}

export default SignUpForm