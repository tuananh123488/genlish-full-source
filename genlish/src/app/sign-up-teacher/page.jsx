'use client'
import React, { useContext, useState } from 'react'
import { m, motion } from 'framer-motion'
import { avatar } from '@material-tailwind/react'
import { roles } from '../page'
import { api, TypeHTTP } from '@/utils/api'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { useRouter } from 'next/navigation'

const SignUpTeacher = () => {
    const router = useRouter()
    const { notifyHandler } = useContext(notifyContext)
    const [info, setInfo] = useState({
        phone: '',
        password: '',
        confirmPassword: '',
        avatar: 'https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0',
        statusSignUp: 7,
        role: 'TEACHER',
        address: '',
        dob: '',
        fullName: '',
        gender: null,
        bank: {
            bankName: '',
            accountName: '',
            accountNumber: ''
        },
        statusTeacher: false
    })

    const reset = () => {
        setInfo({
            phone: '',
            password: '',
            confirmPassword: '',
            avatar: 'https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0',
            statusSignUp: 7,
            role: 'TEACHER',
            address: '',
            dob: '',
            fullName: '',
            gender: null,
            bank: {
                bankName: '',
                accountName: '',
                accountNumber: ''
            },
            statusTeacher: false
        })
    }

    const handleSignUp = () => {
        if (info.phone === '' || info.password === '' || info.address === '' || info.fullName === '' || info.gender === null || info.dob === null || info.confirmPassword === '') {
            notifyHandler.notify(notifyType.WARNING, 'Vui lòng nhập đầy đủ thông tin')
            return
        }

        if (info.confirmPassword !== info.password) {
            notifyHandler.notify(notifyType.WARNING, 'Mật khẩu xác nhận không khớp');
            return;
        }
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

        if (!phoneRegex.test(info.phone)) {
            notifyHandler.notify(notifyType.WARNING, 'Số điện thoại không hợp lệ');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(info.password)) {
            notifyHandler.notify(notifyType.WARNING, 'Mật khẩu không hợp lệ. Mật khẩu ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số');
            return;
        }
        api({ type: TypeHTTP.POST, sendToken: false, path: '/auth/sign-up-with-teacher', body: info })
            .then(res => {
                notifyHandler.notify(notifyType.SUCCESS, 'Đăng ký thành công, hãy chờ quản trị viên phê duyệt')
                setTimeout(() => {
                    router.push('/')
                    reset()
                }, 500);

                // notify
                const body1 = {
                    toUser: {
                        _id: 'admin',
                        fullName: 'admin',
                        avatar: 'admin'
                    },
                    fromUser: {
                        _id: info.phone,
                        fullName: info.fullName,
                        avatar: 'https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0'
                    },
                    content: `${info.fullName} yêu cầu phê duyệt thông tin đăng nhập`,
                    type: 'notify'
                }
                api({ type: TypeHTTP.POST, sendToken: false, path: '/notification/save', body: body1 })
            })
            .catch(res => {
                notifyHandler.notify(notifyType.FAIL, res.message)
            })
    }

    return (
        <motion.div
            initial={{ x: 200 * -1 }}
            animate={{ x: 0 }}
            exit={{ x: 1920 * -1, transition: { duration: 0.2 } }}
        >
            <div className='w-screen h-screen flex flex-col items-center justify-center relative'>
                <div onClick={() => router.push('/')} className='w-full cursor-pointer absolute left-6 flex items-center gap-2 top-2 text-[#3f3f3f]'>
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Trở về</span>
                </div>
                <div className='flex items-end gap-2 mt-[2rem]'>
                    <img src='/logo.png' className='w-[40px]' />
                    <span className='text-[23px] font-bold font-nunitosans'>Đăng Ký Hồ Sơ Giáo Viên</span>
                </div>
                <div className='w-[800px] grid grid-cols-2 gap-3 mt-[1rem]'>
                    <input value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} className='rounded-lg text-[15px] w-full focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Số điện thoại +84' />
                    <input value={info.fullName} onChange={e => setInfo({ ...info, fullName: e.target.value })} className='rounded-lg text-[15px] w-full focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Họ Và Tên' />
                    <input value={info.address} onChange={e => setInfo({ ...info, address: e.target.value })} className='rounded-lg text-[15px] w-full focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Địa Chỉ' />
                    <input value={info.dob} onChange={e => setInfo({ ...info, dob: e.target.value })} type='date' className='rounded-lg text-[15px] w-full focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                    <select value={info.gender} onChange={e => setInfo({ ...info, gender: Boolean(e.target.value) })} className='rounded-lg text-[15px] w-full focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]'>
                        <option value={null}>Chọn Giới Tính</option>
                        <option value={true}>Nam</option>
                        <option value={false}>Nữ</option>
                    </select>
                    <div />
                    <input value={info.password} onChange={e => setInfo({ ...info, password: e.target.value })} type='password' className='rounded-lg text-[15px] w-full focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Mật Khẩu' />
                    <input value={info.confirmPassword} onChange={e => setInfo({ ...info, confirmPassword: e.target.value })} type='password' className='rounded-lg text-[15px] w-full focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='Xác Nhận Mật Khẩu' />
                </div>
                <div className='w-[800px] mt-[2rem] flex flex-col items-center gap-2'>
                    <span className='text-[18px] font-semibold w-[100%]'>Khi bạn là giáo viên của Genlish</span>
                    <div className='flex flex-col w-[95%] gap-2'>
                        <span>- Có thể đăng tải khóa học liên quan đến đào tạo tiếng anh của bạn</span>
                        <span>- Quản lý các học viên đăng ký theo học</span>
                        <span>- Kiếm thêm thu nhập khi học viên đăng ký khóa học của bạn (phí 20% doanh thu)</span>
                    </div>
                </div>
                <button onClick={() => handleSignUp()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[300px] mt-[1.5rem] py-[7px] rounded-lg">Đăng Ký Hồ Sơ</button>
            </div>
        </motion.div>
    )
}

export default SignUpTeacher