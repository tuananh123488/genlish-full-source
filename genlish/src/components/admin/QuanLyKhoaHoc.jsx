import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useEffect, useState } from 'react'
import DetailCourse from '../course/DetailCourse'

const QuanLyKhoaHoc = () => {
    const [courses, setCourses] = useState([])
    const [screen, setScreen] = useState(0)
    const { authData } = useContext(authContext)
    const [select, setSelect] = useState(0)
    const [courseFilters, setCourseFilters] = useState([])
    const { notifyHandler } = useContext(notifyContext)
    const [currentCourse, setCurrentCourse] = useState()
    const [study, setStudy] = useState(false)
    const [payment, setPayment] = useState(false)

    useEffect(() => {
        api({ type: TypeHTTP.GET, sendToken: false, path: '/course/get-all' })
            .then(res => {
                setCourses(res)
            })
    }, [])

    useEffect(() => {
        if (select === 0) {
            setCourseFilters(courses)
        } else if (select === 1) {
            setCourseFilters(courses.filter(item => item.status === false))
        } else if (select === 2) {
            setCourseFilters(courses.filter(item => item.status === true))
        }
    }, [select, courses])

    const handleAccept = (course) => {
        const body = {
            ...course,
            status: true
        }
        api({ sendToken: true, type: TypeHTTP.POST, body, path: '/course/update' })
            .then(updated => {
                setCourses(prev => prev.map(item => {
                    if (item._id === updated._id) {
                        return { ...item, status: true }
                    }
                    return item
                }))
                if (currentCourse?._id === updated._id) {
                    setCurrentCourse({ ...currentCourse, status: true })
                }
                // notify
                const body1 = {
                    toUser: {
                        _id: course.teacher._id,
                        fullName: course.teacher.fullName,
                        avatar: course.teacher.avatar
                    },
                    fromUser: {
                        _id: 'admin',
                        fullName: 'admin',
                        avatar: 'admin'
                    },
                    content: `Quản trị viên đã phê duyệt khóa học "${course.title}" của bạn`,
                    type: 'notify'
                }
                api({ type: TypeHTTP.POST, sendToken: false, path: '/notification/save', body: body1 })
                notifyHandler.notify(notifyType.SUCCESS, 'Phê duyệt khóa học thành công')
            })
    }

    const handleDelete = (course) => {
        api({ sendToken: true, type: TypeHTTP.DELETE, path: `/course/delete/${course._id}` })
            .then(deleted => {
                setCourses(prev => prev.filter(item => item._id !== deleted?._id))
                if (currentCourse?._id === deleted._id) {
                    setCurrentCourse()
                    setScreen(0)
                }
                // notify
                const body1 = {
                    toUser: {
                        _id: course.teacher._id,
                        fullName: course.teacher.fullName,
                        avatar: course.teacher.avatar
                    },
                    fromUser: {
                        _id: 'admin',
                        fullName: 'admin',
                        avatar: 'admin'
                    },
                    content: `Quản trị viên đã từ chối và xóa khóa học "${course.title}" của bạn`,
                    type: 'notify'
                }
                api({ type: TypeHTTP.POST, sendToken: false, path: '/notification/save', body: body1 })
                notifyHandler.notify(notifyType.SUCCESS, 'Xóa khóa học thành công')
            })
    }

    return (
        <section style={{ marginLeft: `-${screen * 100}%` }} className='flex w-full relative h-[100%] transition-all'>
            <div className='min-w-[100%] flex flex-col mt-[1rem] gap-2 h-[95%] overflow-auto p-[1rem]'>
                <div className='w-full flex justify-between mb-[0.5rem]'>
                    <span className='font-semibold'>Các Khóa Học</span>
                    <select onChange={e => setSelect(Number(e.target.value))} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[35px] px-[1rem] border-[1px] border-[#e1e1e1]'>
                        <option value={0}>Tất Cả</option>
                        <option value={1}>Chưa Phê Duyệt</option>
                        <option value={2}>Đã Phê Duyệt</option>
                    </select>
                </div>
                {courseFilters.map((course, index) => {
                    return (
                        <div key={index} className='flex cursor-pointer transition-all hover:bg-[#e4e4e4] items-center gap-2 relative px-[1rem] py-2 bg-[#f6f6f6] rounded-lg'>
                            <div onClick={() => {
                                setScreen(1)
                                setCurrentCourse(course)
                            }} className='flex items-center gap-2'>
                                <img src={course.image} className='w-[80px] rounded-lg' />
                                <div className='flex flex-col'>
                                    <span className='font-semibold text-[15px]'>{course.title}</span>
                                    <span className='text-[13px]'>by {course.teacher.fullName}</span>
                                    <span style={{ color: course.status === false ? 'black' : 'blue' }} className='text-[13px]'>{course.status === false ? 'Chưa phê duyệt' : 'Đã phê duyệt'}</span>
                                </div>
                            </div>
                            <div className='flex gap-5 absolute right-[1rem] top-[50%] translate-y-[-50%] items-end'>
                                <div className='flex flex-col'>
                                    <span className='text-[13px]'>{course.type === 'free' ? 'Miễn Phí' : 'Trả Phí'}</span>
                                    {course.type === 'pay' && (
                                        <span className='text-[12px]'>by {course.price}</span>
                                    )}
                                </div>
                                <button onClick={() => handleDelete(course)} className='text-[13px] px-2 py-1 text-[white] rounded-md mt-1 bg-[red]'>
                                    Xóa
                                </button>
                                {
                                    course.status === false && (
                                        <div className='flex items-center gap-1'>

                                            <button onClick={() => handleAccept(course)} className='text-[13px] px-2 py-1 text-[white] rounded-md mt-1 bg-[blue]'>
                                                Phê duyệt
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
                })}

            </div >
            <div className='min-w-[100%] relative flex flex-col mt-[1rem] p-[1rem] gap-2 h-[95%] overflow-auto'>
                <div onClick={() => {
                    setScreen(0)
                    setCurrentCourse()
                }} className='w-full cursor-pointer absolute left-6 flex items-center gap-2 top-2 text-[#3f3f3f]'>
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Trở về</span>
                </div>
                {currentCourse && (
                    <div style={{ transition: '0.5s', marginLeft: payment ? '-100%' : study ? '-200%' : '0' }} className='w-[100%] flex'>
                        <DetailCourse handleDelete={handleDelete} handleAccept={handleAccept} course={currentCourse} setStudy={setStudy} setPayment={setPayment} />
                    </div>
                )}
            </div>
        </section >
    )
}

export default QuanLyKhoaHoc