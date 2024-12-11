import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { api, TypeHTTP } from '../../utils/api'
import { userContext } from '../../contexts/UserContext';
import { notifyType, utilsContext } from '../../contexts/UtilsContext';
import { payloadContext } from '../../contexts/PayloadContext';
import { SvgUri } from 'react-native-svg';

const Step4 = () => {
    const { width } = Dimensions.get('window');
    const { userHandler, userData } = useContext(userContext)
    const { utilsHandler } = useContext(utilsContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const [list, setList] = useState([])

    const whys = [
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/ab81d610a8a79f174a4db0a6085e7e2c.svg",
            title: 'Giải trí'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/484f1c9610935dd40094a9f7cf06e009.svg",
            title: 'Kết nối tới mọi người'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/61a06f02b3b988d1c388d484bc0e52e6.svg",
            title: 'Phát triển sự nghiệp'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/d7315c6c7bbeba67df5ebda771d33da1.svg",
            title: 'Hỗ trợ việc học'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/5bbfb55fd21e21012a228bcef29bb557.svg",
            title: 'Hỗ trợ đi du lịch'
        },
        {
            image: "https://d35aaqx5ub95lt.cloudfront.net/images/funboarding/0e2332e8d4074ed5db4ca9152ffd0d25.svg",
            title: 'Khác'
        }]

    const handleCompleteStep4 = () => {
        if (list.length === 0) {
            return
        }
        api({
            sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: {
                ...userData.user, individual: {
                    reasonToLearnEnglish: list.map(item => whys[item].title)
                },
                statusSignUp: 4
            }
        })
            .then(user => {
                userHandler.setUser(user)
                payloadHandler.setCurrentStepSignUp(4)
            })
            .catch(error => {
                utilsHandler.notify(notifyType.FAIL, error.message)
            })
    }

    return (
        <View style={{ width, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Image source={LogoImage} style={{ width: 50, height: 80 }} />
            <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, paddingHorizontal: 30, textAlign: 'center' }}>Tại sao bạn lại học tiếng anh?</Text>
            {whys.map((item, index) => (
                <TouchableOpacity onPress={() => list.includes(index) ? setList(prev => prev.filter(item => item !== index)) : setList(prev => [...prev, index])} key={index} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 20, width: '80%', marginTop: 10, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }}>
                    <SvgUri
                        width="30"
                        height="30"
                        uri={item.image}
                    />
                    <Text style={{ fontSize: 16, fontWeight: list.includes(index) ? 'bold' : 400 }}>{item.title}</Text>
                </TouchableOpacity>
            ))}
            {list.length > 0 && (
                <TouchableOpacity onPress={() => handleCompleteStep4()} style={{ backgroundColor: '#149dff', marginTop: 10, width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                    <Text style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>Bước Tiếp Theo</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default Step4