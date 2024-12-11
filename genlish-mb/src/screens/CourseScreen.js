import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Image, ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { menuContext } from '../contexts/MenuContext';
import { payloadContext } from '../contexts/PayloadContext';
import { screenContext } from '../contexts/ScreenContext';
import { userContext } from '../contexts/UserContext';
import { api, TypeHTTP } from '../utils/api';
import { formatMoney } from '../utils/other';
import Icon from 'react-native-vector-icons/Ionicons';
import { convertSecondsToReadableFormat } from '../utils/time';
import Navbar from '../components/Navbar';

const CourseScreen = () => {
    const { width } = Dimensions.get('window');
    const [courses, setCourses] = useState([])
    const { menuHandler } = useContext(menuContext)
    const { payloadHandler } = useContext(payloadContext)
    const { userData } = useContext(userContext)
    const { screenHandler } = useContext(screenContext)
    const [cou, setCou] = useState([])

    useEffect(() => {
        api({ type: TypeHTTP.GET, sendToken: false, path: '/course/get-all' })
            .then(res => {
                setCourses(res)
            })
    }, [userData.user?._id])

    useEffect(() => {

        if (courses && Array.isArray(courses)) {
            courses.forEach(courseItem => {
                if (userData.user?._id && courseItem?._id) {
                    api({
                        sendToken: true,
                        type: TypeHTTP.GET,
                        path: `/studycourse/get-by-student-and-course?studentid=${userData.user._id}&courseid=${courseItem._id}`
                    })
                        .then(res => {
                            if (res !== null && res !== undefined) {
                                setCou(prevCou => [...prevCou, res]);
                            }
                        })
                        .catch(error => {

                            console.error("Error fetching data:", error);
                        });
                }
            });
        }
    }, [courses, userData.user?._id]);

    return (
        <ScrollView>
            {/* {screenData.currentScreen === 1 && ( */}
            <View style={{ flexWrap: 'wrap', flexDirection: 'column', width, gap: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text style={{ fontSize: 22, fontWeight: 600 }}>Các Khóa Học</Text>
                <View style={{ flexDirection: 'row', gap: 10, position: 'relative', flexWrap: 'wrap', justifyContent: 'space-evenly', width: '100%' }}>
                    {courses.map((course, index) => (
                        <TouchableOpacity onPress={() => {
                            payloadHandler.setCourse(course)
                            screenHandler.navigate('course-detail')
                        }} key={index} style={{ width: '48%', gap: 5, backgroundColor: '#f2f3f4', flexDirection: 'column', paddingBottom: 5, borderRadius: 8 }}>
                            <Image source={{ uri: course.image }} style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 8 }} />
                            <Text style={{ fontSize: 14, fontWeight: 600, paddingHorizontal: 5 }}>{course.title}</Text>
                            {cou && cou.some(c => c.course_id === course._id) ? (
                                <Text style={{ fontSize: 13, position: 'absolute', fontWeight: 600, paddingHorizontal: 5, color: '#5dade2', backgroundColor: 'white', borderRadius: 5, top: 3, left: 3 }}>Đã Đăng Ký</Text>
                            ) : (
                                <Text style={{ fontSize: 13, position: 'absolute', fontWeight: 600, paddingHorizontal: 5, color: '#5dade2', backgroundColor: 'white', borderRadius: 5, top: 3, left: 3 }}>{course.type === 'free' ? 'Miễn Phí' : `${formatMoney(course.price)} đ`}</Text>
                            )}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: course.teacher.avatar }} style={{ width: 30, aspectRatio: 1, borderRadius: 30 }} />
                                    <Text style={{ fontSize: 13, fontWeight: 600, paddingHorizontal: 5, color: '#3b3b3b' }}>{course.teacher.fullName.split(' ').filter((item, index) => index === course.teacher.fullName.split(' ').length - 1 || index === course.teacher.fullName.split(' ').length - 2).join(' ')}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name='time-outline' style={{ fontSize: 16 }} />
                                    <Text style={{ fontSize: 12, fontWeight: 400, paddingHorizontal: 5, color: '#3b3b3b' }}>{convertSecondsToReadableFormat(
                                        course.list_course.reduce((total, item) => total + item.duration, 0)
                                    )}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {/* )} */}
        </ScrollView>
    )
}

export default CourseScreen