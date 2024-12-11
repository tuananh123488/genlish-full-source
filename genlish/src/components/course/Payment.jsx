import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { payloadContext } from '@/context/PayloadContext'
import { api, TypeHTTP } from '@/utils/api'
import { formatMoney, typePayments } from '@/utils/other'
import React, { useContext, useEffect, useRef, useState } from 'react'

const Payment = ({ course, payment, setPayment }) => {

    const [url, setUrl] = useState('')
    const { authData } = useContext(authContext)
    const { payloadHandler } = useContext(payloadContext)
    const { notifyHandler } = useContext(notifyContext)
    const paymentRef = useRef()

    useEffect(() => {
        if (course && authData.user && payment === true) {
            setUrl(`https://qr.sepay.vn/img?bank=MBBank&acc=9908080899&&template=compact&amount=${'2000'}&des=MaKH${authData.user?._id}MaCourse${course._id}THANHTOAN`)


        }
    }, [payment])

    useEffect(() => {
        if (payment) {
            paymentRef.current = setInterval(() => {
                api({ type: TypeHTTP.POST, body: { course_id: course._id, user_id: authData.user._id }, path: '/payment/check_payment', sendToken: false })
                    .then(res => {
                        if (res) {
                            notifyHandler.notify(notifyType.LOADING, 'Đang Tiến Hành Thanh Toán Khóa Học')
                            const startInfo = res.paymentInfo.indexOf("CT") + 2;
                            const bodyPayment = {
                                course: {
                                    _id: course._id,
                                    name: course.title,
                                    numberOfEpisode: course.list_course.length,
                                    image: course.image
                                },
                                price: course.price,
                                customer: {
                                    _id: authData.user._id,
                                    fullName: authData.user.fullName,
                                    avatar: authData.user.avatar
                                },
                                provider: course.teacher,
                                paymentInfo: res.paymentInfo.substring(startInfo, res.paymentInfo.length) + ` chuyen tien khoa hoc ${course.title} - gia ${course.price}`,
                                type: typePayments.studentTranfer
                            }
                            api({ sendToken: true, type: TypeHTTP.POST, body: { id: res._id, payment: bodyPayment }, path: '/payment/update' })
                                .then(res => {
                                    const body = {
                                        student_id: authData.user._id,
                                        course_id: course._id,
                                        process: 1
                                    }
                                    api({ sendToken: true, type: TypeHTTP.POST, body, path: '/studycourse/create' })
                                        .then(res => {
                                            notifyHandler.notify(notifyType.SUCCESS, 'Thanh Toán Thành Công')
                                            payloadHandler.setStudyCourse(res)
                                            setPayment(false)

                                            // notify
                                            const body1 = {
                                                toUser: course.teacher,
                                                fromUser: {
                                                    _id: authData.user._id,
                                                    fullName: authData.user.fullName,
                                                    avatar: authData.user.avatar
                                                },
                                                content: `${authData.user.fullName} đã thanh toán khóa học "${course.title}", giá ${course.price}`,
                                                type: 'inbox'
                                            }
                                            api({ type: TypeHTTP.POST, sendToken: false, path: '/notification/save', body: body1 })
                                        })
                                })
                        }
                    })
            }, 2000);
        } else {
            clearInterval(paymentRef.current)
        }
        return () => clearInterval(paymentRef.current);
    }, [payment])


    return (
        <div className='flex flex-col min-w-[100%] px-[1.5rem] h-full items-center justify-center relative'>
            {payment && (
                <>
                    <div className='flex absolute left-3 items-center top-3'>
                        <i onClick={() => setPayment(false)} className='bx bx-chevron-left cursor-pointer text-[30px]' ></i>
                        <span className='font-semibold'>Thanh Toán</span>
                    </div>
                    <img src={url} className='w-[25%]' />
                    <div className='flex flex-col items-center gap-1'>
                        <span className='rounded-md text-[13px] font-semibold'>Tên chủ TK: LE XUAN TUAN ANH</span>
                        <span className='font-medium text-[14px]'>Số TK: 9908080899 </span>
                        <span className='rounded-md text-[14px]'>Sử dụng app Momo hoặc app Ngân hàng để thanh toán</span>
                        <span className='rounded-md text-[14px]'>Khóa Học {course.title} - {formatMoney(course.price)}đ</span>
                    </div>
                </>
            )}
        </div>
    )
}

export default Payment