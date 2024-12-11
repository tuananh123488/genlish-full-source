import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { api, TypeHTTP } from '../../utils/api'
import { userContext } from '../../contexts/UserContext';
import { notifyType, utilsContext } from '../../contexts/UtilsContext';
import { payloadContext } from '../../contexts/PayloadContext';
import { SvgUri } from 'react-native-svg';
import { screenContext } from '../../contexts/ScreenContext';
import { menuContext } from '../../contexts/MenuContext';

const Step7 = () => {
    const { width } = Dimensions.get('window');
    const { userHandler, userData } = useContext(userContext)
    const { screenHandler } = useContext(screenContext)
    const { utilsHandler } = useContext(utilsContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const { menuHandler } = useContext(menuContext)
    const timeOptions = [
        '5 phút / 1 ngày',
        '10 phút / 1 ngày',
        '15 phút / 1 ngày',
        '20 phút / 1 ngày'
    ];


    const handleCompleteStep7 = (englishLearningTimeInOneDay) => {
        api({
            sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: {
                ...userData.user, individual: {
                    ...userData.user.individual,
                    englishLearningTimeInOneDay
                },
                statusSignUp: 7
            }
        })
            .then(user => {
                userHandler.setUser()
                payloadHandler.setCurrentStepSignUp()
                menuHandler.setDisplaySignUp(false)
                screenHandler.navigate("landing")
                utilsHandler.notify(notifyType.SUCCESS, 'Đăng Ký Thành Công')
            })


    }

    return (
        <View style={{ width, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Image source={LogoImage} style={{ width: 50, height: 80 }} />
            <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, paddingHorizontal: 30, textAlign: 'center' }}>Thời gian học một ngày</Text>
            {timeOptions.map((item, index) => (
                <TouchableOpacity onPress={() => handleCompleteStep7(item)} key={index} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 20, width: '80%', marginTop: 10, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }}>
                    <Text style={{ fontSize: 16, fontWeight: 400 }}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default Step7