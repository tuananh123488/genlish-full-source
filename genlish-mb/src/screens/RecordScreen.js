import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, ImageBackground, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { menuContext } from '../contexts/MenuContext';
import { payloadContext } from '../contexts/PayloadContext';
import { userContext } from '../contexts/UserContext';
import { RadioButton } from '../components/stepSignUp/Step3';
import { api, TypeHTTP } from '../utils/api';
import { notifyType, utilsContext } from '../contexts/UtilsContext';
import Icon from 'react-native-vector-icons/AntDesign';
import { formatDateTime } from '../utils/time';
const RecordScreen = () => {
    const { width, height } = Dimensions.get('window');
    const { menuHandler } = useContext(menuContext)
    const { payloadHandler } = useContext(payloadContext)
    const { utilsHandler } = useContext(utilsContext)
    const { userData, userHandler } = useContext(userContext)
    const [user, setUser] = useState()
    const [currentScreen, setCurrentScreen] = useState(0)
    const [payments, setPayments] = useState([])

    useEffect(() => {
        if (userData.user) {
            setUser(userData.user)
        }
    }, [userData.user])

    const handleSelect = (value) => {
        setUser({ ...user, gender: Boolean(value) })
    };

    const handleUpdateUser = () => {
        api({ path: '/user/update', body: user, type: TypeHTTP.POST, sendToken: true }).then(res => {
            utilsHandler.notify(notifyType.SUCCESS, 'Update thành công')
            userHandler.setUser(res)
        })
    }

    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (scrollViewRef.current) {
            console.log(currentScreen)
            scrollViewRef.current.scrollTo({ x: currentScreen * width, animated: true });
        }
    }, [currentScreen])

    useEffect(() => {
        if (currentScreen === 1 && userData.user) {
            api({ type: TypeHTTP.GET, path: `/payment/get-by-customer/${userData.user._id}`, sendToken: true })
                .then(payments => {
                    setPayments(payments)
                })
        }
    }, [currentScreen])

    return (
        <ScrollView>
            {/* {screenData.currentScreen === 1 && ( */}
            <View style={{ width, height: height - 70, gap: 10 }}>
                <View style={{ width: '100%', flexDirection: 'row', height: '100%' }}>
                    <ScrollView scrollEnabled={false} horizontal ref={scrollViewRef} style={{ flexDirection: 'row' }}>
                        <View style={{ width, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
                            <Image source={{ uri: userData.user?.avatar }} style={{ height: 150, width: 150, borderRadius: 150 }} />
                            <TextInput value={user?.phone} onChangeText={e => setUser({ ...user, phone: e })} placeholder='Số Điện Thoại' style={{ paddingHorizontal: 20, width: '80%', height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
                            <TextInput value={user?.fullName} onChangeText={e => setUser({ ...user, fullName: e })} placeholder='Họ Và Tên' style={{ paddingHorizontal: 20, width: '80%', height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
                            <TextInput value={user?.address} onChangeText={e => setUser({ ...user, address: e })} placeholder='Địa Chỉ' style={{ paddingHorizontal: 20, width: '80%', height: 50, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
                            <View style={{ flexDirection: 'row', gap: 10, height: 50, justifyContent: 'flex-start', width: '80%' }}>
                                <RadioButton
                                    label="Nam"
                                    value={true}
                                    selected={user?.gender === true}
                                    onSelect={handleSelect}
                                />
                                <RadioButton
                                    label="Nữ"
                                    value={false}
                                    selected={user?.gender === false}
                                    onSelect={handleSelect}
                                />
                            </View>
                            <TouchableOpacity onPress={() => handleUpdateUser()} style={{ marginTop: 10, backgroundColor: '#241d49', width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                                <Text style={{ color: 'white', fontSize: 17 }}>Cập nhật thông tin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => menuHandler.setDisplayChangePassword(true)} style={{ backgroundColor: '#5dade2', width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                                <Text style={{ color: 'white', fontSize: 17 }}>Đổi mật khẩu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setCurrentScreen(1)} style={{ backgroundColor: '#5dade2', width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                                <Text style={{ color: 'white', fontSize: 17 }}>Lịch sử thanh toán</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative', paddingTop: 50 }}>
                            <TouchableOpacity onPress={() => setCurrentScreen(0)} style={{ position: 'absolute', top: 10, left: 20, flexDirection: 'row', gap: 10 }}>
                                <Icon name="arrowleft" style={{ fontSize: 30 }} />
                                <Text style={{ fontSize: 17, fontWeight: 500 }}>Quay Lại</Text>
                            </TouchableOpacity>
                            <ScrollView>
                                <View style={{ flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                                    {payments.map((payment, index) => (
                                        <View key={index} style={{ marginBottom: 5, padding: 10, borderRadius: 10, flexDirection: 'column', width: '95%', backgroundColor: '#f3f3f3' }}>
                                            <Text style={{ fontSize: 16, fontWeight: 500, width: '100%' }}>Thụ hưởng: 37731017-THAIQUANGBAO</Text>
                                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                                <Text style={{ fontSize: 16, fontWeight: 500 }}>Nội dung:</Text>
                                                <Text style={{ fontSize: 15, fontWeight: 400, width: '80%' }}>{payment.paymentInfo}</Text>
                                            </View>
                                            <Text style={{ fontSize: 16, fontWeight: 400, width: '80%' }}>Thời gian: {formatDateTime(payment.createdAt)}</Text>
                                        </View>
                                    ))}

                                </View>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>
            </View>
            {/* )} */}
        </ScrollView>
    )
}

export default RecordScreen