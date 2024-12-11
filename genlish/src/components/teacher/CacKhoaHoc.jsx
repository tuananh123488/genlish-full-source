import { authContext } from '@/context/AuthContext'
import { formContext } from '@/context/FormContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { formatMoney } from '@/utils/other'
import { convertSecondsToReadableFormat } from '@/utils/time'
import React, { useContext, useEffect, useState } from 'react'
import QLCacBaiHoc from './QLCacBaiHoc'
import ChiTietBaiHoc from './ChiTietBaiHoc'

const CacKhoaHoc = () => {

    const [courses, setCourses] = useState([])
    const [currentCourse, setCurrentCourse] = useState()
    const { authData, authHandler } = useContext(authContext)
    const { formHandler } = useContext(formContext)
    const [loading, setLoading] = useState(false)
    const { notifyHandler } = useContext(notifyContext)

    useEffect(() => {
        if (authData.user?._id) {
            setLoading(true)
            api({ type: TypeHTTP.GET, sendToken: false, path: '/course/get-all' })
                .then(res => {
                    setCourses(res.filter(item => item.teacher._id === authData.user._id))
                    setLoading(false)
                })
        }
    }, [authData.user?._id])

    const handleRemoveCourse = (id) => {
        notifyHandler.notify(notifyType.LOADING, 'Đang Xóa Khóa Học')

        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/course/delete/${id}` })
            .then(res => {
                setCourses(prev => prev.filter(course => course._id !== id));

                console.log(courses);

                notifyHandler.notify(notifyType.SUCCESS, 'Xóa Khóa Học Thành Công')
            })
    }


    return (
        <div className='w-full flex h-full'>
            <div style={{ transition: '0.5s', marginLeft: currentCourse ? '-100%' : 0 }} className='w-[100%] flex'>
                <div className='min-w-[100%] px-[1rem]'>
                    <div className='flex items-center justify-between my-2'>
                        <span className='font-semibold text-[18px]'>Các Khóa Học Của {authData.user?.fullName}</span>
                        <button onClick={() => { formHandler.showThemKhoaHoc() }} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-semibold text-[14px] w-[140px] py-[7px] rounded-lg">Thêm khóa học</button>
                    </div>
                    {loading === false ? (
                        <>
                            {courses.length > 0 ? (
                                <div className='w-full flex flex-col mt-[1rem] pb-[1rem] gap-2 h-[100%]'>
                                    <div className='w-full grid grid-cols-4 gap-3 py-[0.5rem] px-[0.5rem] max-h-[100%] overflow-y-auto'>
                                        {courses.map((course, index) => (
                                            <div onClick={() => setCurrentCourse(course)} className='transition-all hover:scale-[1.05] cursor-pointer flex flex-col w-[full] pb-2 shadow-md rounded-xl' key={index}>
                                                <img src={course.image} width={'100%'} className='rounded-t-xl' />
                                                <div className='flex items-center pr-[0.5rem]'>
                                                    <span className='font-medium text-[15px] w-full px-3 mt-2'>{course.title}</span>
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveCourse(course._id);
                                                    }} className="fa-solid fa-trash translate-y-[5px] text-[30px] text-[#9e9e9e]"></button>
                                                </div>
                                                <span className={`font-semibold text-[14px] text-[#5dade2] mt-1 w-full px-3`}>
                                                    {course.type === 'free' ? 'Miễn Phí' : `${formatMoney(course.price)} đ`}
                                                </span>
                                                <div className='flex gap-1 relative items-center px-2 mt-1'>
                                                    <span style={{ color: course.status ? '#07ae4e' : 'black' }} className='text-[13px] px-1'>
                                                        {course.status ? 'Đã phê duyệt' : 'Chưa phê duyệt'}
                                                    </span>
                                                    <span className='absolute flex items-center gap-1 text-[#4d4d4d] text-[13px] right-3 top-[50%] translate-y-[-50%]'>
                                                        <i className='bx bx-time-five translate-y-[1px]'></i>
                                                        {convertSecondsToReadableFormat(
                                                            course.list_course.reduce((total, item) => total + item.duration, 0)
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className='w-full flex flex-col items-center justify-center mt-[1rem] pb-[1rem] h-[100%]'>
                                    <p className='text-[20px] text-gray-500'>Bạn chưa có khóa học nào!</p>
                                </div>
                            )}

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
                <div className='min-w-[100%]'>
                    <ChiTietBaiHoc setCurrentCourse={setCurrentCourse} course={currentCourse} />
                </div>
            </div>
        </div>
    )
}

export default CacKhoaHoc