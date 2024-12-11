import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { api, TypeHTTP } from '../../utils/api'
import { userContext } from '../../contexts/UserContext';
import { notifyType, utilsContext } from '../../contexts/UtilsContext';
import { payloadContext } from '../../contexts/PayloadContext';
import { SvgUri } from 'react-native-svg';

const Step6 = () => {
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


    const handleCompleteStep6 = () => {
        api({ sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: { ...userData.user, statusSignUp: 6 } })
            .then(user => {
                userHandler.setUser(user)
                payloadHandler.setCurrentStepSignUp(6)
            })
    }

    return (
        <View style={{ width, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Image source={LogoImage} style={{ width: 50, height: 80 }} />
            <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, paddingHorizontal: 30, textAlign: 'center' }}>Thành quả sau khi học tiếng anh của GenLish</Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 20, width: '80%', marginTop: 10, height: 90, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }}>
                <SvgUri
                    width="50"
                    height="50"
                    uri='https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/958e9a5aac8a0aeb099e08c28e327de7.svg'
                />
                <View style={{ flexDirection: 'column', gap: 2, width: '90%' }}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Tự tin giao tiếp</Text>
                    <Text style={{ fontSize: 14, fontWeight: 400 }}>32.700+ bài học đa tương tác và không hề áp lực</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 20, width: '80%', marginTop: 10, height: 90, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }}>
                <SvgUri
                    width="50"
                    height="50"
                    uri='https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/bc1008ae41c90c9b1a6f63bb9e142f7f.svg'
                />
                <View style={{ flexDirection: 'column', gap: 2, width: '90%' }}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Kho từ vựng đa dạng</Text>
                    <Text style={{ fontSize: 14, fontWeight: 400 }}>1.900+ từ và cụm từ thiết thực</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 20, width: '80%', marginTop: 10, height: 90, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }}>
                <SvgUri
                    width="50"
                    height="50"
                    uri='https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/3757137c3beb1fbf0bfe21fdf9254023.svg'
                />
                <View style={{ flexDirection: 'column', gap: 2, width: '90%' }}>
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Tạo thói quen học tập</Text>
                    <Text style={{ fontSize: 14, fontWeight: 400 }}>Nhắc nhở thông minh, thử thách vui nhộn và còn nhiều tính năng thú vị khác</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleCompleteStep6()} style={{ backgroundColor: '#149dff', marginTop: 10, width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>Bước Tiếp Theo</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Step6