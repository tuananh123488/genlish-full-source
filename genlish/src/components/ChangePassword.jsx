import { authContext } from '@/context/AuthContext';
import { notifyContext, notifyType } from '@/context/NotifyContext';
import { api, TypeHTTP } from '@/utils/api';
import React, { useContext, useState } from 'react'

const ChangePassword = ({ change, setChange }) => {
    const { authData, authHandler } = useContext(authContext);
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const { notifyHandler } = useContext(notifyContext)

    const handleChange = () => {
        if (oldPassword === "" || newPassword === "") {
            notifyHandler.notify(notifyType.WARNING, 'Vui lòng không để trống')
            return
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(oldPassword)) {
            notifyHandler.notify(notifyType.WARNING, 'Mật khẩu không hợp lệ. Mật khẩu ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số');
            return;
        }
        if (!passwordRegex.test(newPassword)) {
            notifyHandler.notify(notifyType.WARNING, 'Mật khẩu không hợp lệ. Mật khẩu ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            notifyHandler.notify(notifyType.WARNING, 'Mật khẩu mới phải trùng với mật khẩu xác nhận')
            return
        }
        api({ path: '/user/updatePassword', body: { id: authData.user?._id, oldPassword: oldPassword, newPassword: newPassword }, sendToken: true, type: TypeHTTP.POST })
            .then(res => {
                setOldPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
                notifyHandler.notify(notifyType.SUCCESS, 'Cập nhật mật khẩu thành công')

                setChange()

                globalThis.localStorage.removeItem('accessToken')
                globalThis.localStorage.removeItem('refreshToken')
                authHandler.setUser()
                notifyHandler.navigate('/')
            }).catch(e => {
                notifyHandler.notify(notifyType.FAIL, e.message.data)
            })
    }
    return (
        <div style={{ right: change ? '0' : '-100%', transition: '0.5s' }} className='bg-[white] z-40 fixed top-0 w-[95%] gap-3 p-[1.5rem] h-screen overflow-y-auto justify-center  items-center flex flex-col'>
            <input value={oldPassword} type='password' onChange={(e) => setOldPassword(e.target.value)} className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] w-[500px] px-4 mt-10 border border-[#e1e1e1]' placeholder='Nhập mật khẩu hiện tại' />
            <input value={newPassword} type='password' onChange={(e) => setNewPassword(e.target.value)} className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] w-[500px] px-4 border border-[#e1e1e1]' placeholder='Nhập mật khẩu mới' />
            <input value={confirmNewPassword} type='password' onChange={(e) => setConfirmNewPassword(e.target.value)} className='rounded-lg text-[15px] focus:outline-none shadow-sm h-[45px] w-[500px] px-4 border border-[#e1e1e1]' placeholder='Xác nhận mật khẩu mới' />
            <button onClick={() => handleChange()} className='rounded-lg text-[15px] h-[45px] focus:outline-0 hover:scale-[1.05]  w-[200px] transition-all bg-blue-400 text-white'>Đổi mật khẩu</button>
            <button onClick={() => setChange()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
        </div>

    )
}

export default ChangePassword