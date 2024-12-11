import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { apiKey } from '@/utils/apikey'
import { convertISODurationToSeconds } from '@/utils/time'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'

const ChiTietBaiHoc = ({ course, setCurrentCourse }) => {

    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const { notifyHandler } = useContext(notifyContext)
    const [courseDetails, setCourseDetails] = useState([])
    const { authData } = useContext(authContext)
    useEffect(() => {
        console.log(course);

        if (course) {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/coursedetail/get-by-course/${course._id}` })
                .then(details => {
                    setCourseDetails(details)
                })
        }
    }, [course])

    const handleCreate = () => {
        const videoId = url.split('=')[1];

        axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails,statistics,status`)
            .then(res => {
                const duration = convertISODurationToSeconds(res.data.items[0].contentDetails.duration)
                api({ type: TypeHTTP.POST, sendToken: true, body: { title, url: videoId, course_id: course._id, duration }, path: '/coursedetail/create' })
                    .then(course1 => {
                        notifyHandler.notify(notifyType.SUCCESS, 'Tạo Bài Học Thành Công')
                        setCourseDetails([...courseDetails, course1])
                        setTitle('')
                        setUrl('')

                        const body1 = {
                            toUser: {
                                _id: 'admin',
                                fullName: 'admin',
                                avatar: 'admin'
                            },
                            fromUser: {
                                _id: authData.user._id,
                                fullName: authData.user.fullName,
                                avatar: authData.user.avatar
                            },
                            content: `${authData.user.fullName} vừa đăng thêm một bài học mới "${url}" trong khóa học ${course.title} `,
                            type: 'notify'
                        }
                        api({ type: TypeHTTP.POST, sendToken: false, path: '/notification/save', body: body1 })

                    })
            })
    }

    const handleDelete = (id) => {
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/coursedetail/delete/${id}` })
            .then(course => {
                notifyHandler.notify(notifyType.SUCCESS, 'Xóa Bài Học Thành Công')
                setCourseDetails(courseDetails.filter(item => item._id !== course._id))
            })
    }

    return (
        <div className='min-w-[100%] p-[1rem] flex flex-col gap-2 h-full'>
            {course && (
                <>
                    <div className='flex items-center'>
                        <i onClick={() => setCurrentCourse()} className='bx bx-chevron-left text-[30px] cursor-pointer text-[#333333]'></i>
                        <span className='font-semibold text-[#393939] text-[18px]'>{course.title}</span>
                    </div>
                    <div className='grid grid-cols-2 gap-20 w-full'>
                        <div className='flex flex-col gap-2'>
                            <input value={title} onChange={e => setTitle(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Title' />
                            <div>Giáo viên đăng tải video lên youtube và gán đường link vào ô bên dưới</div>
                            <input value={url} onChange={e => setUrl(e.target.value)} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='URL Video' />
                        </div>
                        <div className='flex justify-start items-center'>
                            <button onClick={() => handleCreate()} className='hover:scale-[1.02] transition font-semibold rounded-[10px] px-[2rem] py-[12px] text-[white] bg-[#241d49]'>Create</button>
                        </div>
                    </div>
                    <div className=' w-full flex flex-col mt-[1rem] gap-2 h-[90%] overflow-auto'>
                        {courseDetails.map((course, index) => (
                            <div key={index} className='flex cursor-pointer transition-all items-center gap-2 relative px-[1rem] py-2 bg-[#f6f6f6] rounded-lg'>
                                <span className='font-semibold text-[15px] mr-[1rem]'>{index + 1}</span>
                                <div className='flex flex-col'>
                                    <span className='font-semibold text-[15px]'>{course.title}</span>
                                    <span className='text-[12px]'>URL: https://www.youtube.com/watch?v={course.url}</span>
                                </div>
                                <div className='flex gap-2 absolute right-[1rem] top-[50%] translate-y-[-50%]'>

                                    <button onClick={() => handleDelete(course._id)} className='bg-[red] px-2 py-1 rounded-md text-[white] font-semibold'>delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default ChiTietBaiHoc