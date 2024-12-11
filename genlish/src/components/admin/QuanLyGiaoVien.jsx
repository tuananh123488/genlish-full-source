import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { formatDate } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const QuanLyGiaoVien = () => {

    const [users, setUsers] = useState([])
    const [userFilters, setUserFilters] = useState([])
    const [name, setName] = useState('')
    const [screen, setScreen] = useState(0)
    const [currentUser, setCurrentUser] = useState()
    const { notifyHandler } = useContext(notifyContext)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        api({ type: TypeHTTP.GET, path: '/user/get-all-teacher', sendToken: true })
            .then(res => {
                setUsers(res)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        const filteredUsers = users.filter(user =>
            user.fullName.toLowerCase().includes(name.toLowerCase())
        )
        setUserFilters(filteredUsers)
    }, [name, users])

    const handleAcceptRecord = (user) => {
        api({ sendToken: true, type: TypeHTTP.POST, body: { ...user, statusTeacher: true }, path: '/user/update' })
            .then(res => {
                if (currentUser._id === res._id) {
                    setCurrentUser({ ...currentUser, statusTeacher: res.statusTeacher })
                }
                setUsers(prev => prev.map(item => {
                    if (item._id === res._id) {
                        return { ...item, statusTeacher: res.statusTeacher }
                    }
                    return item
                }))
                // notify
                const body1 = {
                    toUser: {
                        _id: user._id,
                        fullName: user.fullName,
                        avatar: user.avatar
                    },
                    fromUser: {
                        _id: 'admin',
                        fullName: 'admin',
                        avatar: 'admin'
                    },
                    content: `Quản trị viên đã phê duyệt hồ sơ của bạn`,
                    type: 'notify'
                }
                api({ type: TypeHTTP.POST, sendToken: false, path: '/notification/save', body: body1 })
                notifyHandler.notify(notifyType.SUCCESS, 'Phê duyệt hồ sơ giáo viên thành công')
            })
    }

    const handleDelete = (user) => {
        api({ sendToken: true, type: TypeHTTP.DELETE, path: `/user/delete/${user._id}` })
            .then(res => {
                if (currentUser._id === res._id) {
                    setCurrentUser()
                    setScreen(0)
                }
                setUsers(prev => prev.filter(item => item._id !== user._id))
                notifyHandler.notify(notifyType.SUCCESS, 'Xóa hồ sơ giáo viên thành công')
            })
    }

    return (
        <section style={{ marginLeft: `-${screen * 100}%` }} className='flex w-full relative h-[100%] transition-all'>
            {loading === false ? (<>
                <div className='flex flex-col h-full min-w-[100%] p-[1.5rem]'>
                    <div className='flex justify-between'>
                        <h1 className='font-semibold text-[20px]'>Tất Cả Giáo Viên: {users.length}</h1>
                        <div className='flex items-center gap-2'>

                            <input value={name} onChange={e => setName(e.target.value)} placeholder='Tìm giáo viên' className='text-[14px] px-2 h-[37px] w-[200px] rounded-md focus:outline-none border-[#c4c4c4] border-[1px]' />
                        </div>
                    </div>
                    {name === '' ? (
                        <div className='w-full grid grid-cols-4 gap-2 mt-3'>
                            {users.map((user, index) => (
                                <div onClick={() => {
                                    setCurrentUser(user)
                                    setScreen(1)
                                }} key={index} className='cursor-pointer transition-all hover:scale-[1.05] flex w-full rounded-lg bg-[#f0f0f0] relative gap-2 p-[10px]'>
                                    <img src={user.avatar} className='rounded-full w-[50px] h-[50px]' />
                                    <div className='flex flex-col gap-[2px]'>
                                        <span>{user.fullName}</span>
                                        <span className='text-[14px]'>Số lượng khóa học: {user.courses.length}</span>
                                        <span className='text-[13px]' style={{ color: user.statusTeacher === false ? '#888' : 'blue' }}>{user.statusTeacher === false ? 'Chưa phê duyệt' : 'Đã phê duyệt'}</span>
                                    </div>
                                    <div className='right-2 top-1 absolute flex flex-col gap-2'>
                                        {user.statusTeacher === false && (
                                            <button onClick={() => handleAcceptRecord(user)} className='p-1 transition-all'>
                                                <i className="fa-solid fa-check text-[#999] transition-all hover:text-[blue]"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='w-full grid grid-cols-4 gap-2 mt-3'>
                            {userFilters.map((user, index) => (
                                <div onClick={() => {
                                    setCurrentUser(user)
                                    setScreen(1)
                                }} key={index} className='flex w-full rounded-lg bg-[#f0f0f0] gap-2 p-[10px]'>
                                    <img src={user.avatar} className='rounded-full w-[50px] h-[50px]' />
                                    <div className='flex flex-col gap-[2px]'>
                                        <span>{user.fullName}</span>
                                        <span className='text-[14px]'>Số lượng khóa học: {user.courses.length}</span>
                                    </div>
                                    <div className='right-2 top-1 absolute flex flex-col gap-2'>
                                        {user.statusTeacher === false && (
                                            <button onClick={() => handleAcceptRecord(user)} className='p-1 transition-all'>
                                                <i className="fa-solid fa-check text-[#999] transition-all hover:text-[blue]"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='flex flex-col h-[100%] min-w-[100%] p-[1.5rem]'>
                    {currentUser && (
                        <>
                            <div className='flex items-center'>
                                <i onClick={() => setScreen(0)} className='text-[#999] bx bx-chevron-left cursor-pointer text-[30px]' ></i>
                                <span className='font-semibold text-[#999] text-[15px]'>Quay về</span>
                            </div>
                            <div className='flex items-center w-full relative'>
                                <img src={currentUser.avatar} className='w-[120px] h-[120px] rounded-full' />
                                <div className='flex flex-col gap-1'>
                                    <span className='text-[18px]'>{currentUser.fullName}</span>

                                    <span className='text-[14px]'>Số lượng khóa học: {currentUser.courses.length}</span>
                                    <span className='text-[13px]' style={{ color: currentUser.statusTeacher === false ? '#888' : 'blue' }}>{currentUser.statusTeacher === false ? 'Chưa phê duyệt' : 'Đã phê duyệt'}</span>

                                </div>
                                <div className='flex flex-col gap-1 px-[200px]'>
                                    <span className='text-[18px]'>Địa chỉ :{currentUser.address}</span>
                                    <span className='text-[13px]'> Số điện thoại: {currentUser.phone}</span>

                                </div>
                                <div className='right-2 top-[50%] translate-y-[-50%] absolute flex flex-col'>
                                    {currentUser.courses.length == 0 && (
                                        <button onClick={() => handleDelete(currentUser)} className='p-1 transition-all'>
                                            <i className="fa-regular fa-trash-can text-[#999] transition-all hover:text-[red] text-[25px]"></i>
                                        </button>
                                    )}
                                    {currentUser.statusTeacher === false && (
                                        <button onClick={() => handleAcceptRecord(currentUser)} className='text-[14px] text-[white] bg-[#149dff] font-semibold px-4 py-1 rounded-md'>
                                            Phê duyệt hồ sơ
                                        </button>
                                    )}
                                </div>
                            </div>
                            <span className='text-[15px] font-semibold mt-[1rem]'>Tất Cả Khóa Học</span>
                            <div className='flex flex-col gap-2 h-[75%] overflow-y-auto'>
                                {currentUser.courses.length > 0 ? currentUser.courses.map((course, index) => (
                                    <div key={index} className='flex cursor-pointer transition-all hover:bg-[#e4e4e4] items-center gap-2 relative px-[1rem] py-2 bg-[#f6f6f6] rounded-lg'>
                                        <img src={course.image} className='w-[80px] rounded-lg' />
                                        <div className='flex flex-col'>
                                            <span className='font-semibold text-[15px]'>{course.title}</span>
                                            <span className='text-[12px]'>by {course.teacher.fullName}</span>
                                        </div>
                                        <div className='flex flex-col absolute right-[1rem] top-[50%] translate-y-[-50%]'>
                                            <span className='text-[13px]'>{course.type === 'free' ? 'Miễn Phí' : 'Trả Phí'}</span>
                                            {course.type === 'pay' && (
                                                <span className='text-[12px]'>by {course.price}</span>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <span className='w-full mt-[1rem] text-center'>Hiện giáo viên chưa có khóa học </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </>) : (<>
                <div role="status" className='flex flex-col items-center gap-2 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'>
                    <svg aria-hidden="true" className="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-[black]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className='text-[18px]'>Đang tải dữ liệu giáo viên</span>
                </div>
            </>)}
        </section>
    )
}

export default QuanLyGiaoVien