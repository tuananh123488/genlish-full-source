import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { menuContext } from '../contexts/MenuContext';
import { payloadContext } from '../contexts/PayloadContext';
import { userContext } from '../contexts/UserContext';
import { screenContext } from '../contexts/ScreenContext';
import { formatMoney, typePayments } from '../utils/other';
import { api, TypeHTTP } from '../utils/api';
import { notifyType, utilsContext } from '../contexts/UtilsContext';

const PaymentScreen = () => {
    const { width } = Dimensions.get('window');
    const { menuHandler } = useContext(menuContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const { userData } = useContext(userContext)
    const { screenData, screenHandler } = useContext(screenContext)
    const [url, setUrl] = useState('')
    const paymentRef = useRef()
    const { utilsHandler } = useContext(utilsContext)

    useEffect(() => {
        if (payloadData.currentCourse && userData.user) {
            setUrl(`https://qr.sepay.vn/img?bank=MBBank&acc=9908080899&&template=compact&amount=${'2000'}&des=MaKH${userData.user?._id}MaCourse${payloadData.currentCourse._id}THANHTOAN`)
        }
    }, [payloadData.currentCourse])

    useEffect(() => {
        if (screenData.currentScreen === 3 && payloadData.currentCourse) {
            console.log(111)
            paymentRef.current = setInterval(() => {
                api({ type: TypeHTTP.POST, body: { course_id: payloadData.currentCourse._id, user_id: userData.user._id }, path: '/payment/check_payment', sendToken: false })
                    .then(res => {
                        if (res) {
                            const startInfo = res.paymentInfo.indexOf("CT") + 2;
                            const bodyPayment = {
                                course: {
                                    _id: payloadData.currentCourse._id,
                                    name: payloadData.currentCourse.title,
                                    numberOfEpisode: payloadData.currentCourse.list_course.length,
                                    image: payloadData.currentCourse.image
                                },
                                price: payloadData.currentCourse.price,
                                customer: {
                                    _id: userData.user._id,
                                    fullName: userData.user.fullName,
                                    avatar: userData.user.avatar
                                },
                                provider: payloadData.currentCourse.teacher,
                                paymentInfo: res.paymentInfo.substring(startInfo, res.paymentInfo.length) + ` chuyen tien khoa hoc ${payloadData.currentCourse.title} - gia ${payloadData.currentCourse.price}`,
                                type: typePayments.studentTranfer
                            }
                            api({ sendToken: true, type: TypeHTTP.POST, body: { id: res._id, payment: bodyPayment }, path: '/payment/update' })
                                .then(res => {
                                    const body = {
                                        student_id: userData.user._id,
                                        course_id: payloadData.currentCourse._id,
                                        process: 1
                                    }
                                    api({ sendToken: true, type: TypeHTTP.POST, body, path: '/studycourse/create' })
                                        .then(res => {
                                            utilsHandler.notify(notifyType.SUCCESS, 'Thanh Toán Thành Công')
                                            payloadHandler.setStudyCourse(res)
                                            screenHandler.navigate('course-detail')
                                        })
                                })
                        }
                    })
            }, 2000);
        } else {
            clearInterval(paymentRef.current)
        }
        return () => clearInterval(paymentRef.current);
    }, [screenData.currentScreen])

    return (
        <ScrollView>
            <View style={{ flexWrap: 'wrap', flexDirection: 'column', width, gap: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
                {screenData.currentScreen === 3 && (
                    <>
                        <Text style={{ fontSize: 22, fontWeight: 600 }}>Thanh Toán Khóa Học</Text>
                        <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', gap: 5, height: 600, justifyContent: 'center' }}>
                            <Image source={{ uri: url }} style={{ width: 200, height: 200 }} />
                            <Text style={{ fontSize: 16, fontWeight: 400 }}>Tên chủ TK: LE XUAN TUAN ANH</Text>
                            <Text style={{ fontSize: 16, fontWeight: 400 }}>Số TK: 9908080899</Text>
                            <Text style={{ fontSize: 16, fontWeight: 400 }}>Khóa Học {payloadData.currentCourse?.title} - {formatMoney(payloadData.currentCourse?.price)}đ</Text>
                            <Text style={{ fontSize: 15, paddingHorizontal: 20, textAlign: 'center', fontWeight: 400 }}>Sử dụng app Momo hoặc app Ngân hàng để thanh toán</Text>
                        </View>
                    </>
                )}
            </View>
        </ScrollView >
    )
}

export default PaymentScreen