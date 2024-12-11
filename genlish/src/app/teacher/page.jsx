'use client'


import ChangePassword from '@/components/ChangePassword'
import Logo from '@/components/Logo'
import CacKhoaHoc from '@/components/teacher/CacKhoaHoc'
import ChiTietBaiHoc from '@/components/teacher/ChiTietBaiHoc'
import Navbar from '@/components/teacher/Navbar'
import QLCacBaiHoc from '@/components/teacher/QLCacBaiHoc'
import ThongKeDoanhThu from '@/components/teacher/ThongKeDoanhThu'
import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { handleFileUpload, handleImageUpload } from '@/utils/file'
import { formatDuration, formatMoney, parseISO8601Duration, removeVietnameseTones } from '@/utils/other'
import { convertSecondsToReadableFormat } from '@/utils/time'
import axios from 'axios'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'

const Teacher = () => {
    const [gates, setGates] = useState([])
    const { notifyHandler } = useContext(notifyContext)
    const [broadcasts, setBroadCasts] = useState([])
    const { authData, authHandler } = useContext(authContext)
    const [option, setOption] = useState('a')
    const [currentCourse, setCurrentCourse] = useState()
    const [change, setChange] = useState()

    const handleChange = (e) => {
        const { name, value } = e.target;
        authHandler.setUser(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateUser = () => {
        api({ path: '/user/update', body: authData.user, type: TypeHTTP.POST, sendToken: true }).then(res => {
            notifyHandler.notify(notifyType.SUCCESS, 'Update thành công')
            authHandler.setUser(res)
        })
    }

    return (
        <section className='w-full h-screen flex'>
            <Navbar setOption={setOption} />
            <div className=' w-full h-screen overflow-y-auto'>
                {option === "a" ? (
                    <CacKhoaHoc />
                ) : option === "b" ? (
                    <div className='flex w-full h-full'>
                        <div style={{ marginLeft: currentCourse ? '-100%' : '0%', transition: '0.5s' }} className='flex w-[100%] h-full'>
                            <QLCacBaiHoc setCurrentCourse={setCurrentCourse} courses={courses} />
                            <ChiTietBaiHoc setCurrentCourse={setCurrentCourse} course={currentCourse} />
                        </div>
                    </div>
                ) : option === "c" ? (
                    <div className='flex h-screen'>
                        <div className='w-[100%] h-full justify-center translate-y-[-50px] gap-5 flex flex-col items-center'>
                            <img src={authData.user?.avatar} alt="" className='col-span-2 w-[200px] aspect-square rounded-full' />
                            <section className='w-[100%] grid grid-cols-2 gap-[1rem] px-[12rem] justify-center items-center overflow-y-auto'>

                                <div className="flex flex-col">
                                    <label

                                        className="text-[14px] font-medium mb-2"
                                    >
                                        Số điện thoại
                                    </label>
                                    <input
                                        name="phone"
                                        value={authData.user?.phone}
                                        onChange={handleChange}
                                        className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] px-4 border border-[#e1e1e1]'
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label

                                        className="text-[14px] font-medium mb-2"
                                    >
                                        Họ tên
                                    </label>
                                    <input
                                        name="fullName"
                                        value={authData.user?.fullName}
                                        onChange={handleChange}
                                        className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] px-4 border border-[#e1e1e1]'
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label

                                        className="text-[14px] font-medium mb-2"
                                    >
                                        Địa chỉ
                                    </label>
                                    <input
                                        name="address"
                                        value={authData.user?.address}
                                        onChange={handleChange}
                                        className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] px-4 border border-[#e1e1e1]'
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label

                                        className="text-[14px] font-medium mb-2"
                                    >
                                        Giới tính
                                    </label>
                                    <select
                                        name="gender"
                                        onChange={handleChange}
                                        className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] px-4 border border-[#e1e1e1]'
                                    >

                                        <option value={true}>Nam</option>
                                        <option value={false}>Nữ</option>
                                    </select>
                                </div>

                                <span className='font-semibold'>Thông tin thanh toán</span>
                                <div />

                                <input
                                    placeholder='Tên ngân hàng'
                                    value={authData.user?.bank?.bankName}
                                    onChange={e => authHandler.setUser(prevData => ({
                                        ...prevData,
                                        bank: { ...prevData.bank, bankName: e.target.value },
                                    }))}
                                    className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] px-4 border border-[#e1e1e1]'
                                />
                                <input
                                    placeholder='Tên tài khoản'
                                    value={authData.user?.bank?.accountName}
                                    onChange={e => authHandler.setUser(prevData => ({
                                        ...prevData,
                                        bank: { ...prevData.bank, accountName: e.target.value },
                                    }))}
                                    className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] px-4 border border-[#e1e1e1]'
                                />
                                <input
                                    placeholder='Số tài khoản'
                                    value={authData.user?.bank?.accountNumber}
                                    onChange={e => authHandler.setUser(prevData => ({
                                        ...prevData,
                                        bank: { ...prevData.bank, accountNumber: e.target.value },
                                    }))}
                                    className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] px-4 border border-[#e1e1e1]'
                                />
                                <div />
                                <button onClick={() => handleUpdateUser()} className='rounded-lg text-[15px] h-[45px] focus:outline-0 hover:scale-[1.05] transition-all bg-blue-400 text-white'> Cập nhật thông tin người dùng</button>
                                <button onClick={() => setChange('d')} className='rounded-lg text-[15px] h-[45px] focus:outline-0 hover:scale-[1.05] transition-all bg-red-400 text-white'>Đổi mật khẩu</button>
                            </section>
                        </div>
                        <ChangePassword setChange={setChange} change={change} />
                    </div>
                ) : (
                    <ThongKeDoanhThu />
                )}
            </div>
        </section >
    )
}

export default Teacher