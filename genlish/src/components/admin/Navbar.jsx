import React, { useContext, useEffect, useState } from 'react'
import Logo from '../Logo'
import { notifyContext } from '@/context/NotifyContext'
import { authContext } from '@/context/AuthContext'
import { formatDateNotify } from '@/utils/time'
import { api, TypeHTTP } from '@/utils/api'

const Navbar = ({ setOption }) => {

    const { notifyHandler } = useContext(notifyContext)
    const { authData, authHandler } = useContext(authContext)
    const [notifies, setNotifies] = useState([])
    const [visibleNotify, setVisibleNotify] = useState(false)

    const handleSignOut = () => {
        globalThis.localStorage.removeItem('accessToken')
        globalThis.localStorage.removeItem('refreshToken')
        authHandler.setUser()
        notifyHandler.navigate('/')
    }

    useEffect(() => {
        if (authData.user) {
            api({ type: TypeHTTP.GET, sendToken: false, path: '/notification/get-all' })
                .then(res => {
                    const filter = res.filter(item => item.toUser._id === 'admin')
                    setNotifies(filter.filter(item => item.type === 'notify'))
                })
        }
    }, [authData.user])

    return (
        <section className='w-[60px] flex flex-col items-center py-[1.25rem] border-r-[2px] px-2 border-[#f4f4f4]'>
            <div className='pb-3 w-full flex justify-center border-b-[2px] border-[#ececec]'>
                <div className='w-[30px] h-[30px] rounded-full overflow-hidden flex items-start justify-center'>
                    <img width={'30px'} src='/logo.png' />
                </div>
            </div>
            <div className='flex flex-col items-center gap-4 mt-3 w-full'>
                <div className='pb-3 w-full flex flex-col gap-4 items-center justify-center border-b-[2px] border-[#ececec]'>
                    <div onClick={() => { }} style={{ transition: '0.4s' }} className='flex relative rounded-lg px-2 items-center gap-4 cursor-pointer'>
                        <span className='absolute text-[10px] w-[15px] text-[white] flex items-center justify-center top-[-7px] right-[5px] h-[15px] bg-[red] rounded-full'>{notifies.length}</span>
                        <svg onClick={() => setVisibleNotify(!visibleNotify)} class="w-5 h-5 text-[#5f5f5f] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z" />
                        </svg>
                        <div style={{ width: visibleNotify ? '400px' : 0, height: visibleNotify ? '400px' : 0, transition: '0.5s', right: visibleNotify ? '-410px' : 0, overflow: visibleNotify ? 'auto' : 'hidden' }} className='bg-[white] z-50 flex flex-col gap-1 absolute top-[-10px] py-1 rounded-lg shadow-lg'>
                            {notifies.map((item, index) => (
                                <div key={index} className='w-full bg-[#f0f0f0] text-[black] px-4 py-2 flex flex-col gap-1'>
                                    <div className='flex items-center gap-2 text-[14px]'    >
                                        <span>từ</span>
                                        <img src={item.fromUser.avatar} className='w-[35px] h-[35px] rounded-full' />
                                        <span>{item.fromUser.fullName}</span>
                                    </div>
                                    <span className='text-[14px]'>{item.content}</span>
                                    <span className='text-[13px]'>{formatDateNotify(item.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div onClick={() => setOption('a')} style={{ transition: '0.4s' }} className='flex rounded-lg px-2 items-center gap-4 cursor-pointer'>
                    <svg class="w-5 h-5 text-[#5f5f5f] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z" />
                    </svg>
                </div>
                <div onClick={() => setOption('c')} style={{ transition: '0.4s' }} className='flex rounded-lg px-2 items-center gap-4 cursor-pointer'>
                    <svg class="w-5 h-5 text-[#5f5f5f]  " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM9 12h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Zm5.697 2.395v-.733l1.269-1.219v2.984l-1.268-1.032Z" />
                    </svg>
                </div>
                <div onClick={() => setOption('d')} style={{ transition: '0.4s' }} className='flex rounded-lg px-2 items-center gap-4 cursor-pointer'>
                    <svg class="w-5 h-5 text-[#5f5f5f] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                    </svg>
                </div>
                <div onClick={() => setOption('e')} style={{ transition: '0.4s' }} className='flex rounded-lg px-2 items-center gap-4 cursor-pointer'>
                    <svg class="w-5 h-5 text-[#5f5f5f] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="2" d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z" />
                    </svg>
                </div>
                <div onClick={() => setOption('f')} style={{ transition: '0.4s' }} className='flex rounded-lg px-2 items-center gap-4 cursor-pointer'>
                    <svg class="w-5 h-5 text-[#5f5f5f] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="2" d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z" />
                    </svg>
                </div>
                <div onClick={() => setOption('g')} style={{ transition: '0.4s' }} className='flex rounded-lg px-2 items-center gap-4 cursor-pointer'>
                    <svg class="w-5 h-5 text-[#5f5f5f] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z" />
                    </svg>
                </div>
                <div onClick={() => handleSignOut()} style={{ transition: '0.4s' }} className='flex rounded-lg px-2 items-center gap-4 cursor-pointer'>
                    <svg class="w-5 h-5 text-[#5f5f5f] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18V6h-5v12h5Zm0 0h2M4 18h2.5m3.5-5.5V12M6 6l7-2v16l-7-2V6Z" />
                    </svg>
                </div>
            </div>
        </section>
    )
}

export default Navbar