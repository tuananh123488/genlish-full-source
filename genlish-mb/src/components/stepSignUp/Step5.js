import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { api, TypeHTTP } from '../../utils/api'
import { userContext } from '../../contexts/UserContext';
import { notifyType, utilsContext } from '../../contexts/UtilsContext';
import { payloadContext } from '../../contexts/PayloadContext';
import { SvgUri } from 'react-native-svg';

const Step5 = () => {
    const { width } = Dimensions.get('window');
    const { userHandler, userData } = useContext(userContext)
    const { utilsHandler } = useContext(utilsContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const buttonLabels = [
        'Tôi mới học tiếng anh',
        'Tôi mới hiểu sơ qua',
        'Tôi có thể giao tiếp cơ bản',
        'Tôi có thể nói về các chủ đề',
        'Tôi có thể thảo luận được chủ đề'
    ];


    const handleCompleteStep5 = (currentEnglishLevel) => {
        api({
            sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: {
                ...userData.user, individual: {
                    ...userData.user.individual,
                    currentEnglishLevel
                },
                statusSignUp: 5
            }
        })
            .then(user => {
                userHandler.setUser(user)
                payloadHandler.setCurrentStepSignUp(5)
            })
    }

    return (
        <View style={{ width, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Image source={LogoImage} style={{ width: 50, height: 80 }} />
            <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, paddingHorizontal: 30, textAlign: 'center' }}>Trình độ tiếng anh của bạn ở mức nào?</Text>
            {buttonLabels.map((item, index) => (
                <TouchableOpacity onPress={() => handleCompleteStep5(item)} key={index} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 20, width: '80%', marginTop: 10, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }}>
                    <Text style={{ fontSize: 16, fontWeight: 400 }}>{item}</Text>
                </TouchableOpacity>
            ))}
            {/* {list.length > 0 && (
                <TouchableOpacity onPress={() => handleCompleteStep4()} style={{ backgroundColor: '#149dff', marginTop: 10, width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                    <Text style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>Bước Tiếp Theo</Text>
                </TouchableOpacity>
            )} */}
        </View>
    )
}

export default Step5