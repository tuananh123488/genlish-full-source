import React, { useContext, useEffect, useState } from 'react'
import { convertSecondsToReadableFormat, convertSecondsToTimeFormat, convertSecondsToVietnameseFormat } from '@/utils/time'
import { mainColor } from '@/utils/color'
import { formatMoney, removeVietnameseTones, typePayments } from '@/utils/other'
import { authContext } from '@/context/AuthContext'
import { api, TypeHTTP } from '@/utils/api'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { payloadContext } from '@/context/PayloadContext'
import { usePathname } from 'next/navigation'

const DetailCourse = ({ course, setStudy, setPayment, handleAccept, handleDelete }) => {

    const [more, setMore] = useState(false)
    const { authData, authHandler } = useContext(authContext)
    const { notifyHandler } = useContext(notifyContext)
    const { payloadHandler, payloadData } = useContext(payloadContext)
    const pathname = usePathname()


    const handleSignUpCourse = () => {
        if (course.type === 'free') {
            const body = {
                student_id: authData.user._id,
                course_id: course._id,
                process: 1
            }
            api({ sendToken: true, type: TypeHTTP.POST, body, path: '/studycourse/create' })
                .then(res => {
                    notifyHandler.notify(notifyType.SUCCESS, 'Đăng Ký Học Thành Công')
                    payloadHandler.setStudyCourse(res)

                    // notify
                    const body1 = {
                        toUser: course.teacher,
                        fromUser: {
                            _id: authData.user._id,
                            fullName: authData.user.fullName,
                            avatar: authData.user.avatar
                        },
                        content: `${authData.user.fullName} đã đăng ký khóa học "${course.title}"`,
                        type: 'inbox'
                    }
                    api({ type: TypeHTTP.POST, sendToken: false, path: '/notification/save', body: body1 })
                })
        } else {
            setPayment(true)
        }
    }

    return (
        <div className='flex min-w-[100%] px-[1.5rem]'>
            <div className='flex flex-col w-[70%] pt-[1.5rem] transition-all'>
                <span className='text-[14px]'>Khóa Học</span>
                <span className='font-semibold text-[25px]'>{course.title}</span>
                {more === false ? (
                    <div className='flex text-[14px] mt-2 flex-col gap-2'>
                        <span className=''>
                            {course.description.split('\n').length > 1 ? (
                                course.description.split('\n')[0].slice(0, course.description.split('\n')[0].length - 1)
                            ) : (
                                course.description.split('\n')[0]
                            )}
                            {course.description.split('\n').length > 1 && (
                                <span onClick={() => setMore(true)} className='font-bold ml-1 cursor-pointer'> Xem Thêm...</span>
                            )}
                        </span>
                    </div>
                ) : (
                    <div className='flex text-[14px] mt-2 flex-col gap-2'>
                        {course.description.split('\n').map((item, index) => (
                            <span key={index}>
                                {item}
                                {index === course.description.split('\n').length - 1 && (
                                    <span onClick={() => setMore(false)} className='font-bold ml-1 cursor-pointer'>(Thu gọn)</span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
                <span className='font-semibold text-[#383838] text-[18px] mt-[1rem]'>Thành Quả Đạt Được</span>
                <div className='flex w-full flex-col gap-2 mt-2'>
                    {course.result.split('\n').map((item, index) => (
                        <span className='text-[14px] pl-2' key={index}>+ {item}</span>
                    ))}
                </div>
                <span className='font-semibold text-[#383838] text-[18px] mt-[1rem]'>Nội Dung Khóa Học</span>
                <div className='flex w-full mt-2 ml-2 items-center'>
                    <span className='text-[14px] font-semibold'>{course.list_course.length}</span>
                    <span className='text-[14px] text-[#323232] font-medium ml-1'>bài học</span>
                    <span className='w-[4px] h-[4px] mx-[0.5rem] translate-y-[2px] rounded-full bg-[#282828]' />
                    <span className='text-[14px] text-[#323232] font-medium mr-1'>Thời lượng</span>
                    <span className='text-[14px] font-semibold'>{convertSecondsToVietnameseFormat(course.list_course.reduce((total, item) => total + item.duration, 0))}</span>
                </div>
                <div className='w-full flex flex-col gap-2 my-[1rem] pb-[1rem]'>
                    {course.list_course.map((item, index) => (
                        <div key={index} className='h-[50px] relative rounded-lg bg-[#fafaff] px-[1rem] gap-2 flex items-center'>
                            <i style={{ color: mainColor }} className='bx bx-play'></i>
                            <span className='text-[14px]'>{index + 1}. {item.title}</span>
                            <>
                                {pathname !== '/admin' ? null : `https://www.youtube.com/watch?v=${item.url}`}
                            </>
                            <span className='text-[12px] absolute right-4 top-[50%] translate-y-[-50%]'>{convertSecondsToTimeFormat(item.duration)}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex items-center flex-col w-[30%] pt-[2rem] gap-2 px-[1rem]'>
                <img src={course.image} className='w-[100%] rounded-lg mb-1' />
                <div className='flex justify-start w-full text-[#4a4a4a] pl-[0.5rem] items-center gap-2 font-medium'>
                    <i className='bx bxs-buoy translate-y-[2px]'></i>
                    <span className='text-[13px]'>{course.type === 'free' ? 'Miễn Phí' : 'Trả Phí: ' + formatMoney(course.price) + 'đ'}</span>
                </div>
                <div className='flex justify-start w-full text-[#4a4a4a] pl-[0.5rem] items-center gap-2 font-medium'>
                    <i className='bx bxl-meta translate-y-[2px]'></i>
                    <span className='text-[13px]'>{course.level}</span>
                </div>
                <div className='flex justify-start w-full text-[#4a4a4a] pl-[0.5rem] items-center gap-2 font-medium'>
                    <i className='bx bx-grid translate-y-[2px]'></i>
                    <span className='text-[13px]'>Tổng số {course.list_course.length} bài học</span>
                </div>
                <div className='flex justify-start w-full text-[#4a4a4a] pl-[0.5rem] items-center gap-2 font-medium'>
                    <i className='bx bx-time-five translate-y-[2px]'></i>
                    <span className='text-[13px]'>Thời lượng {convertSecondsToVietnameseFormat(course.list_course.reduce((total, item) => total + item.duration, 0))}</span>
                </div>
                <div className='flex justify-start w-full text-[#4a4a4a] pl-[0.5rem] items-center gap-2 font-medium'>
                    <i className='bx bxs-battery translate-y-[2px]'></i>
                    <span className='text-[13px]'>Học mọi lúc, mọi nơi</span>
                </div>
                {console.log(pathname)}
                {pathname !== '/admin' ?
                    <>
                        {authData.user ? (<>
                            {payloadData.studyCourse ? (
                                <button onClick={() => setStudy(true)} className='text-[white] pt-2 mt-2 pb-2 rounded-lg font-semibold w-[90%] bg-[#00d5ff]'>Tiếp Tục Học</button>
                            ) : (
                                <button onClick={() => handleSignUpCourse()} className='text-[white] pt-2 mt-2 pb-2 rounded-lg font-semibold w-[90%] bg-[#00d5ff]'>Đăng Ký Học</button>
                            )}
                        </>) : (
                            <button onClick={() => {
                                authHandler.showSignIn()
                                payloadHandler.setTarget(`/course/${removeVietnameseTones(course.slug)}`)
                            }} className='text-[white] pt-2 mt-2 pb-2 rounded-lg font-semibold w-[90%] bg-[#00d5ff]'>Đăng Nhập Để Bắt Đầu Học</button>
                        )}
                    </>
                    : (
                        <>
                            {course.status === false && (
                                <button onClick={() => {
                                    handleAccept(course)
                                }} className='text-[white] pt-2 mt-2 pb-2 rounded-lg font-semibold w-[90%] bg-[#00d5ff]'>Phê duyệt khóa học</button>
                            )}
                            {course.status === false && (
                                <button onClick={() => {
                                    handleDelete(course)
                                }} className='text-[white] pt-2 mt-2 pb-2 rounded-lg font-semibold w-[90%] bg-[red]'>Xóa khóa học</button>
                            )}
                        </>
                    )}
            </div>
        </div >
    )
}

export default DetailCourse