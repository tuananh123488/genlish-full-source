import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Image, ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { menuContext } from '../contexts/MenuContext';
import { payloadContext } from '../contexts/PayloadContext';
import { userContext } from '../contexts/UserContext';
import { convertSecondsToTimeFormat, convertSecondsToVietnameseFormat } from '../utils/time';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { api, TypeHTTP } from '../utils/api';
import { notifyType, utilsContext } from '../contexts/UtilsContext';
import { screenContext } from '../contexts/ScreenContext';

const DetailCourseScreen = () => {
    const { width, height } = Dimensions.get('window');
    const { screenHandler, screenData } = useContext(screenContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const { userData } = useContext(userContext)
    const { utilsHandler } = useContext(utilsContext)
    const [course, setCourse] = useState()
    useEffect(() => {
        setCourse(payloadData.course)
    }, [payloadData.course])

    const handleSignUpCourse = () => {
        if (course.type === 'pay') {
            screenHandler.navigate('payment')
            payloadHandler.setCurrentCourse(course)
        } else {
            const body = {
                student_id: userData.user._id,
                course_id: course._id,
                process: 1
            }
            api({ sendToken: true, type: TypeHTTP.POST, body, path: '/studycourse/create' })
                .then(res => {
                    utilsHandler.notify(notifyType.SUCCESS, 'Đăng Ký Học Thành Công')
                    payloadHandler.setStudyCourse(res)
                })
        }
    }

    return (
        <View>
            <ScrollView>

                <View style={{ flexWrap: 'wrap', flexDirection: 'column', width, gap: 10, paddingBottom: 70 }}>
                    {course && (
                        <>
                            <Image style={{ width: '100%', aspectRatio: 16 / 9 }} source={{ uri: course.image }} />
                            <View style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'column' }}>
                                <Text style={{ fontSize: 21, fontWeight: 600 }}>{course.title}</Text>
                                <Text style={{ fontSize: 14, fontWeight: 400, marginVertical: 10, paddingHorizontal: 10 }}>{course.description.split('\n').length > 1 ? (
                                    course.description.split('\n')[0].slice(0, course.description.split('\n')[0].length - 1)
                                ) : (
                                    course.description.split('\n')[0]
                                )}
                                </Text>
                                <Text style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>Thành Quả Đạt Được</Text>
                                {course.result.split('\n').map((item, index) => (
                                    <Text key={index} style={{ marginVertical: 5, paddingHorizontal: 10 }}>+ {item}</Text>
                                ))}
                                <Text style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50', marginTop: 10 }}>Nội Dung Khóa Học</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, marginTop: 5 }}>
                                    <Text style={{ fontWeight: 600 }}>{course.list_course.length}</Text>
                                    <Text className='text-[14px] text-[#323232] font-medium ml-1'>bài học</Text>
                                    <View style={{ height: 5, aspectRatio: 1, borderRadius: 5, backgroundColor: '#d5d8dc' }} />
                                    <Text className='text-[14px] text-[#323232] font-medium mr-1'>Thời lượng</Text>
                                    <Text style={{ fontWeight: 600 }}>{convertSecondsToVietnameseFormat(course.list_course.reduce((total, item) => total + item.duration, 0))}</Text>
                                </View>
                                <View style={{ paddingHorizontal: 10, marginTop: 10, flexDirection: 'column', gap: 10 }}>
                                    {course.list_course.map((item, index) => (
                                        <View key={index} style={{ backgroundColor: '#fafaff', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <Icon name='controller-play' style={{ color: '#5dade2', fontSize: 16 }} />
                                                <Text style={{ width: '80%' }}>{index + 1}. {item.title}</Text>
                                            </View>
                                            <Text style={{ fontSize: 13 }}>{convertSecondsToTimeFormat(item.duration)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
            {screenData.currentScreen === 2 && <View style={{ position: 'absolute', bottom: 10, left: 0, width, flexDirection: 'row', justifyContent: 'center' }}>
                {payloadData.studyCourse ? (
                    <TouchableOpacity onPress={() => screenHandler.navigate('viewing-course')} style={{ backgroundColor: '#149dff', width: '90%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Tiếp Tục Học</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => handleSignUpCourse()} style={{ backgroundColor: '#149dff', width: '90%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Đăng Ký Học</Text>
                    </TouchableOpacity>
                )}
            </View>}
            <TouchableOpacity onPress={() => screenHandler.navigate('course')} style={{ position: 'absolute', top: 10, left: 10 }}>
                <Icon1 name='arrow-back-ios' style={{ color: 'white', fontSize: 30 }} />
            </TouchableOpacity>
        </View>
    )
}

export default DetailCourseScreen