import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { api, TypeHTTP } from '../../utils/api'
import { userContext } from '../../contexts/UserContext';
import { notifyType, utilsContext } from '../../contexts/UtilsContext';
import { payloadContext } from '../../contexts/PayloadContext';

const Step2 = () => {
    const { width } = Dimensions.get('window');
    const { userHandler, userData } = useContext(userContext)
    const { utilsHandler } = useContext(utilsContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const [code, setCode] = useState('')

    const handleCompleteStep2 = () => {
        api({ sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: { ...userData.user, statusSignUp: 2 } })
            .then(user => {
                utilsHandler.notify(notifyType.SUCCESS, 'Xác thực thành công')
                userHandler.setUser(user)
                payloadHandler.setCurrentStepSignUp(2)
            })
            .catch(error => {
                utilsHandler.notify(notifyType.FAIL, error.message)
            })
    }

    return (
        <View style={{ width, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Image source={LogoImage} style={{ width: 50, height: 80 }} />
            <Text style={{ fontSize: 18, fontWeight: 600, paddingHorizontal: 30, textAlign: 'center' }}>Hãy xác thực số điện thoại của bạn</Text>
            <TextInput value={code} onChangeText={e => setCode(e)} placeholder='Mã Xác Thực' style={{ paddingHorizontal: 20, width: '80%', marginTop: 20, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
            <TouchableOpacity onPress={() => handleCompleteStep2()} style={{ backgroundColor: '#149dff', marginTop: 10, width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>Bước Tiếp Theo</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Step2