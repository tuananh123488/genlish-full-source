import { mainColor } from '@/utils/color'
import React, { useContext, useEffect, useRef, useState } from 'react'
import CircularProgressBar from './CircularProgressBar'
import ReactPlayer from 'react-player'
import { convertSecondsToTimeFormat, formatDate, formatDateTime } from '@/utils/time'
import { api, TypeHTTP } from '@/utils/api'
import { formContext } from '@/context/FormContext'
import { payloadContext } from '@/context/PayloadContext'
import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'

const ViewingCourse = ({ course, setStudy, setCourse }) => {

    const reactPlayerRef = useRef()
    const [currentIndex, setCurrentIndex] = useState(1)
    const [played, setPlayed] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [enableNext, setEnableNext] = useState(false)
    const [currentEpisode, setCurrentEpisode] = useState(1)
    const { formHandler } = useContext(formContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const [playedTime, setPlayedTime] = useState(0)
    const { authData } = useContext(authContext)
    const { notifyHandler } = useContext(notifyContext)
    const [comment, setComment] = useState('')

    useEffect(() => {
        if (payloadData.studyCourse?.process) {
            setCurrentEpisode(payloadData.studyCourse.process)
            setPlayedTime(payloadData.studyCourse.currentTimeStudied)
        }
    }, [payloadData.studyCourse?.process])

    useEffect(() => {
        if (payloadData.studyCourse) {
            setCurrentIndex(payloadData.studyCourse.process)
        }
    }, [payloadData.studyCourse])

    // useEffect(() => {
    //     if (course)
    //         setPlaying(true)
    //     else
    //         setPlaying(false)
    // }, [course])

    useEffect(() => {
        if (payloadData.studyCourse?.currentTimeStudied && course?.list_course[currentIndex - 1]) {
            if (payloadData.studyCourse.currentTimeStudied > (course?.list_course[currentIndex - 1].duration * 0.7) && currentIndex < course?.list_course.length) {
                setEnableNext(true)
            }
            if (payloadData.studyCourse.currentTimeStudied > (course?.list_course[currentIndex - 1].duration * 0.7) && currentIndex === course?.list_course.length) {
                api({ type: TypeHTTP.PUT, sendToken: true, path: `/studycourse/update/${payloadData.studyCourse._id}`, body: { ...payloadData.studyCourse, complete: true } })
                    .then(res => payloadHandler.setStudyCourse(res))
            }
        }
    }, [payloadData.studyCourse?.currentTimeStudied])
    const handleOnProgress = () => {
        if (reactPlayerRef.current) {
            setPlayed(Math.floor(reactPlayerRef.current.getCurrentTime()))
            setPlayedTime(prev => prev + 1)
            // update time study cua current Episode
            if (currentEpisode === payloadData.studyCourse?.process) {
                api({ type: TypeHTTP.PUT, sendToken: true, path: `/studycourse/update/${payloadData.studyCourse._id}`, body: { ...payloadData.studyCourse, currentTimeStudied: playedTime } })
                    .then(res => payloadHandler.setStudyCourse(res))
            }
        }
    }

    const handleNextEpisode = () => {
        api({ type: TypeHTTP.PUT, sendToken: true, path: `/studycourse/update/${payloadData.studyCourse._id}`, body: { ...payloadData.studyCourse, currentTimeStudied: 0, process: payloadData.studyCourse.process + 1 } })
            .then(res => {
                payloadHandler.setStudyCourse(res)
                setEnableNext(false)
            })
    }

    const handleNextEpisodeInProcess = () => {
        setCurrentEpisode(prev => prev + 1)
    }

    const handlePrevEpisode = () => {
        setCurrentEpisode(prev => prev - 1)
    }

    const handleChangeEpisode = (index) => {
        setCurrentEpisode(index)
    }

    const handleNote = () => {
        setPlaying(false)
        payloadHandler.setTime(played)
        formHandler.showNote()
        payloadHandler.setCurrentEpisode(currentEpisode)
    }

    const handleLike = () => {
        const body = {
            ...course.list_course[currentEpisode - 1],
            likes: [...course.list_course[currentEpisode - 1].likes, authData.user._id]
        }
        api({ sendToken: true, type: TypeHTTP.PUT, body, path: `/coursedetail/update/${body._id}` })
            .then(res => {
                notifyHandler.notify(notifyType.SUCCESS, 'Đã thích video bài giảng')
                setCourse({
                    ...course, list_course: course.list_course.map(item => {
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
            ...course.list_course[currentEpisode - 1],
            likes: course.list_course[currentEpisode - 1].likes.filter(item => item !== authData.user._id)
        }
        api({ sendToken: true, type: TypeHTTP.PUT, body, path: `/coursedetail/update/${body._id}` })
            .then(res => {
                notifyHandler.notify(notifyType.SUCCESS, 'Đã bỏ thích video bài giảng')
                setCourse({
                    ...course, list_course: course.list_course.map(item => {
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
            ...course.list_course[currentEpisode - 1],
            comments: [...course.list_course[currentEpisode - 1].comments, {
                user: {
                    _id: authData.user._id,
                    fullName: authData.user.fullName,
                    avatar: authData.user.avatar
                },
                time: new Date().toISOString(),
                content: comment
            }]
        }
        api({ sendToken: true, type: TypeHTTP.PUT, body, path: `/coursedetail/update/${body._id}` })
            .then(res => {
                notifyHandler.notify(notifyType.SUCCESS, 'Đã đăng bình luận của bạn')
                setCourse({
                    ...course, list_course: course.list_course.map(item => {
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
        <div className='flex min-w-[100%] flex-col'>
            <div style={{ backgroundColor: '#2e86c1' }} className='w-full justify-between gap-2 px-[1rem] text-[white] flex items-center h-[60px]'>
                <div className='flex items-center gap-2'>
                    <i onClick={() => setStudy(false)} className='bx bx-chevron-left cursor-pointer text-[30px]' ></i>
                    <span className='font-semibold text-[17px]'>{course.title}</span>
                </div>
                <div className='flex items-center gap-[1rem]'>
                    <div className='flex items-center'>
                        <CircularProgressBar percentage={payloadData.studyCourse?.complete ? 100 : ((currentIndex - 1) / course.list_course.length * 100).toFixed(0)} />
                        {payloadData.studyCourse?.complete ? (
                            <span className='text-[14px]'>{course.list_course.length}/{course.list_course.length} bài học</span>
                        ) : (
                            <span className='text-[14px]'>{currentIndex - 1}/{course.list_course.length} bài học</span>
                        )}
                    </div>
                    <button onClick={() => {
                        formHandler.showAllNote()
                        payloadHandler.setCourse(course)
                    }} className='flex items-center gap-1 cursor-pointer'>
                        <i className='bx bx-note text-[20px]' ></i>
                        <span className='text-[14px] font-semibold'>Ghi chú</span>
                    </button>
                </div>
            </div>
            <div className='flex h-full'>
                <div className='w-[70%] flex flex-col overflow-y-auto h-[91%] rounded-br-xl'>
                    <div style={{ position: 'relative', paddingTop: '56.25%' /* Tỷ lệ 16:9 */ }}>
                        <ReactPlayer
                            config={{
                                youtube: {
                                    playerVars: {
                                        controls: 1, // Hiển thị bảng điều khiển
                                        modestbranding: 1, // Ẩn logo YouTube
                                        showinfo: 1, // Ẩn tiêu đề và thông tin video
                                        rel: 1, // Tắt gợi ý video liên quan 
                                        fs: 0,   // Ẩn fullscreen
                                    },
                                }
                            }}
                            ref={reactPlayerRef}
                            width='100%' // Chiều rộng full
                            height='100%' // Chiều cao được điều chỉnh theo tỷ lệ 16:9
                            style={{ position: 'absolute', top: 0, left: 0 }} // Căn chỉnh cho video
                            progressInterval={1000}
                            onPause={() => setPlaying(false)}
                            onPlay={() => setPlaying(true)}
                            url={`https://www.youtube.com/watch?v=${course.list_course[currentEpisode - 1].url}`}
                            playing={playing}
                            onProgress={() => handleOnProgress()}
                        />
                    </div>
                    <div className='w-full flex mt-3 items-start'>
                        <div className='w-[75%] flex flex-col px-4 gap-1'>
                            <span className='text-[20px] font-semibold'>{course.list_course[currentEpisode - 1].title}</span>
                            <span className='text-[15px]'>Cập nhật {formatDate(course.list_course[currentEpisode - 1].updatedAt)}</span>
                            <div className='flex items-center gap-2 mt-2'>
                                {currentEpisode > 1 && (
                                    <button onClick={() => handlePrevEpisode()} className="flex transition-all items-center justify-center px-4 py-1 border-2 border-transparent rounded-full bg-gradient-to-r from-blue-300 to-purple-300 text-blue-500 font-semibold hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:text-purple-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-4 h-4 mr-2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        BÀI TRƯỚC
                                    </button>
                                )}
                                {(enableNext) && (
                                    <button onClick={() => handleNextEpisode()} className="flex transition-all items-center justify-center px-4 py-1 border-2 border-transparent rounded-full bg-gradient-to-r from-green-300 via-pink-300 to-purple-300 text-green-500 font-semibold hover:bg-gradient-to-r hover:from-green-400 hover:via-pink-400 hover:to-purple-400 hover:text-purple-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-4 h-4 mr-2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                        BÀI TIẾP THEO
                                    </button>
                                )}
                                {currentEpisode < currentIndex && (
                                    <button onClick={() => handleNextEpisodeInProcess()} className="flex transition-all items-center justify-center px-4 py-1 border-2 border-transparent rounded-full bg-gradient-to-r from-green-300 via-pink-300 to-purple-300 text-green-500 font-semibold hover:bg-gradient-to-r hover:from-green-400 hover:via-pink-400 hover:to-purple-400 hover:text-purple-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-4 h-4 mr-2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                        BÀI TIẾP THEO
                                    </button>
                                )}

                            </div>
                        </div>
                        <div className='w-[25%] flex flex-col gap-2 justify-end items-end mt-2'>
                            <div className='flex items-center gap-2 mr-1'>
                                <span className='text-[14px] translate-y-[1px] font-semibold'>{course.list_course[currentEpisode - 1].likes.length} Lượt Thích</span>
                                {course.list_course[currentEpisode - 1] && course.list_course[currentEpisode - 1].likes.includes(authData.user?._id) ? (
                                    <i onClick={() => handleUnLike()} className='bx bxs-like text-[#636363] cursor-pointer text-[25px]' ></i>
                                ) : (
                                    <i onClick={() => handleLike()} className='bx bx-like text-[#636363] cursor-pointer text-[25px]' ></i>
                                )}
                            </div>
                            {played > 0 && (
                                <button onClick={() => handleNote()} style={{ backgroundColor: mainColor }} className='text-[white] rounded-lg px-4 font-semibold py-3 text-[14px]'>
                                    Ghi chú tại {convertSecondsToTimeFormat(played)}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='w-full mt-[1rem] px-[1rem] flex flex-col'>
                        <span className='text-[18px] font-semibold mb-2'>Bình Luận ({course.list_course[currentIndex - 1].comments.length})</span>
                        <div className='w-full flex items-center gap-2 mb-2'>
                            <img src={authData.user?.avatar} className='w-[45px] aspect-square' />
                            <input value={comment} onChange={e => setComment(e.target.value)} className='w-full text-[15px] h-[35px] text-[#3a3a3a] border-b-[1px] border-[#a9a9a9] focus:outline-0' placeholder='Thêm bình luận...' />
                            <i onClick={() => handleComment()} className='bx bx-send text-[25px] cursor-pointer text-[#969696]' ></i>
                        </div>
                        {course.list_course[currentIndex - 1].comments.map((comment, index) => (
                            <div className='w-full pl-2 flex items-center gap-2 mt-2' key={index}>
                                <img src={comment.user.avatar} className='w-[45px] aspect-square' />
                                <div className='flex flex-col w-full'>
                                    <div className='flex justify-between w-full text-[#383838]'>
                                        <span className='text-[14px]'>{comment.user.fullName}</span>
                                        <span className='text-[13px]'>{formatDateTime(comment.time)}</span>
                                    </div>
                                    <span className='text-[14px]'>{comment.content}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w-[30%] flex flex-col h-[86%] overflow-auto'>
                    <span className='w-full px-3 mb-1 mt-2 font-semibold text-[17px]'>Nội dung khóa học</span>
                    {course.list_course.map((item, index) => (
                        <div onClick={() => {
                            if (index <= currentIndex - 1) {
                                handleChangeEpisode(index + 1)
                            }
                        }} style={index === currentEpisode - 1 ? { backgroundColor: '#ebf5fb' } : {}} key={index} className='flex gap-2 cursor-pointer hover:bg-[#f3f3f3] transition-all py-2 px-5 mb-1'>
                            {index <= currentIndex - 1 ? (
                                <span className='text-[14px] text-[#3f3f3f] font-medium'>{index + 1}.</span>
                            ) : (
                                <span className='text-[14px] text-[#3f3f3f] font-medium'>
                                    <i className='bx bx-lock-alt text-[#909497] translate-y-[3px]' ></i>
                                </span>
                            )}
                            <div style={{ color: index <= currentIndex - 1 ? '#3f3f3f' : '#909497' }} className='flex flex-col gap-1'>
                                <span className='text-[14px] font-medium'>{item.title}</span>
                                <span className='text-[12px]'>{convertSecondsToTimeFormat(item.duration)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default ViewingCourse