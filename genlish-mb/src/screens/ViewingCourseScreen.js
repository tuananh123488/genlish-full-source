import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, ImageBackground, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { menuContext } from '../contexts/MenuContext';
import { payloadContext } from '../contexts/PayloadContext';
import { userContext } from '../contexts/UserContext';
import YoutubePlayer from 'react-native-youtube-iframe';
import { api, TypeHTTP } from '../utils/api';
import { convertSecondsToTimeFormat, formatDate, formatDateTime } from '../utils/time';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import { screenContext } from '../contexts/ScreenContext';

const ViewingCourseScreen = () => {
    const { width } = Dimensions.get('window');
    const reactPlayerRef = useRef()
    const [playing, setPlaying] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(1)
    const [played, setPlayed] = useState(0)
    const [enableNext, setEnableNext] = useState(false)
    const { screenHandler, screenData } = useContext(screenContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const { userData } = useContext(userContext)
    const playedTimeRef = useRef(0)
    const [currentEpisode, setCurrentEpisode] = useState(1)
    const [comment, setComment] = useState('')
    const { menuHandler } = useContext(menuContext)

    useEffect(() => {
        setCurrentEpisode(payloadData.currentEpisode)
    }, [payloadData.currentEpisode])

    useEffect(() => {
        if (payloadData.studyCourse?.process) {
            payloadHandler.setCurrentEpisode(payloadData.studyCourse.process)
            playedTimeRef.current = payloadData.studyCourse.currentTimeStudied
        }
    }, [payloadData.studyCourse?.process])

    useEffect(() => {
        if (payloadData.studyCourse) {
            setCurrentIndex(payloadData.studyCourse.process)
        }
    }, [payloadData.studyCourse])

    useEffect(() => {
        if (payloadData.studyCourse?.currentTimeStudied && payloadData.course?.list_course[currentIndex - 1]) {
            if (payloadData.studyCourse.currentTimeStudied > (payloadData.course?.list_course[currentIndex - 1].duration * 0.7) && currentIndex < payloadData.course?.list_course.length) {
                setEnableNext(true)
            }
            if (payloadData.studyCourse.currentTimeStudied > (payloadData.course?.list_course[currentIndex - 1].duration * 0.7) && currentIndex === payloadData.course?.list_course.length) {
                api({ type: TypeHTTP.PUT, sendToken: true, path: `/studycourse/update/${payloadData.studyCourse._id}`, body: { ...payloadData.studyCourse, complete: true } })
                    .then(res => payloadHandler.setStudyCourse(res))
            }
        }
    }, [payloadData.studyCourse?.currentTimeStudied])
    const handleOnProgress = (currentTime) => {
        if (reactPlayerRef.current) {
            setPlayed(Math.floor(currentTime));
            playedTimeRef.current += 1; // Cập nhật ref thay vì state

            // Update time study của current Episode
            if (currentEpisode === payloadData.studyCourse?.process) {
                api({
                    type: TypeHTTP.PUT,
                    sendToken: true,
                    path: `/studycourse/update/${payloadData.studyCourse._id}`,
                    body: {
                        ...payloadData.studyCourse,
                        currentTimeStudied: playedTimeRef.current // Sử dụng ref ở đây
                    }
                }).then((res) => {
                    payloadHandler.setStudyCourse(res);
                });
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (reactPlayerRef.current) {
                reactPlayerRef.current.getCurrentTime().then((currentTime) => {
                    handleOnProgress(currentTime);
                });
            }
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(interval); // Clear interval khi unmount
    }, []);

    useEffect(() => {
        if (payloadData.studyCourse?.currentTimeStudied && payloadData.course?.list_course[currentIndex - 1]) {
            if (payloadData.studyCourse.currentTimeStudied > (payloadData.course?.list_course[currentIndex - 1].duration * 0.7) && currentIndex < payloadData.course?.list_course.length) {
                setEnableNext(true)
            }
            if (payloadData.studyCourse.currentTimeStudied > (payloadData.course?.list_course[currentIndex - 1].duration * 0.7) && currentIndex === payloadData.course?.list_course.length) {
                api({ type: TypeHTTP.PUT, sendToken: true, path: `/studycourse/update/${payloadData.studyCourse._id}`, body: { ...payloadData.studyCourse, complete: true } })
                    .then(res => payloadHandler.setStudyCourse(res))
            }
        }
    }, [payloadData.studyCourse?.currentTimeStudied])

    const handleNextEpisode = () => {
        api({ type: TypeHTTP.PUT, sendToken: true, path: `/studycourse/update/${payloadData.studyCourse._id}`, body: { ...payloadData.studyCourse, currentTimeStudied: 0, process: payloadData.studyCourse.process + 1 } })
            .then(res => {
                payloadHandler.setStudyCourse(res)
                setEnableNext(false)
            })
    }

    const handleNextEpisodeInProcess = () => {
        payloadHandler.setCurrentEpisode(prev => prev + 1)
    }

    const handlePrevEpisode = () => {
        payloadHandler.setCurrentEpisode(prev => prev - 1)
    }

    const handleNote = () => {

        setPlaying(false)
        payloadHandler.setTime(played)
        menuHandler.setDisplayNote(true)
        payloadHandler.setCurrentEpisode(currentEpisode)
    }

    const handleLike = () => {
        const body = {
            ...payloadData.course.list_course[currentEpisode - 1],
            likes: [...payloadData.course.list_course[currentEpisode - 1].likes, userData.user._id]
        }
        api({ sendToken: true, type: TypeHTTP.PUT, body, path: `/coursedetail/update/${body._id}` })
            .then(res => {
                payloadHandler.setCourse({
                    ...payloadData.course, list_course: payloadData.course.list_course.map(item => {
                        if (item._id === res._id) {
                            return res
                        }
                        return item
                    })
                })
            })
    }

    const handleUnLike = () => {
        const body = {
            ...payloadData.course.list_course[currentEpisode - 1],
            likes: payloadData.course.list_course[currentEpisode - 1].likes.filter(item => item !== userData.user._id)
        }
        api({ sendToken: true, type: TypeHTTP.PUT, body, path: `/coursedetail/update/${body._id}` })
            .then(res => {
                payloadHandler.setCourse({
                    ...payloadData.course, list_course: payloadData.course.list_course.map(item => {
                        if (item._id === res._id) {
                            return res
                        }
                        return item
                    })
                })
            })
    }

    const handleComment = () => {
        const body = {
            ...payloadData.course.list_course[currentEpisode - 1],
            comments: [...payloadData.course.list_course[currentEpisode - 1].comments, {
                user: {
                    _id: userData.user._id,
                    fullName: userData.user.fullName,
                    avatar: userData.user.avatar
                },
                time: new Date().toISOString(),
                content: comment
            }]
        }
        api({ sendToken: true, type: TypeHTTP.PUT, body, path: `/coursedetail/update/${body._id}` })
            .then(res => {
                payloadHandler.setCourse({
                    ...payloadData.course, list_course: payloadData.course.list_course.map(item => {
                        if (item._id === res._id) {
                            return res
                        }
                        return item
                    })
                })
                setComment('')
            })
    }

    return (
        <ScrollView>
            <View style={{ flexWrap: 'wrap', flexDirection: 'column', width, gap: 10, position: 'relative' }}>
                {(payloadData.course && screenData.currentScreen === 4) && (
                    <>
                        <TouchableOpacity onPress={() => screenHandler.navigate('course-detail')} style={{ zIndex: 1, position: 'absolute', top: 10, left: 10 }}>
                            <Icon1 name='arrow-back-ios' style={{ color: 'white', fontSize: 30 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            menuHandler.setDisplayListEpisode(true)
                            payloadHandler.setCurrentEpisode(currentEpisode)
                            payloadHandler.setCurrentIndex(currentIndex)
                        }} style={{ zIndex: 1, position: 'absolute', top: 10, right: 10 }}>
                            <Icon2 name='list-ul' style={{ color: 'white', fontSize: 30 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            menuHandler.setDisplayAllNote(true)
                        }} style={{ zIndex: 1, position: 'absolute', top: 50, right: 10 }}>
                            <Icon2 name='note-sticky' style={{ color: 'white', fontSize: 30 }} />
                        </TouchableOpacity>
                        <YoutubePlayer
                            ref={reactPlayerRef}
                            height={width * 9 / 16}
                            width={width}
                            play={playing}
                            videoId={payloadData.course.list_course[currentEpisode - 1].url} // Thay bằng ID video của bạn
                        />
                        <View style={{ flexDirection: 'column', position: 'relative', gap: 2, paddingHorizontal: 10, width }}>
                            <Text style={{ width: '75%', fontSize: 16, fontWeight: 600 }}>{payloadData.course.list_course[currentEpisode - 1].title}</Text>
                            <Text style={{ width: '75%', fontSize: 13 }}>Cập nhật {formatDate(payloadData.course.list_course[currentEpisode - 1].updatedAt)}</Text>
                            <View style={{ position: 'absolute', right: 10, top: 15, flexDirection: 'column', alignItems: 'center', gap: 5, marginTop: -10 }}>
                                {payloadData.course.list_course[currentEpisode - 1] && payloadData.course.list_course[currentEpisode - 1].likes.includes(userData.user?._id) ? (
                                    <TouchableOpacity onPress={() => handleUnLike()}>
                                        <Icon name='like1' style={{ fontSize: 26 }} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => handleLike()}>
                                        <Icon name='like2' style={{ fontSize: 26 }} />
                                    </TouchableOpacity>
                                )}
                                <Text style={{ fontSize: 13 }}>{payloadData.course.list_course[currentEpisode - 1].likes.length} Lượt Thích</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {played > 0 && (
                                    <TouchableOpacity onPress={() => handleNote()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: '#5dade2', width: 170, height: 45, marginTop: 10, borderRadius: 10 }}>
                                        <Icon name='pluscircleo' style={{ fontSize: 25, color: 'white' }} />
                                        <Text style={{ color: 'white' }}>Ghi chú tại {convertSecondsToTimeFormat(played)}</Text>
                                    </TouchableOpacity>
                                )}
                                <View style={{ flexDirection: 'row', gap: 5 }}>
                                    {currentEpisode > 1 && (
                                        <TouchableOpacity onPress={() => handlePrevEpisode()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: 'red', width: 70, height: 45, marginTop: 10, borderRadius: 10 }}>
                                            <Text style={{ color: 'white' }}>Trước</Text>
                                        </TouchableOpacity>
                                    )}
                                    {(enableNext) && (
                                        <TouchableOpacity onPress={() => handleNextEpisode()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: 'blue', width: 100, height: 45, marginTop: 10, borderRadius: 10 }}>
                                            <Text style={{ color: 'white' }}>Kế Tiếp</Text>
                                        </TouchableOpacity>
                                    )}
                                    {currentEpisode < currentIndex && (
                                        <TouchableOpacity onPress={() => handleNextEpisodeInProcess()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: 'blue', width: 100, height: 45, marginTop: 10, borderRadius: 10 }}>
                                            <Text style={{ color: 'white' }}>Kế Tiếp</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            <Text style={{ width: '75%', marginTop: 5, fontSize: 16, fontWeight: 600 }}>Bình Luận ({payloadData.course.list_course[currentIndex - 1].comments.length})</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <Image source={{ uri: userData.user.avatar }} style={{ height: 50, width: 50, borderRadius: 50 }} />
                                <TextInput value={comment} onChangeText={e => setComment(e)} placeholder='Thêm bình luận...' style={{ paddingHorizontal: 15, width: '75%', height: 45, borderWidth: 1, borderRadius: 10, borderColor: '#d0d3d4' }} />
                                <TouchableOpacity onPress={() => handleComment()}>
                                    <Icon1 name='send' style={{ fontSize: 30, color: '#4d4e4f' }} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={{ width: '100%', height: 375, marginTop: 5, flexDirection: 'column' }}>
                                {payloadData.course.list_course[currentIndex - 1].comments.map((comment, index) => (
                                    <View key={index} style={{ flexDirection: 'row', backgroundColor: '#fbfeff', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 10, marginTop: 10, width: '100%', alignItems: 'center' }}>
                                        <Image source={{ uri: comment.user.avatar }} style={{ height: 45, width: 45, borderRadius: 45 }} />
                                        <View style={{ flexDirection: 'column', width: '85%', paddingHorizontal: 5 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 15, fontWeight: 600 }}>{comment.user.fullName}</Text>
                                                <Text style={{ fontSize: 13 }}>{formatDateTime(comment.time)}</Text>
                                            </View>
                                            <Text style={{ fontSize: 13 }}>{comment.content}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    )
}

export default ViewingCourseScreen