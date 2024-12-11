import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LogoImage from '../../../assets/logo.png'
import { api, TypeHTTP } from '../../utils/api'
import { userContext } from '../../contexts/UserContext';
import { notifyType, utilsContext } from '../../contexts/UtilsContext';
import { payloadContext } from '../../contexts/PayloadContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const Step3 = () => {
    const { width } = Dimensions.get('window');
    const { userHandler, userData } = useContext(userContext)
    const { utilsHandler } = useContext(utilsContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [info, setInfo] = useState({
        fullName: '',
        dob: new Date(),
        gender: null,
        address: ''
    })

    const handleCompleteStep3 = () => {
        if (info.fullName === '' || info.address === '' || info.gender === null || info.dob === null) {
            utilsHandler.notify(notifyType.WARNING, 'Không được để trống')
            return
        }
        const nameRegex = /^[A-Za-zÀ-ÿ\s]{2,}$/;
        if (!nameRegex.test(info.fullName)) {
            utilsHandler.notify(notifyType.WARNING, 'Họ tên không hợp lệ');
            return;
        }

        const addressRegex = /^[A-Za-z0-9À-ÿ\s,.-]{5,}$/;
        if (!addressRegex.test(info.address)) {
            utilsHandler.notify(notifyType.WARNING, 'Địa chỉ không hợp lệ');
            return;
        }
        api({ sendToken: false, type: TypeHTTP.POST, path: '/auth/sign-up-step-other', body: { ...userData.user, statusSignUp: 3, fullName: info.fullName, dob: info.dob, address: info.address, gender: info.gender } })
            .then(user => {
                userHandler.setUser(user)
                payloadHandler.setCurrentStepSignUp(3)
            })
            .catch(error => {
                utilsHandler.notify(notifyType.FAIL, error.message)
            })
    }

    const handleSelect = (value) => {
        setInfo({ ...info, gender: Boolean(value) })
    };

    return (
        <View style={{ width, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>

            {showPicker && (
                <View style={{ flexDirection: 'column', alignItems: 'center', position: 'absolute', backgroundColor: 'white', left: 50, zIndex: 50, borderRadius: 30 }}>
                    <DateTimePicker
                        mode="date"
                        display="spinner"
                        value={date}
                        onChange={({ type }, selectedDate) => {
                            if (type === "set") {
                                setInfo({ ...info, dob: selectedDate })
                                if (Platform.OS === 'android') {
                                    setInfo({ ...info, dob: selectedDate })
                                    setShowPicker(false)
                                }
                            } else {
                                setShowPicker(false)
                            }
                        }}
                    />
                    {Platform.OS === 'ios' && (
                        <View style={{ paddingVertical: 10, flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setShowPicker(false)}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            <Image source={LogoImage} style={{ width: 50, height: 80 }} />
            <Text style={{ fontSize: 18, fontWeight: 600, paddingHorizontal: 30, textAlign: 'center' }}>Hãy bổ sung thông tin cá nhân của bạn nhé</Text>
            <TextInput value={info.fullName} onChangeText={e => setInfo({ ...info, fullName: e })} placeholder='Họ Và Tên' style={{ paddingHorizontal: 20, width: '80%', marginTop: 20, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
            <TouchableOpacity style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, fontSize: 16, backgroundColor: 'white', borderRadius: 7, width: '80%', borderColor: '#bbb', height: 50, borderWidth: 1 }} onPress={() => setShowPicker(true)}>
                <Text style={{ color: '#999' }}>
                    {info.dob.getDate() + "/" + (info.dob.getMonth() + 1) + "/" + info.dob.getFullYear()}
                </Text>
            </TouchableOpacity>
            <TextInput value={info.address} onChangeText={e => setInfo({ ...info, address: e })} placeholder='Địa Chỉ' style={{ paddingHorizontal: 20, width: '80%', marginTop: 10, height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
            <View style={{ flexDirection: 'row', gap: 10, height: 50, marginTop: 10, justifyContent: 'flex-start', width: '80%' }}>
                <RadioButton
                    label="Nam"
                    value={true}
                    selected={info.gender === true}
                    onSelect={handleSelect}
                />
                <RadioButton
                    label="Nữ"
                    value={false}
                    selected={info.gender === false}
                    onSelect={handleSelect}
                />
            </View>
            <TouchableOpacity onPress={() => handleCompleteStep3()} style={{ backgroundColor: '#149dff', marginTop: 10, width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 17, fontWeight: 600 }}>Bước Tiếp Theo</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Step3

export const RadioButton = ({ label, value, selected, onSelect }) => {
    return (
        <TouchableOpacity onPress={() => onSelect(value)} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <View
                style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selected ? '#2ecc71' : '#ccc',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {selected ? (
                    <View style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: '#2ecc71',
                    }} />
                ) : null}
            </View>
            <Text style={{ marginLeft: 10, color: 'black', fontFamily: 'Nunito-S' }}>{label}</Text>
        </TouchableOpacity>
    );
};