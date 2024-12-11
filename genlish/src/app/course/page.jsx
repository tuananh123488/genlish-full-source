'use client'
import Navbar from '@/components/Navbar'

import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api, TypeHTTP } from '@/utils/api'
import { mainColor } from '@/utils/color'
import { convertSecondsToReadableFormat } from '@/utils/time'
import { formatMoney, removeVietnameseTones } from '@/utils/other'
import { notifyContext } from '@/context/NotifyContext'
import { authContext } from '@/context/AuthContext'
const Course = () => {

    const [courses, setCourses] = useState([])
    const { notifyHandler } = useContext(notifyContext)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        api({ type: TypeHTTP.GET, sendToken: false, path: '/course/get-all' })
            .then(res => {
                setCourses(res)
                setLoading(false)
            })
    }, [])



    const { authData } = useContext(authContext)
    const [cou, setCou] = useState([])

    useEffect(() => {

        if (courses && Array.isArray(courses)) {
            courses.forEach(courseItem => {
                if (authData.user?._id && courseItem?._id) {
                    api({
                        sendToken: true,
                        type: TypeHTTP.GET,
                        path: `/studycourse/get-by-student-and-course?studentid=${authData.user._id}&courseid=${courseItem._id}`
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
    }, [courses, authData.user?._id]);

    return (
        <motion.div
            initial={{ x: 200 * -1 }}
            animate={{ x: 0 }}
            exit={{ x: 1920 * -1, transition: { duration: 0.2 } }}
        >
            <section className='w-full h-screen flex bg-[#f9fafb]'>
                <Navbar />
                <div className=' w-[95%] relative p-[1.5rem] h-screen overflow-y-auto'>
                    {loading === false ? (
                        <>
                            <div className='text-[20px] font-semibold'>Các khóa học</div>
                            <div className='w-full grid grid-cols-4 mt-[1rem] gap-4'>
                                {courses.map((course, index) => {
                                    if (course.status === true) {
                                        return <div onClick={() => notifyHandler.navigate(`/course/${removeVietnameseTones(course.slug)}`)} className='transition-all hover:scale-[1.05] cursor-pointer flex flex-col w-[full] pb-2 shadow-xl rounded-xl' key={index}>
                                            <img src={course.image} width={'100%'} className='rounded-t-xl' />
                                            <span className='font-medium text-[15px] w-full px-3 mt-2'>{course.title}</span>

                                            <>

                                                {cou && cou.some(c => c.course_id === course._id) ? (
                                                    <span className={`font-semibold text-[14px] text-[#5dade2] mt-1 w-full px-3`}>Đã đăng kí</span>
                                                ) : (
                                                    <span className={`font-semibold text-[14px] text-[#5dade2] mt-1 w-full px-3`}>{course.type === 'free' ? 'Miễn Phí' : `${formatMoney(course.price)} đ`}</span>
                                                )}
                                            </>


                                            <div className='flex gap-1 relative items-center px-2 mt-1'>
                                                <img src={course.teacher.avatar} className='w-[25px] aspect-square rounded-full' />
                                                <span className='text-[13px] text-[#4d4d4d]'>{course.teacher.fullName}</span>
                                                <span className='absolute flex items-center gap-1 text-[#4d4d4d] text-[14px] right-3 top-[50%] translate-y-[-50%]'>
                                                    <i className='bx bx-time-five translate-y-[1px]'></i>
                                                    {convertSecondsToReadableFormat(
                                                        course.list_course.reduce((total, item) => total + item.duration, 0)
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                })}
                            </div>
                        </>
                    ) : (
                        <div role="status" className='flex flex-col items-center gap-2 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'>
                            <svg aria-hidden="true" className="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-[black]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className='text-[18px]'>Đang tải khóa học</span>
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    )
}

export default Course